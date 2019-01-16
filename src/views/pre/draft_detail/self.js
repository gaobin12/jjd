
import '../detail.less'
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Flex, List } from 'antd-mobile'
import { Tap } from 'COMPONENT'
import { Loading, Modal, util } from 'SERVICE'

@withRouter
@inject('userStore','preDraftStore')
@observer
export default class Page extends Component {

	constructor (props, context) {
		document.title = "草稿详情"; 
		super(props, context)
		let query = util.getUrlParams(this.props.location.search);
		this.state = {
            id:query.id,
		};
	}
	
	componentDidMount(){
		this.getDetail()
		this.props.userStore.checkUserAtten()
	}

	getDetail(){
		let { userStore,preDraftStore } = this.props;
		Loading.show();
		$.ajaxE({
			type: 'GET',
			url: '/loanpre/product/getProductInfoBySelf',
			data:{
				id:this.state.id,
			}
		}).then((data)=>{
			let json = {
				loanerName:userStore.userInfo.userName,
				borrowDays:data.product.borrowDays,
				amount:$.toYuan(data.product.minAmount),
				interestRate:data.product.interestRate,
				purpose:data.product.purpose,
				purposeTxt:$.purpose(data.product.purpose)
			};
			json.interest = $.to2(util.iouComputedInterest(json.amount,json.interestRate,json.borrowDays));
			json.totalAmt = json.amount+json.interest;
			preDraftStore.setDetail(json);

			//微信分享设置
			$.setItem('wx_share',{
				id:this.state.id,
				path:'/pre/loan_draft',
				amt:json.amount,
				rate:json.interestRate,
				purpose:json.purpose,
                param: {
                    loanType: 4,
                    loanTypeStr: '借条草稿',
                    creatorType: '出借人',
                    rate: json.interestRate,
                    creatorName: json.loanerName,
                    repayDate: json.borrowDays+'天',
                    repayType: '还本付息',
                }
			});
			$.wxShare();
		}).catch((msg)=>{
            Modal.infoX(msg);
		}).finally(()=>{
			Loading.hide();
		})
	}

	onDelete=()=>{
		let { userStore } = this.props;
		//检查用户是否关注过今借到
        if(!userStore.checkUserAtten()){
            return;
		}
		
		userStore.setBox({
			pwd:true,
			onPwdEnd:this.onDeleteConfirm
		})
	}

	//删除借条
	onDeleteConfirm=(pwd)=>{
		let _this = this;		
		Loading.show();
		$.ajaxE({
			type: 'GET',
			url: '/loanpre/product/delOfflineProductInfo',
			data:{
				id: _this.state.id,
				payPassword: pwd
			}
		}).then((data)=>{
			_this.setState({
				popupPwd: false
			},()=>{
				Modal.infoX('删除成功',()=>{
					history.back()
				})
			})
		}).catch((msg)=>{
			_this.setState({
				popupPwd: false
			},()=>{
				Modal.infoX(msg);
			})			
		}).finally(()=>{
			//Loading.show();
			Loading.hide();
		})
	}
	//分享借条
	onShare=()=>{
		let { userStore } = this.props;
		//检查用户是否关注过今借到
        if(!userStore.checkUserAtten()){
            return;
		}

		this.props.history.push({
			pathname: '/user/share'
		});
	}

	render () {
		const { userStore, preDraftStore:{detail} } = this.props;
		return (
			<div className="view-pre-detail">
				<div style={{height: '100%',overflow:'auto'}}>	
                    <Flex justify='start' className='list-title'>
                        <span className='title'>借款内容</span>
                    </Flex>
                    <List className="detail_list">
                        <List.Item extra={detail.loanerName}>出借人</List.Item>
                        <List.Item extra={detail.amount+"元"}>借款金额</List.Item>
                        <List.Item extra={'借款人确认日期'}>借款日期</List.Item>
                        <List.Item extra={detail.borrowDays+"天"}>借款时长</List.Item>
                        <List.Item extra={detail.interestRate+"%, "+detail.interest+"元"}>年化利率</List.Item>
                        <List.Item>
							<div style={{ width: '100%', textAlign: 'right' }}>
								本金{detail.amount} + 利息{detail.interest} = 到期本息{detail.totalAmt}元
							</div>
						</List.Item>
                        <List.Item extra={detail.purposeTxt}>借款用途</List.Item>
                        <List.Item extra={<Link to="/agree/iou" className="link">点击查看/下载</Link>}>
                        借款协议</List.Item>
                    </List>
                </div>
				<div className='common-btn_box'>
					<Tap className='span font16 active' onTap={this.onDelete}>删除</Tap>
					<Tap className='c-black span font16 active' onTap={this.onLoanPay}>分享</Tap>
				</div>
			</div>
		)
	}
}