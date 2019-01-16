//借出 => 借条详情
import './index.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Flex, List } from 'antd-mobile'
import { Tap,Tips } from 'COMPONENT'
import { Loading, Modal, util,math } from 'SERVICE'

@withRouter
@inject('userStore','afterIouStore')
@observer
export default class Page extends Component {
	constructor(props, context) {
        document.title = "借条详情";
        super(props, context)
        let query = util.getUrlParams(this.props.location.search);
        this.state = {
            id: query.id,
            pop1:false
        };
    }

    componentDidMount() {
        this.getLoanDetail();
        this.getLoanInfo();
        // this.getCollStatus();
        // this.getExceedStatus();
    }

    //获取页面内容
    getLoanDetail = () => {
        const { afterIouStore } = this.props;
        $.ajaxE({
            type: 'GET',
            url: '/loanlater/loaninfo/getLoan',
            data: {
                loanId: this.state.id
            }
        }).then((data) => {
            data.borrowTimeTxt = (new Date(data.borrowTime * 1000)).Format('yyyy-MM-dd');
            data.repayTimeTxt = (new Date(data.repayTime * 1000)).Format('yyyy-MM-dd');
            data.createTimeTxt = (new Date(data.createTime)).Format('yyyy-MM-dd hh:mm:ss');
            data.purposeTypeTxt = $.purpose(data.purposeType);

            afterIouStore.setDetail(data);
        }).catch((msg,res) => {
            Modal.infoX(msg);
        })
    }

