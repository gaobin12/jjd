
//首页 => 出借产品列表详情（别人看）
import '../detail.less'
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Flex, List } from 'antd-mobile'
import { Loading, Modal, util, math } from 'SERVICE'
import { Tap } from 'COMPONENT'

@withRouter
@inject('userStore','preLoanStore')
@observer
export default class Page extends Component {

	constructor (props, context) {
		document.title = "借条详情"; 
		super(props, context)
		let query = util.getUrlParams(props.location.search);
		this.state = {
            id:query.id,
			atten:false,   
            popupPwd:false
		};
	}
	
	componentDidMount(){
		this.getPageInfo();
	}

	//获取借条详情
	getPageInfo=()=>{
        Loading.show();
        const { userStore,preLoanStore } = this.props;
		$.ajaxE({
			type: 'GET',
			url: '/loanpre/product/getProductBid',
			data:{
				id:this.state.id,
			}
		}).then((data)=>{
			data.amount = $.toYuan(data.amount);
			data.repayTypeText = $.repayType(data.repayType);
			data.purpose = $.purpose(data.purpose);
			data.createDate = (new Date(data.createDate*1000)).Format('yyyy-MM-dd hh:mm');
			if(data.repayType){
                data.formatTime = data.period + "期";
            }else{
                data.formatTime = data.period + (data.tmUnit?'个月':'天');
            }
			data.picStr = data.picStr?data.picStr:[];  
            preLoanStore.setDetail(data);
            // userStore.setShareInfo({
            //     id:this.state.id,
			// 	path:'/pre/loan_detail'
            // });
		}).catch((msg)=>{
			Modal.infoX(msg);
		}).finally(()=>{
            Loading.hide();
        })
	}

	//删除
	onClose=()=>{
		Modal.confirmX('确认关闭该借条吗？',
		()=>{
			Loading.show();
			$.ajaxE({
				type: 'GET',
				url: '/loanpre/loanOffline/deleteLoanOffline',
				data:{
					loanId:this.state.id
				}
			}).then((data)=>{
				this.props.history.push('/home'); 
			}).catch((msg)=>{
				Modal.infoX(msg);
			}).finally(()=>{
				Loading.hide();
			})
		},()=>{			
		})
	}
	
	render () {
		const { userStore, preLoanStore:{detail} } = this.props;
		return (
			<div className="view-pre-detail" style={{paddingBottom:'50px'}}>
                <div style={{height: '100%',overflow:'auto',paddingBottom:'0.2rem'}}>					
                    <Flex justify='start' direction='column' className='list-top'>
                        <div className='top-prd-sel'></div>
                        <div className='bottom-prd-sel'></div>
                        <div className='user-box' style={{width:document.body.offsetWidth-40}}>
                            <Flex justify='start' direction='row' className='user-msg'>
                                <span className='img'>
									<img src={detail.avatarUrl?detail.avatarUrl:'/imgs/iou/user.svg'} />
                                </span>
                                <span className='text'>
                                    <span className='name'>{detail.fullName}</span>
                                    <span className='tel num-font'>{detail.telephone}</span>
                                </span>
                            </Flex>
                            <Flex justify='start' direction='row' className='user-money prd-com'>
                                <div className='money-1'>
                                    <span className='money num-font'>
                                        {detail.toReceiveAmount}<span>元</span>
                                    </span>
                                    <span className='text'>
                                        待收金额
                                    </span>
                                </div>
                                <div className='money-2'>
                                    <span className='money num-font'>
                                        {detail.toRepayAmount}<span>元</span>
                                    </span>
                                    <span className='text'>
                                        待还金额
                                    </span>
                                </div>
                                <div className='money-3'>
                                    <span className='money num-font'>
                                        {detail.currentGuaranteeAmount}<span>元</span>
                                    </span>
                                    <span className='text'>
                                        正在担保
                                    </span>
                                </div>
                            </Flex>
                            <Flex justify="between" className='prd-btn'>
                                <Tap className="com-btn-border--big">全部产品</Tap>
                                <Tap className="com-btn-solid--big">信用报告</Tap>
                            </Flex>
                        </div>
                    </Flex>
                    <Flex justify='start' className='list-title'>
                        <span className='title'>借款内容</span>
                    </Flex>
                    <List className="detail_list">
                        <List.Item>
                            <img className='time-img' src='/imgs/iou/time.svg'/>
                            <span className='time-text num-font'>{detail.createDate}</span>
                        </List.Item>
                        <List.Item extra={detail.borrowerName}>借款人</List.Item>
                        <List.Item extra={detail.lenderName}>出借人</List.Item>
                        <List.Item extra={detail.amount+'元'}>借款金额</List.Item>
                        <List.Item extra={detail.formatTime}>借款时长</List.Item>
                        <List.Item extra={detail.interestRate+'%'}>借款利率</List.Item>
                        <List.Item extra={detail.purpose}>借款用途</List.Item>
                        <List.Item extra={detail.originalId}>借条ID</List.Item>
                        <List.Item extra={detail.createDate}>创建时间</List.Item>
                        <List.Item extra={<Link to="/agree/iou" className="link">点击查看/下载</Link>}>
                        借款协议</List.Item>
                    </List>
                </div>             
                <div className="common-btn_box">
                    <Tap onTap={this.onClose} className='c-black span font16 active'>
                      关闭 
                    </Tap>
                </div>
            </div>
		)
	}
}