
//借入 => 借条详情
import '../loan_detail/index.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Flex, List } from 'antd-mobile'
import { Tap,Tips } from 'COMPONENT'
import { Loading, Modal, util, math } from 'SERVICE'

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
            //获取展期状态
            extensStatus:null,
            //判断男1  女0
            gender:props.userStore.userInfo.gender=='M'?1:0,
            //选择还款金额
            repayTotal:0,
            //是否多笔还款
            repayCount:0,
            //选择项
            repayMap:{},
            pop1:false
        };
    }

    componentDidMount() {
        this.getLoanDetail();
        this.getLoanInfo();
        this.getShowStatus();
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

    //获取是否需要确认展期
    getShowStatus = ()=>{
        $.ajaxE({
            type: 'GET',
            url: '/loanlater/loanExceeding/getLastLoanExceeding',
            data: {
                loanId: this.state.id
            }
        }).then((data) => {
            if(data){
                this.setState({
                    extensStatus: data.extensStatus
                });
            }            
        }).catch((msg) => {
            Modal.infoX(msg);
        })        
    }

    //查看借条内容
    onIouInfo=()=>{
        this.props.history.push({
            pathname: '/after/info',
            search:'?id='+this.state.id
		});
    }

    //查看用户报告
    onUserReport=(id)=>{
        this.props.history.push({
            pathname: '/credit/report_simple',
            search:'?userId='+id
		});
    }

    //选择还款
    onRepayItem=(ob)=>{
        const { afterIouStore:{detail,info} } = this.props;
        const { repayMap } = this.state;        
        let flag = null,checked = ob.checked,
        repayTotal = 0;
        let repayCount = 0;
        info.repayList.forEach((item,index)=>{
            if(item.repayStatus!='已还清'){
                item.checked = true;
            }
            if(item.idE == ob.idE){
                flag = index;
                item.checked = !checked;
                return false;
            }
            if(flag != null){
                item.checked = false;
            }
        });
        info.repayList.forEach((item,index)=>{
            if(item.checked){
                repayMap[item.idE] = item;
                repayCount++;
                repayTotal = Math.round(repayTotal + item.repayAmount);
            }else{
                repayMap[item.idE] = null;
            }
        })
        this.setState({
            repayMap,
            repayCount,
            repayTotal
        });
    }

    //撤销还款
    onBackOutItem =(ob)=>{
        Modal.alertX('提醒', '确定要撤销此次还款吗', [
            {
                text: '取消', onPress: () => null
            },
            { text: '确定', onPress: () => {
                this.setState({
                    backOutVisible:true,
                    selectItemId:ob.id
                });
            } },
        ]) 
    }

    //确认撤销还款
    onComfirmBackOut=(pwd)=>{
        Loading.show();
        const _this = this;
        $.ajaxE({
            type: 'POST',
            url: '/loanlater/repay/offlineRepayConfirm',
            data: {
                loanRepayListId:this.state.selectItemId, // 借条还款明细表id
                offlineResult:0, //  确认结果 0.驳回/撤销 1.确认
                payPassword:pwd, // 密码
                offlineType:0, //1 -出借人审核线下还款(可以确认或驳回) 0-借款人撤销线下还款(只能撤销)
            }
        }).then((data) => {
            Modal.infoX('撤销还款成功',()=>{
                _this.initPageInfo();
            })
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
            this.setState({
                backOutVisible:false
            });
        })
    }

    //确认展期
    onShowConfirm = ()=>{
        //判断是否 限制补借条
		if(Modal.report()){
			return false;
		}
        this.props.history.push({
            pathname: '/after/show_confirm',
            search:"?id="+this.state.id
		});
    }

    //确认销账
    onOffConfirm =()=>{
        const { afterIouStore:{detail} } = this.props;
        //判断是否 限制补借条
		if(Modal.report()){
			return false;
		}
        this.props.history.push({
            pathname: '/after/off_confirm',
            search:"?id="+detail.writeOffId
		});
    }

    //举报进度
    oRreportProcess = ()=>{	
        // $.setItem('report_process_back_num',{
        //     needGoBackNum: -1 //history   go  需要返回的次数
        // });
        this.props.history.push({
            pathname: '/after/report_process',
            search:"?id="+this.state.id,
        });
    }
    

    //违约举报
    onReport = ()=>{
        //判断是否 限制补借条
		// if(Modal.report()){
		// 	return false;
        // }
        Modal.alertX('提醒', '如果恶意举报，您将被标记，并且通过信用报告展示给所有出借人。建议您谨慎操作。', [
            {
                text: '取消', onPress: () => null
            },
            {
                text: '继续发起', onPress: () => {
                    this.props.history.push({
                        pathname: '/after/report',
                        search: "?id=" + this.state.id
                    });
                }
            }
        ])
       
    }

    //支付
    onPay=()=>{
        const { afterIouStore:{detail} } = this.props;
        const { repayTotal,repayCount} = this.state;
        if(repayTotal==0){
            Modal.infoX('请选择借条');
        }else{
            this.props.userStore.setBox({
                pay:true,
                money:$.toYuan(repayTotal),
                onLine:!!detail.onlineStatus,
                edit:repayCount==1,
                poundage:true,
                onPayEnd:this.onPayApply
            });    
        }
    }

    //发起支付申请
    onPayApply=(data)=>{
        let _this = this;
        const { userStore,afterIouStore:{info} } = this.props;
        let { repayTotal,repayCount } = _this.state;
        let repayList = [];
        if(repayCount==1){
            //单笔还款
            info.repayList.forEach((item)=>{
                if(item.checked){
                    repayList.push({
                        repayAmount:$.toFen(data.amount),
                        loanIdE:_this.state.id,
                        loanInstallmentListIdE:item.idE
                    });
                }
            });
        }else{
            //多笔还款
            info.repayList.forEach((item)=>{
                if(item.checked){
                    repayList.push({
                        repayAmount:item.totalAmount,
                        loanIdE:_this.state.id,
                        loanInstallmentListIdE:item.idE
                    });
                }
            })
        }
             
        let postData = {
            bindBankId:data.bindBankId,//Long 绑卡id(银行卡绑定表ID)
            amount: $.toFen(data.amount), //Integer 还款金额、销账金额或展期还款金额
            payPassword:data.payPassword, //支付密码
            offlinePayMethod:data.offlinePayMethod,//Integer 如果是线下还款的线下还款方式(线下还款方式(线下支付方式 0.支付宝 1.微信 2.银行卡 3.现金))
            payMethod:data.payMethod,//Byte 支付方式 ：0.余额 1.银行卡 2-线下 3.银联(收银台类) 4.微信(app类)
            loanRepayLists:repayList
        }  
        if($.isWeiXin && data.payMethod==0){
            userStore.setBox({
                pay:false,
                code:false
            });
            this.setState({
                payData: postData
            },()=>{
                this.onPayComfirm();
            })
        }else{
            Loading.show();
            $.ajaxE({
                flag:1,
                type: 'POST',
                url: '/loanlater/repay/repayApply',
                data:postData
            }).then((res)=>{
                if(data.payMethod==2){
                    //不需要确认
                    userStore.setBox({
                        pay:false,
                        code:false
                    });             
                    Modal.infoX('还款成功!',()=>{
                        _this.initPageInfo();                   
                    });
                }else if(data.payMethod==3){
                    //银联支付
                    document.write(res.payToken);
                } else if(data.payMethod==4){//微信支付
                    //history.pushState(null, null, '/');
                    let payToken = JSON.parse(res.payToken)
                    $.payWeiXin(payToken);
                }else{
                    //确认支付   余额和银行卡需要
                     //orderNo:22,payChannelType:1,payOrderNo:22,payToken:22 
                     res.loanRepayLists=postData.loanRepayLists;
                     res.amount = postData.amount;
                     res.payMethod = postData.payMethod;
                     _this.setState({
                        payData: res
                    })
                    userStore.setBox({
                        pay:false,
                        code:true,
                        onEnd:_this.onPayComfirm
                    });  
                }
            }).catch((res)=>{
                userStore.setBox({
                    pay:false,
                    code:false
                });  
                //其他操作
                _this.fromStatus(res.msg,res);
            }).finally(()=>{
                Loading.hide();
            })
        }
    }
    //验证码确认支付
    onPayComfirm=(valus)=>{
        const _this = this;
        const { userStore } = this.props;
        let payData = _this.state.payData;
        if($.isWeiXin && payData.payMethod==0){
            //微信环境 余额支付直接走确认
            payData.payChannelType = 2;//这个值本来应该从申请支付后台返回，现在直接走确认，所以写死
        }else{
            //接收验证码
            payData.authCode = valus;
            delete payData.payPassword;
        }
        Loading.show();
        $.ajaxE({
            type: 'POST',
            url: '/loanlater/repay/repayConfirm',
            data: payData,
        }).then((data)=>{
            userStore.setBox({
                pay:false,
                code:false
            });  
            Modal.infoX('还款成功!',()=>{
                _this.initPageInfo();
            });
        }).catch((msg)=>{
            userStore.setBox({
                pay:false,
                code:false
            });  
            Modal.infoX(msg)
        }).finally(()=>{
            Loading.hide();
        })
    }

    //根据repay/repayApply 返回的status 判断
    fromStatus=(msg,res)=>{
        const _this = this;
        if(res.status==202){
            //"msg": "该借条有一笔线下还款待处理，暂时不可发起还款，建议您联系出借人进行确认或者撤销此次还款再发起新的还款。"
            Modal.alertX('提示', msg, [
                { text: '取消', onPress: () => {} },
                { text: '撤销上次还款', onPress: () => {
                    _this.setState({
                        tab:1,
                        backOutVisible:true,
                        selectItemId:res.data.payToken
                    });
                }},
            ])
        }else if(res.status==203){
            //"msg": "您有一笔销账需要处理，请先处理后再发起还款。",
            Modal.alertX('提示', msg, [
                { text: '取消', onPress: () => {} },
                { text: '去处理', onPress: () => {
                    _this.setState({
                        tab:1,
                        id:res.data.payToken
                    },()=>{
                        _this.initPageInfo();
                    })
                }},
            ])
        }else if(res.status==204){
            //"msg": "您有一笔展期需要处理，请先处理后再发起还款。",
            Modal.alertX('提示', msg, [
                { text: '取消', onPress: () => {} },
                { text: '去处理', onPress: () => {
                    _this.props.history.push({
                        pathname: '/after/show_confirm',
                        query:{
                            id:res.data.payToken
                        }
                    });
                }},
            ])
        }else{
            Modal.infoX(msg);
        }
    }

    render() {
        const { afterIouStore,afterIouStore:{tab,detail,info} } = this.props;
        const { extensStatus,gender,repayMap,repayTotal } = this.state;
        let bottomBtn = null;
        if(tab!=2 && detail.status !=2){
            bottomBtn = (
                <div className="common-btn_box">
                    {extensStatus==0?<Tap onTap={this.onShowConfirm} className='span'>
                        确认展期
                    </Tap>:null}

                    {detail.writeOffId && detail.writeOffStatus==0?<Tap onTap={this.onOffConfirm} className='span'>
                        确认销账
                    </Tap>:null}

                    {/* //发起举报了 */}
                    {detail.reportCount ? <Tap onTap={this.oRreportProcess} className='span'>
                        举报进度
                    </Tap>:null}

                    {/* //借款人是女性 */}
                    {(!gender && !detail.reportCount) ? <Tap onTap={this.onReport} className='span'>
                        裸条举报
                    </Tap>:null}
                    
                    {/* //线下 未完结 */}
                    {(!detail.onlineStatus && !detail.reportCount)?<Tap onTap={this.onReport} className='span'>
                        违约举报
                    </Tap>:null}
                    {tab==0?<Tap onTap={this.onPay} className={repayTotal?"span c-black active":"span c-black"}>
                        马上还款
                    </Tap>:null}
                </div>
            )
        }

		return (
			<div className="view-after-iou-detail" style={{paddingBottom: '0.5rem'}}>
                <div style={{height: '100%',overflow:'auto',paddingBottom: '0.2rem'}}>
                    {detail.guaranteeUidE?<Flex justify='start' direction='row' className='user-msg' onTouchEnd={()=>{this.onUserReport(detail.guaranteeUidE)}}>
                        <div className='user-img'>
                            <img src={detail.guaranteeAvatarUrl?detail.guaranteeAvatarUrl:'/imgs/iou/user.svg'} />
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
                                {$.toYuan(info.repayAmount)}<span>元</span>
                            </span>
                            <span className='text'>
                                待还
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
                                {$.toYuan(info.paidAmount)}<span>元</span>
                            </span>
                            <span className='text'>
                                已还
                            </span>
                        </div>
                    </Flex>

                    {/* 待收 */}
                    {tab==0?<List className='list'>
                        {info.repayList.map((item,index)=>{
                            return <List.Item extra={$.toYuan(item.leftAmount)+'元'} onClick={()=>{this.onRepayItem(item)}}>
                                <span className={repayMap[item.idE]?"checkbox active":"checkbox"}></span>
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

                <div className="common-btn_box">
                    {bottomBtn}
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