    //获取页面列表信息
    getLoanInfo = () => {
        Loading.show();
        const { afterIouStore } = this.props;
        $.ajaxE({
            type: 'GET',
            url: '/loanlater/loaninfo/getPayInfoList',
            data: {
                loanId: this.state.id
            }
        }).then((data) => {
            data.paidOverList.forEach((item)=>{ 
                item.receiveTimeTxt = (new Date(item.receiveTime*1000)).Format('yyyy/MM/dd');
            });
            data.repayList.forEach((item)=>{
                item.repayTimeTxt = (new Date(item.repayTime * 1000)).Format('yyyy/MM/dd');
            });
            data.uncheckList.forEach((item)=>{
                item.repayTimeTxt = (new Date(item.repayTime * 1000)).Format('yyyy/MM/dd');
            });
            afterIouStore.setInfo(data);
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }

    //查看借条内容
    onIouInfo=()=>{
        this.props.history.push({
            pathname: '/after/info',
            search:'?id='+this.state.id
		});
    }

    //效验发起展期
    checkShow=()=>{
        Loading.show();
        let _this = this;
        const { afterIouStore:{detail} } = this.props;
        const postData = {
            loanId:_this.state.id,
            amount: detail.amount
        };
        $.ajaxE({
            flag:1,
            type: 'POST',
            url: '/loanlater/repay/checkBeforeExtendTime',
            data: postData
        }).then((json) => {
            //判断是否 限制补借条
            if(Modal.report()){
                return false;
            }
            _this.props.history.push({
                pathname: '/after/show_form',
                search:'?id='+_this.state.id
            });
        }).catch((res) => {
            if(res.status==204){
                _this.props.history.push({
                    pathname: '/after/show_state',
                    search:'?id='+_this.state.id
                });
            }else{
                Modal.infoX(res.msg);
            }
        }).finally(()=>{
            Loading.hide();
        })
    }

    //效验发起销帐
    checkOff=()=>{
        Loading.show();
        let _this = this;
        const { afterIouStore:{detail} } = this.props;
        const postData = {
            loanId: _this.state.id,
            amount: detail.gatheringAmountForCalculation            
        };

        $.ajaxE({
            flag:1,
            type: 'POST',
            url: '/loanlater/repay/checkBeforeApplyWriteOff',
            data: postData
        }).then((json) => {
            //判断是否 限制补借条
            if(Modal.report()){
                return false;
            }
            Modal.alertX('提示', '销账等同于还款,发起销账前请您务必确认已收到还款，销账一经发起不能撤销,请慎重操作!', [
                { text: '取消', onPress: ()=>{}, style: 'default' },
                { text: '继续发起', onPress: ()=>{
                    let { afterIouStore } = this.props;
                    const {repayType,onlineStatus,status,borrowerTelephone,borrowerName,lenderToRepayManageFeeToUsAmount,gatheringAmountForCalculation,} = afterIouStore.detail;
                    const { overdueDay } = afterIouStore.info;
                    let partOff = true;
                    //线上已分期
                    if(repayType==1 && onlineStatus){
                        partOff = false;
                    }
                    //已逾期
                    if(overdueDay >0){
                        partOff = false;
                    }
                    //已经逾期或有争议
                    if(status == 3 || status == 4){
                        partOff = false;
                    }
                    afterIouStore.setDetail({
                        needConfirm: onlineStatus==1 && status==3?true:false,//线上已逾期借条   需要确认销账
                        tel: borrowerTelephone,
                        borrowerName: borrowerName,
                        overdueManageAmount: lenderToRepayManageFeeToUsAmount,                    
                        amount: gatheringAmountForCalculation,
                        partOff      //被举报成立的补借条、线上分期或逾期的借条  不允许部分销账。
                    })
                    _this.props.history.push({
                        pathname: '/after/off_form',
                        search:'?id='+_this.state.id,
                    });
                }},
            ]);
        }).catch((res) => {
            if(res.status==203){
                _this.props.history.push({
                    pathname: '/after/off_process',
                    search:'?id='+_this.state.id+"___"+res.data.payToken+"___3",
                });
            }else{
                Modal.infoX(res.msg);
            }
        }).finally(()=>{
            Loading.hide();
        })
    }

    //举报反馈
    onReportEvidence=()=>{
        this.props.history.push({
            pathname: '/after/report_process',
            search:'?id='+this.state.id
		});
    }

    //催收进度
	onUrgeProcess=()=>{
		this.props.history.push({
            pathname: '/after/urge_process',
            search:'?id='+this.state.id
		});
    }

    // onlineStatus:true,	// 生成借条的时候是否线上false.否true.是
    // selfType:'', // 查看者的身份0.其他用户 1.借款人2.出借人3.担保人
    // reportCount:0, // 借条被举报次数
    // status:1, // 借条状态 :1还款中，2已经还清，3已经逾期，4有争议
	render() {
        const { afterIouStore,afterIouStore:{tab,detail,info} } = this.props;
		return (
			<div className="view-after-iou-detail">
                <div style={{height: '100%',overflow:'auto',paddingBottom: '0.2rem'}}>
                    {detail.guaranteeUidE?<Flex justify='start' direction='row' className='user-msg' onTouchEnd={()=>{this.onUserReport(detail.guaranteeUidE)}}>
                        <div className='user-img'>
                            <img src='/imgs/iou/user.svg' />
                            <span className='font12 text-center'>担保人</span>
                        </div>
                        <span className='font16 mainC2 name'>{detail.guaranteeName}</span>
                        <span className='font14 mainC2 extra'>信用报告<img src='/imgs/home/arrow-r-black.svg'/></span>
                    </Flex>:null}
                    <Flex justify='start' direction='row' className='user-flexbox'>
                        <Flex.Item justify='start' direction='row' className='user-msg user-msgs' onTouchEnd={()=>{this.onUserReport(detail.borrowerUidE)}}>
                            <div className='user-img'>
                                <img src={detail.borrowerAvatarUrl?detail.borrowerAvatarUrl:'/imgs/iou/user.svg'} />
                                <span className='font12 text-center'>借款人</span>
                            </div>
                            <div className="user-info">
                                <span className='font14 mainC2 name'>{detail.borrowerName}</span>
                                <span className='font12 mainC2 extra'>信用报告<img src='/imgs/home/arrow-r-black.svg'/></span>
                            </div>
                        </Flex.Item>
                        <Flex.Item justify='start' direction='row' className='user-msg user-msgs' onTouchEnd={()=>{this.onUserReport(detail.lenderUidE)}}>
                            <div className='user-img'>
                                <img src={detail.lenderAvatarUrl?detail.lenderAvatarUrl:'/imgs/iou/user.svg'} />
                                <span className='font12 text-center'>出借人</span>
                            </div>
                            <div className="user-info">
                                <span className='font14 mainC2 name'>{detail.lenderName}</span>
                                <span className='font12 mainC2 extra'>信用报告<img src='/imgs/home/arrow-r-black.svg'/></span>
                            </div>
                        </Flex.Item>
                    </Flex>

                    <Flex justify='start' direction='row' className='off-content'>
                        <div className="off-font">应收总额<span className="num-font">2000</span></div>
                        <div className="after-state-div">
                            <span>已逾期3天</span>
                            <span>已展期1次</span>
                            <span>已销账200元</span>
                        </div>
                        <Tap className="off-info">查看明细</Tap>
                    </Flex>
                    
                    <Flex justify='start' direction='row' className='user-money'>
                        <div className='money-1'>
                            <span className='money num-font'>
                                {500}<span>元</span>
                            </span>
                            <span className='text'>
                                待收金额
                            </span>
                        </div>
                        <div className='money-2'>
                            <span className='money num-font'>
                                {500}<span>元</span>
                            </span>
                            <span className='text'>
                                待还金额
                            </span>
                        </div>
                        <div className='money-3'>
                            <span className='money num-font'>
                                {500}<span>元</span>
                            </span>
                            <span className='text'>
                                正在担保
                            </span>
                        </div>
                    </Flex>
                    <Flex justify='start' className='iou-text'>
                        <Tap onTap={this.onIouInfo}>
                            <span>借条内容<img src='/imgs/home/arrow-r.svg'/></span>
                        </Tap>                        
                    </Flex>

                    <Flex className='iou-spacing'>
                    </Flex>

                    <Flex justify='start' className='list-title'>
                        <span className='title'>还款进度</span>
                        <span className='detail'>查看明细<img src='/imgs/home/arrow-r.svg'/></span>
                    </Flex>

                    <Flex className='list-tab'>
                        <div className={tab==0?'tab-0 selected':'tab-0'} onTouchEnd={()=>{afterIouStore.setTab(0)}}>
                            <span className='money num-font'>
                                {$.toYuan(info.gatheringAmount)}<span>元</span>
                            </span>
                            <span className='text'>
                                待收
                            </span>
                        </div>
                        {detail.onlineStatus?null:<div className={tab==1?'tab-1 selected':'tab-1'} onTouchEnd={()=>{afterIouStore.setTab(1)}}>
                            <span className='money num-font'>
                                {$.toYuan(info.checkedAmt)}<span>元</span>
                            </span>
                            <span className='text'>
                                待确认
                            </span>
                        </div>}
                        <div className={tab==2?'tab-2 selected':'tab-2'} onTouchEnd={()=>{afterIouStore.setTab(2)}}>
                            <span className='money num-font'>
                                {$.toYuan(info.receivedAmount)}<span>元</span>
                            </span>
                            <span className='text'>
                                已收
                            </span>
                        </div>
                    </Flex>

                    {/* <List className='list'>
                        <List.Item extra={100+'元'}>
                            <span className="checkbox"></span>
                            <div className="marl20">
                                <span className="font14 fontC3 bold">112222<span className="tag blue">剩余10天</span></span>
                                <List.Item.Brief>还款日 2018/03/06   </List.Item.Brief>
                            </div>
                        </List.Item>
                        <List.Item extra={100+'元'}>
                            <span className="checkbox active"></span>
                            <div className="marl20">
                                <span className="font14 fontC3 bold">112222<span className="tag blue">剩余10天</span></span>
                                <List.Item.Brief>还款日 2018/03/06   </List.Item.Brief>
                            </div>
                        </List.Item>
                        <List.Item extra={100+'元'}>
                            <span className="font14 fontC3 bold">111<span className="tag gray">已还清</span></span>
                            <List.Item.Brief>还款日 2018/03/06   </List.Item.Brief>
                        </List.Item>
                        <List.Item extra={100+'元'}>
                            <span className="font14 fontC3 bold">111<span className="tag red">已逾期33天</span></span>
                            <List.Item.Brief>还款日 2018/03/06   </List.Item.Brief>
                        </List.Item>
                        <List.Item extra={100+'元'}>
                            <span className="font14 fontC3 bold">111<span className="tag red">已逾期33天</span></span>
                            <List.Item.Brief>还款日 2018/03/06   </List.Item.Brief>
                        </List.Item>
                    </List> */}

                    {/* 待收 */}
                    {tab==0?<List className='list'>
                        {info.repayList.map((item,index)=>{
                            return <List.Item extra={$.toYuan(item.leftAmount)+'元'}>
                                <div className="marl20">
                                    <span className="font14 fontC3 bold">{index+1}/{item.curPeriod}期<span className="tag blue">{item.repayStatus}</span></span>
                                    <List.Item.Brief>还款日 {item.repayTimeTxt}   </List.Item.Brief>
                                </div>
                            </List.Item>
                        })}
                    </List>:null}

                    {/* 待确定 */}
                    {tab==1?<List className='list'>
                        {info.uncheckList.map((item)=>{
                            return <List.Item arrow="horizontal" extra={100+'元'}>
                                        <span></span>
                                        <List.Item.Brief>subtitle</List.Item.Brief>
                                    </List.Item>
                        })}
                    </List>:null}
                    
                    {/* 待收 */}
                    {tab==2?<List className='list'>
                        {info.paidOverList.map((item)=>{
                            return <List.Item arrow="horizontal" extra={100+'元'}>
                                        <span></span>
                                        <List.Item.Brief>subtitle</List.Item.Brief>
                                    </List.Item>
                        })}
                    </List>:null}
                </div>

                {/* <div className="common-btn_box4">
                    <span className="span">举报反馈</span>
                    <span className="span">催收进度</span>
                    <span className="span">发起展期</span>
                    <span className="span">发起销账</span>
                </div> */}

                <div className="common-btn_box">
                    <span className="span" onTouchEnd={this.checkShow}>发起展期</span>
                    {detail.status!=2?<span className="span" onTouchEnd={this.checkOff}>发起销账</span>:null}
                    {detail.reportCount?<span className="span" onTouchEnd={this.onReportEvidence}>举报反馈</span>:null}
                    {detail.status==3?<span className="span" onTouchEnd={this.onUrgeProcess}>催收进度</span>:null}
                </div>
                
                <Modal popup
                    visible={this.state.pop1}
                    animationType="slide-up">
                    <div className="model_common">
                        <Flex justify="center" className='list-model-top'>
                            <span>账单明细</span>
                        </Flex>
                        <Flex justify='start' className='list-model'>
                            <Flex.Item></Flex.Item>
                            <Flex.Item className="fontC3">应收</Flex.Item>
                            <Flex.Item className="fontC3">待收</Flex.Item>
                            <Flex.Item className="fontC3">已收</Flex.Item>
                        </Flex>
                        <Flex justify='start' className='list-model'>
                            <Flex.Item className="fontC3">总计</Flex.Item>
                            <Flex.Item>100</Flex.Item>
                            <Flex.Item>100</Flex.Item>
                            <Flex.Item>100</Flex.Item>
                        </Flex>
                        <Flex justify='start' className='list-model'>
                            <Flex.Item className="fontC3">本金</Flex.Item>
                            <Flex.Item>100</Flex.Item>
                            <Flex.Item>100</Flex.Item>
                            <Flex.Item>100</Flex.Item>
                        </Flex>
                        <Flex justify='start' className='list-model'>
                            <Flex.Item className="fontC3">利息</Flex.Item>
                            <Flex.Item>100</Flex.Item>
                            <Flex.Item>100</Flex.Item>
                            <Flex.Item>100</Flex.Item>
                        </Flex>
                        <Flex justify='start' className='list-model'>
                            <Flex.Item className="fontC3">罚息</Flex.Item>
                            <Flex.Item>100</Flex.Item>
                            <Flex.Item>100</Flex.Item>
                            <Flex.Item>100</Flex.Item>
                        </Flex>
                        <Flex justify='start' className='list-model fontC4'>
                            <Flex.Item>逾期管理费</Flex.Item>
                            <Flex.Item>100</Flex.Item>
                            <Flex.Item>100</Flex.Item>
                            <Flex.Item >100</Flex.Item>
                        </Flex>
                        <Flex justify='start' className='overdue'>
                            <span>逾期管理费由平台收取，不计入出借人应收金额，但是借款人每还一笔款，平台都会即时奖励本次还款金额中的逾期管理费90%到出借人账户余额</span>
                        </Flex>

                        <Tap className="model-btn">确定</Tap>
                    </div>
                </Modal>
      		</div>
		)
	}
}
