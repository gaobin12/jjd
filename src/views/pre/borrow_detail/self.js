//首页 => 借条详情（求借款）别人看的
import '../detail.less'
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Flex, List } from 'antd-mobile'
import { Tap } from 'COMPONENT'
import { Loading, Modal, util, math } from 'SERVICE'

@withRouter
@inject('userStore','preBorrowStore')
@observer
export default class Page extends Component {

	constructor (props, context) {
		document.title = "借条详情"; 
		super(props, context)
		let query = util.getUrlParams(this.props.location.search);
		this.state = {
            id:query.id,
		};
	}
	
	componentDidMount(){
		this.getPageInfo();
    }

	//获取页面数据
	getPageInfo=()=>{
        Loading.show();
        const { userStore,userStore:{userInfo},preBorrowStore } = this.props;
		$.ajaxE({
			type: 'GET',
			url: '/loanpre/bid/getBid',
			data:{
				bidId: this.state.id, //筹款id
				openid: userInfo.userId,
			}
		}).then((data)=>{
            data.id = this.state.id;
			data.createTimeTxt = (new Date(data.createTime * 1000)).Format('yyyy-MM-dd');
			data.repayTimeTxt = (new Date(data.repayTime * 1000)).Format('yyyy-MM-dd');
			data.purposeTxt = $.purpose(data.purposeType);
            data.repayTypeTxt = $.repayType(data.repayType);
            data.picList = data.picList?data.picList:[];
            data.guaranteeIdList = data.guaranteeIdList || [];
            data.loanList = data.loanList || [];
            preBorrowStore.setDetail(data);

            //微信分享
            $.setItem('wx_share',{
                id:this.state.id,
                path:'/pre/borrow_detail',
                amt:Math.round(data.amount/100),
                purpose: data.purposeType,
                time:(new Date(data.createTime * 1000)).Format('yyyy年MM月dd日')+'-'+(new Date(data.repayTime * 1000)).Format('yyyy年MM月dd日'),
                rate:data.interestRate,
				param: {
					loanType: 1,
					loanTypeStr: '求借款',
					creatorType: '借款人',
                    rate:data.interestRate,
					creatorName: '',
                    repayDate: (new Date(data.repayTime * 1000)).Format('yyyy-MM-dd'),
                    repayType: $.repayType(data.repayType),
				}
            });
		}).catch((msg)=>{
            Modal.infoX(msg);
		}).finally(()=>{
			Loading.hide();
        })        
	}	

	//邀请出借人
	onLoan=()=>{
		const { userStore,preBorrowStore:{detail} } = this.props;

		//检查用户是否关注过今借到
        if(!userStore.checkUserAtten()){
            return;
        }

        this.props.history.push({
            pathname: '/user/share'
        });
    }    

    //邀请担保人
	onGuarantee=()=>{
        const { userStore } = this.props;

		//检查用户是否关注过今借到
        if(!userStore.checkUserAtten()){
            return;
        }

        this.props.history.push({
            pathname: '/user/share'
        });
	}
	
	onClose=()=>{
        const { userStore } = this.props;
        //检查用户是否关注过今借到
        if(!userStore.checkUserAtten()){
            return;
        }

        Modal.alertX('提醒', '确认关闭借条?', [
			{ text: '不关闭', onPress: null },
			{ text: '关闭', onPress: () => {
                Loading.show();
                $.ajaxE({
                    type: 'GET',
                    url: '/loanpre/bid/closeBid',
                    data:{
                        bidId: this.state.id
                    }
                }).then((data)=>{
                    Modal.infoX('借条关闭成功!',()=>{
                        history.back();
                    });
                }).catch((msg)=>{
                    Modal.infoX(msg);
                }).finally(()=>{
                    Loading.hide();
                })
			}},
		])
	}
    
