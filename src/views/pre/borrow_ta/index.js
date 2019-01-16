//首页 => 借给TA
import '../form.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { createForm } from 'rc-form'
import { Flex, List, Checkbox } from 'antd-mobile'
import { Tap, InputMoney, Button,Side } from 'COMPONENT'
import { Loading, Modal, util, rules, math } from 'SERVICE'

const c_currentDate = new Date(Date.now());

@withRouter
@inject('userStore','preBorrowStore')
@observer
class Page extends Component {
	constructor (props, context) {
		document.title = "借给TA";
		super(props, context)
		this.state = {
            isSideS:false,
        };
	}
	componentDidMount(){
        //获取用户可借额度
        this.props.userStore.getUserBorrowAmt();
        //检查用户信用认证
        //this.props.userStore.checkUserCredit();
    }

    //改变金额
    amtChange=(v)=>{
        v = parseInt(v);
        if(v){
            this.props.preBorrowStore.setFormTa({
                amount:v
            },()=>{
                this.moneyChange();
            });            
        }else{
            this.props.preBorrowStore.setFormTa({
                amount:0,
                interest:0,
                timeList:[]
            })
        }
    }

    moneyChange=()=>{
        const { preBorrowStore,preBorrowStore:{detail,formTa} } = this.props;
        const repayMent = new Date(detail.repayTime*1000);
        let dates = util.iouComputedDays(repayMent,c_currentDate);
        if(detail.repayType){
            let ob = util.iouInstallment(formTa.amount,detail.interestRate/100/12,detail.period);
            preBorrowStore.setFormTa({
                interest:ob.total_i,
				timeList:ob.list
            });
		}else{
			let total_i = formTa.amount*detail.interestRate*dates/36500;
			let total = formTa.amount + total_i;
			let timeList = [{
				date:repayMent.Format('yyyy-MM-dd'),
				fee:$.to2(total)
            }];
            preBorrowStore.setFormTa({
                interest:$.to2(total_i),
				timeList
            });
		}
    }
    
    //点击提交
	onBtn = () => {
        let _this = this;
		let { userStore,preBorrowStore:{formTa} } = this.props;
        //检查用户举报状态
        if(userStore.checkUserReport()){
            Loading.show();
            //更新用户认证信息
            userStore.getUserCreditInfo(()=>{
                Loading.hide();
                //检查运营商认证
                if(userStore.checkUserMobileCredit(0)){
                    //检查学信认证
                    if(userStore.checkUserXueXin()){
                        userStore.setBox({
                            pay:true,
                            money:formTa.amount,
                            poundage:true,
                            onPayEnd:this.onPay
                        });
                    }
                }
            });
        }        
    }

    //确认支付
	onPay=(data)=>{
        let _this = this;
        let { userStore,preBorrowStore:{detail,formTa} } = this.props;
        let postData = {
            bidId:detail.id,
            guaranteeUid:formTa.guarantee?formTa.guarantee.id:'',
            bindBankId:data.bindBankId,
            amount:$.toFen(data.amount),
            payPassword:data.payPassword,
            payMethod:data.payMethod
        }
        //微信环境 余额支付直接走确认
        if($.isWeiXin && data.payMethod==0){
            _this.state.payData = postData;
            userStore.setBox({
                pay:false,
                code:false
            });
            _this.onComfirmPay();
        }else{
            Loading.show();
            $.ajaxE({
                type: 'POST',
                url: '/loanpre/payBid/payBid',
                data:postData
            }).then((res)=>{
                if(data.payMethod==2){
                    userStore.setBox({
                        pay:false,
                        code:false
                    });
                    //不需要确认
                    Modal.infoX('已提交，支付结果请关注消息推送!',()=>{
                        _this.props.history.push({
                            pathname:'/'
                        })
                    });
                }else if(data.payMethod==3){
                    //银联支付
                    $.payYinLian(res.payToken);
                }else if(data.payMethod==4){//微信支付                    
                    localStorage.setItem('borrow_ta_back','/')
                    let payToken = JSON.parse(res.payToken)
                    $.payWeiXin(payToken);
                }else{
                    //确认支付   余额和银行卡需要
                    let payData = {
                        bidId:detail.id, //Long 求借款id
                        amount:$.toFen(data.amount),
                        guaranteeUid:formTa.guarantee?formTa.guarantee.id:'', //Long担保人id
                        orderNo:res.orderNo,//Long 商户订单号（交易id）
                        payOrderNo:res.payOrderNo, //支付订单号或协议支付绑卡流水号(第三方支付公司返回)
                        payMethod:data.payMethod,//Byte 支付方式 ：0.余额  1.银行卡  2-线下 3.银联(收银台类) 4.微信(app类)
                        payChannelType:res.payChannelType, //银行卡支付通道：0-掌上汇通P2P通道；1-掌上汇通快捷通道；2-余额支付通道；4-易联插件通道；5-易联代收代付通道；7-合利宝支付通道；8-易宝支付通道；17-富友-协议支付(代收)；18-银联WAP支付(代收)；19-联拓
                        payToken:res.payToken,//支付令牌(第三方支付公司返回)
                        protocolBind:res.protocolBind,//Boolean 是否协议绑卡
                    };
                    _this.state.payData = payData;
                    userStore.setBox({
                        pay:false,
                        code:true,
                        onCodeEnd:_this.onComfirmPay
                    });
                }
            }).catch((msg)=>{
                userStore.setBox({
                    pay:false,
                    code:false
                });
                Modal.infoX(msg);
            }).finally(()=>{
                //Loading.show();
                Loading.hide();
            })
        }
    }
    
