
//银行卡-充值
import '../card.less'
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { List, InputItem, Picker,Toast } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Tap,Tips,Pay,InputCode,InputValid,WalletPay,Side } from 'COMPONENT'
import { Loading, Modal } from 'SERVICE'

const Item = List.Item;

@withRouter
@inject('userStore','bankStore')
@observer
class App extends Component {
    constructor(props, context) {
        document.title = "充值";
        super(props, context)
        let { query } = this.props.location;
       
        this.state = {
            amount:0,
            payVisible:false,
            cPayVisible:false,
            payData:null,
        };
    }

    componentDidMount() {
    }    
  
    // 点击 确定充值
    submit = () => {
        if(!this.props.userStore.checkUserCardId(()=>{
            this.props.history.push({
                pathname: '/user/id_auth',
                query:{
                    pathType: 5,
                } 
            });
        })){
            return;
		}
        this.props.form.validateFields((error, values) => {
            if (!error) {
                let amount=parseFloat(values.withdrawalAmount).toFixed(2);
                this.setState({
                    amount:amount,
                    payVisible:true,
                })
            }
        });
    }

    //支付
    onPay=(data)=>{
        if($.isWeiXin && data.payMethod==0){
            this.setState({
                payVisible:false,
                cPayVisible: false,
                payData: data
            },()=>{
                this.onComfirmPay();
            })
        }else{
            $.ajaxE({
                type: 'POST',
                contentType: 'application/json',
                url: '/user/recharge/rechargeApply',
                data: {
                    bindBankId:data.bindBankId, // 银行卡ID
                    payPassword:data.payPassword, // 密码
                    amount:$.toFen(this.state.amount), // 客户充值金额
                    payMethod:data.payMethod, // 支付方式 ：0.余额 1.银行卡 2.线下 3.银联(收银台类) 4.微信(app类)
                }
            }).then((res) => {
                if(data.payMethod==2){
                    //线下支付
                    Toast.success('支付成功', 2);
                    store=[]
                    // 成功之后
                    this.setState({
                        payVisible: false,
                        cPayVisible: false
                    },()=>{
                        let succ={
                            amount:this.state.amount,
                            tradeType:'charge',
                            bankCard:payData.payMethod
                        }
                        this.props.bankStore.setPaySuccess(succ)
                        this.props.history.push({
                            pathname: '/card/trade_success'
                        })
                    })
                }else if(data.payMethod==3){
                    //银联支付
                    document.write(res.payToken);
                } else if(data.payMethod==4){//微信支付
                    let payToken = JSON.parse(res.payToken)
                    $.payWeiXin(payToken);
                }else{
                    //确认支付   余额和银行卡需要
                    //orderNo:22,payChannelType:1,payOrderNo:22,payToken:22 
                    let payData = {
                        orderNo:res.orderNo,  //String 商户订单号（交易id）
                        amount:$.toFen(this.state.amount),   // 支付金额
                        payOrderNo:res.payOrderNo,    //支付订单号或协议支付绑卡流水号(第三方支付公司返回)
                        payMethod:data.payMethod,   //Byte 支付方式 ：0.余额 1.银行卡 2-线下 3.银联(收银台类) 4.微信(app类)
                        payChannelType:res.payChannelType,   //银行卡支付通道：0-掌上汇通P2P通道；1-掌上汇通快捷通道；2-余额支付通道；4-易联插件通道；5-易联代收代付通道；7-合利宝支付通道；8-易宝支付通道；17-富友-协议支付(代收)；18-银联WAP支付(代收)；19-联拓
                        payToken:res.payToken,    //支付令牌(第三方支付公司返回)
                        protocolBind:res.protocolBind,
                    };
                    this.setState({
                        payVisible:false,
                        cPayVisible: true,
                        payData: payData
                    })
                }
            }).catch((msg) => {
                this.setState({
                    cPayVisible:false
                },()=>{
                    Modal.infoX(msg)
                })
            })
        } 
    }

    //验证码确认支付
    onComfirmPay=(valus)=>{
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
            contentType: 'application/json',
            url: '/user/recharge/rechargeConfirm',
            data: payData,
        }).then((data)=>{
            this.setState({
                payVisible: false,
                cPayVisible: false
            },()=>{
                let succ={
                    amount:this.state.amount,
                    tradeType:'charge',
                    bankCard:payData.payMethod
                }
                this.props.bankStore.setPaySuccess(succ)
                this.props.history.push({
                    pathname: '/card/trade_success'
                });
            })
            
        }).catch((msg)=>{
            this.setState({
                payVisible: false,
                cPayVisible: false
            },()=>{
                Modal.infoX(msg,()=>{
                    this.setState({
                        payVisible: true,
                        cPayVisible: false
                    })
                });
            })
        }).finally(()=>{
			Loading.hide();
		})
       
    }

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        return (
            <div className='view-charge view-card'>
                <List>
                    <InputItem
                        {...getFieldProps('withdrawalAmount', {
                            rules: [{ required: true, message: '请输入充值金额' }],
                        })}
                        type="digit"
                        editable={!this.state.payVisible}
                        placeholder='请输入充值金额'
                        onBlur={this.handleIptBlur}
                        clear
                    >充值金额(元)</InputItem>
                    <div className='common-jc-error'>{getFieldError('withdrawalAmount') && getFieldError('withdrawalAmount').join(',')}</div>
                </List>   

                <Side>
                    <p>手续费多少？如何收取？:</p>
                    <p>一次充值金额≥500元，不收取任何费用；</p>
                    <p>一次充值金额＜500元，收取手续费2.5元</p>
                    <p className="dot">充值金额什么时候可以使用？</p>
                    <p>充值操作完成后，平台大概需要1-2分钟处理，之后方可使用充值金额</p>
                </Side>

                <div className='common-btn_box'>
                    <Tap className='c-black span font16 active' onTap={this.submit}>确认充值</Tap>
                </div>
                <WalletPay telephone={this.props.userStore.userInfo.telephone}
                money={this.state.amount}
                moneyL={this.state.amount}
                input={false}
                onEnd={this.onPay}
                onClose={()=>{this.setState({payVisible:false})}}
                payVisible={this.state.payVisible}>	
				</WalletPay>
                <InputCode onClose={()=>{this.setState({cPayVisible: false})}} 
                visible={this.state.cPayVisible} onEnd={this.onComfirmPay} />


            </div>
        )
    }
}

export default createForm()(App);