	render () {
        const { userStore, preBorrowStore:{detail} } = this.props;
		return (
			<div className="view-pre-detail" style={{paddingBottom:'50px'}}>		
                <div style={{height: '100%',overflow:'auto',paddingBottom:'0.2rem'}}>				
                    <Flex justify='start' direction='column' className='list-top'>
                        <div className='top-sel'></div>
                        <div className='bottom-borr-sel'></div>
                    
                        <div className='user-box borr-user-box-self' style={{width:document.body.offsetWidth-40}}>
                            <Flex justify='start' direction='row' className='borrow-money sel-pad'>
                                <span className="fontC3 font14">
                                    已借到<span className="num-font font24 mainC1">{$.toYuan(detail.getAmount)}</span><i className="unit-borr">元</i>
                                </span>
                                <Tap className="btn-close com-btn-border" onTap={this.onClose}>关闭</Tap>
                            </Flex>
                            <Flex justify='start' direction='row' className='borrow-money padt'>
                                <span className="fontC3 font14">
                                    总金额<span className="num-font font16 fontC1">{$.toYuan(detail.amount)}</span>元
                                    {detail.leftDay>0?<span className="fontC3 font14 marl20">{detail.leftDay}天后关闭</span>:null}
                                    {detail.leftDay==0?<span className="fontC3 font14 marl20">今天到期</span>:null}
                                    {detail.leftDay<0?<span className="fontC3 font14 marl20">已过期</span>:null}
                                </span>
                            </Flex>
                        </div>
                    </Flex>
                    <Flex justify='start' className='list-title'>
                        <span className='title'>借款内容</span>
                    </Flex>
                    <List className="detail_list">
                        <List.Item extra={detail.fullName}>借款人</List.Item>
                        <List.Item extra={detail.interestRate+'%'}>借款利率</List.Item>
                        {detail.guaranteeRate?<List.Item extra={detail.guaranteeRate+'%'}>担保利率</List.Item>:null}
                        <List.Item extra={detail.repayTypeTxt}>还款方式</List.Item>
                        {detail.repayType?<List.Item extra={detail.period}>还款期数</List.Item>:null}
                        <List.Item extra={detail.repayTimeTxt}>还款时间</List.Item>
                        <List.Item extra={detail.purposeTxt}>借款用途</List.Item>
                        <List.Item extra={detail.originalId}>订单编号</List.Item>
                        <List.Item extra={detail.createTimeTxt}>创建时间</List.Item>
                        <List.Item extra={<Link to="/agree/iou" className="link">点击查看/下载</Link>}>
                        借款协议</List.Item>
                    </List>
                    {detail.guaranteeIdList.length?<Flex justify='start' className='list-title mar66'>
                        <span className='title'>担保人(1)</span>
                    </Flex>:null}
                    {detail.guaranteeIdList.length?<Flex className="table_flex table-tit" >
                        <Flex.Item className="head">担保人</Flex.Item>
                        <Flex.Item>此单担保</Flex.Item>
                        <Flex.Item>担保总额</Flex.Item>
                        <Flex.Item>待还</Flex.Item>
                    </Flex>:null}
                    {detail.guaranteeIdList.map((item)=>{
                        return <Flex className="table_flex" >
                                    <Flex.Item className="head">
                                        <img src={item.guaranteeAvatarUrl || '/imgs/credit/sel-jingdong.svg'} />
                                        <span>{item.guaranteeName}</span>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <span className="num-font font16 mainC1">{$.toYuan(item.amount)}</span>
                                        <i>元</i>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <span className="num-font font16 mainC1">{$.toYuan(item.usedAmount)}</span>
                                        <i>元</i>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <span className="num-font font16 mainC1">{$.toYuan(item.toRepayAmount)}</span>
                                        <i>元</i>
                                    </Flex.Item>
                                </Flex>
                    })}
                    {detail.loanList.length?<Flex justify='start' className='list-title mar66'>
                        <span className='title'>借款记录(1)</span>
                    </Flex>:null}
                    {detail.loanList.length?<Flex className="table_flex table-tit" >
                        <Flex.Item className="head">出借人</Flex.Item>
                        <Flex.Item>担保人</Flex.Item>
                        <Flex.Item>借款金额</Flex.Item>
                    </Flex>:null}
                    {detail.loanList.map((item)=>{
                        return <Flex className="table_flex" >
                                    <Flex.Item className="head">
                                        <img src={item.lenderAvatarUrl ||'/imgs/credit/sel-jingdong.svg'} />
                                        <span>{item.lenderName}</span>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <span className="font14 mainC1">{item.guaranteeName || '无'}</span>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <span className="num-font font16 mainC1">{$.toYuan(item.amount)}</span>
                                        <i>元</i>
                                    </Flex.Item>
                                </Flex>
                    })}
                </div>

                <div className="common-btn_box">         
                    <Tap onTap={this.onLoan} className='span font16'>
                        邀请出借人
                    </Tap>	
                    <Tap onTap={this.onGuarantee} className='c-black span font16 active'>
                        邀请担保人
                    </Tap>
                </div>
			</div>
		)
	}
}