    //验证码确认支付
    onComfirmPay=(valus)=>{
        let { userStore,preBorrowStore:{formTa} } = this.props;
        let payData = this.state.payData;
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
            url: '/loanpre/payBid/payBidConfirm',
            data: payData,
        }).then((data)=>{
            userStore.setBox({
                pay:false,
                code:false
            });
            if(payData.payMethod==1){
                Modal.infoX('已提交，支付结果请关注消息推送',()=>{
                    this.props.history.push({
                        pathname:'/'
                    })
                })
            }else{
                Modal.infoX('支付成功！',()=>{
                    this.props.history.push({
                        pathname:'/'
                    })
                })
            }
        }).catch((msg)=>{
            userStore.setBox({
                pay:false,
                code:false
            });
            Modal.infoX(msg);
        }).finally(()=>{
            //Loading.show();
            Loading.hide();
        })
    }

    //底部按钮点击认证
    onValid=()=>{
        const { preBorrowStore:{formTa} } = this.props;

        if(!formTa.checked){
            Modal.tip('请同意借款协议');
            return;
        }
    }
    
    //是否统一借款协议
	onAgreementChange=(v)=>{
		this.props.preBorrowStore.setFormTa({
            checked:v.target.checked
        });
	}
    
	render() {
        const { getFieldProps,getFieldError } = this.props.form;
        const { userStore,preBorrowStore:{detail,formTa} } = this.props;
		return (
            <div className="view-iou-form">
                <List className='content'>
                    <Flex justify="between" className='list-title borr-ta'>
                        <span className='title'>选择担保人</span>
                        {detail.guaranteeIdList.length?<span className='fontC1 font14 rig'>选择担保人</span>
                        :<span className='fontC1 font14'>没有可用担保人</span>}
                    </Flex>
                    <Flex justify='start' className='list-title padt10'>
                        <span className='title'>出借金额</span>
                    </Flex>
                    <Flex justify='center' className="mart20">
                        <span>
                            <List.Item>
                                <InputMoney
                                    type="digit" 
                                    className="login_input num-font"
                                    max={userStore.borrowAmt}
                                    errorText={getFieldError('amount')}
                                    {...getFieldProps('amount', {
                                        initialValue:formTa.amount,
                                        onChange:this.amtChange,
                                        rules: [
                                            { required: true, message: '请输入借款金额' }
                                        ]
                                    })}>                         
                                </InputMoney>
                            </List.Item>
                        </span>
                    </Flex>                    

                    {formTa.amount?<div className={this.state.isSideS?"rate-div active":"rate-div"}>
                        <Flex justify="center">
                            <span className="font14 fontC3">预计收益：{formTa.interest}元</span>
                        </Flex>
                        <div className="rate-com">
                            <Flex justify="center" className="tit-small">
                                <span>——</span><span>收款计划</span><span>——</span>
                            </Flex>
                            {formTa.timeList.map((node)=>{
                                return <Flex key={Math.random()} className="succ-table-flex no-line-mar" justify="between">
                                        <Flex.Item>{node.date}</Flex.Item>
                                        <Flex.Item>{node.fee}元</Flex.Item>
                                    </Flex>
                            })}
                        </div>
                        <div className="side_up_div">
                            <Tap className={this.state.isSideS?"side_up active":"side_up"} 
                                onTap={()=>{this.setState({isSideS:!this.state.isSideS})}}>
                                <img src={'/imgs/credit/side.svg'} />
                            </Tap>
                        </div>
                    </div>:null}                 

                    <Side>
                        <p>提示</p>
                        <p>补借条，不能线上走账，不支持逾期催收，存在较大的风险，如果不是非常亲密的关系，不建议您使用此功能</p>
                        <p>如果您是现金交易请不要补借条，一旦发生争议，因为双方无法提供交易证据，平台会将借条置为有争议状态</p>
                        <p>补借条的待确认有效期为3天，到期自动关闭</p>
                        <p>补借条不支持线上出借，请确保你们已经线下交易完毕</p>
                    </Side>

                    <Flex justify='center' className="mart15 mab8">
                        <Checkbox.AgreeItem checked={formTa.checked} onChange={this.onAgreementChange}>
                            已阅读并同意
                            <span className="mainC1" onClick={(e) => { e.preventDefault(); alert('agree it'); }}>《今借到借款协议》</span>
                        </Checkbox.AgreeItem>
                    </Flex>
                </List>
                <div className='common-btn_box'>
                    <Button onBtn={this.onBtn}
                        onValid={this.onValid}
                        editable={formTa.checked}
                        form={this.props.form}
                        fields={['amount']}
                    >确定</Button>
                </div>
            </div>
		);
	}
}

export default createForm()(Page)
