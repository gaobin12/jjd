
//提现
import '../card.less'
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { InputValid, InputValidF,InputCode,Tap,Side } from 'COMPONENT'
import { List, InputItem, Picker, Button } from 'antd-mobile'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { createForm } from 'rc-form'
import { Loading, Modal } from 'SERVICE'


@withRouter
@inject('userStore','bankStore')
@observer
class App extends Component {
    constructor(props, context) {
        document.title = "提现";
        super(props, context) 
        this.state = {
            withdrawMoney: null, //客户提现金额
            realAmount: null,//实际到账金额
            maxMoney:0,//最多可提现金额

            n_withdraw_amt: '',//免特别提现手续费金额(原来接口参数)
            amount: 100, //钱包余额(数字)
            withdrawAmount: '',//钱包可提现余额(数字)
            sysWithdrawAmount: '',//当前用户的当前时间可提现余额(包含垫付金额)
            sysWithdrawRate: '',//垫付费率(格式0.002)

            feeShown: false, //是否显示手续费信息
            moreThanTotal: false, //是否显示超额提示

            payPWD: false,//显示支付密码组件
            pwd: '', //加密后的支付密码串

            cardNo:'',//银行卡选择的值
            bindBankId: '', //选中的银行卡对应的id
            usableBankList:'', //可用银行卡列表
            payCode:false,   //短信验证码框
            modifyData:''   //短信验证码返回数据

        };
    }

    componentDidMount() {
        // 获取银行卡信息
        this.getPaymentList();
        // 获得钱包信息
        this.getMyWihdrawInfo();
    }

    // 获得银行卡列表
    getPaymentList=()=>{
        let that=this;
        $.ajaxE( {
            type: 'GET',
            url: '/user/my/getPaymentList',
            data: {
                withdraw:1
            }
        }).then((json) => {
            let arr1=[];
            //遍历可使用的银行卡支付方式
            json.usableBankList.forEach(function (item) {
                let method = {		
                    id: item.id, // 银行Id
                    value: item.cardName, // 银行名称
                    label: item.cardName, // 银行名称
                    limitAmt:item.todayLimitLeft, //  支付费用
                    //limitAmt:5000
                };
                arr1.push(method);

            });	
            that.setState({
                usableBankList: arr1,
            })
        }).catch((msg) => {
            Modal.infoX(msg);
        })        

    }
    
    //获取选择的银行卡对应的id
    chosenCard = (v) => {
        let { usableBankList } = this.state
        let hs = [];
        for (let i = 0; i < usableBankList.length; i++) {
            if (usableBankList[i].value == v[0]) {
                hs[0] = usableBankList[i].id
            }

        }
        this.setState({
            cardNo: v[0],
            bindBankId: hs[0],//选择银行卡所对应的id
        })


    }

    
    // 获得钱包信息(处理金额，得到最大提现金额)
    getMyWihdrawInfo = () => {
        // 获取用户提现费率相关信息
        $.ajaxE( {
            type: 'GET',
            url: '/user/account/getMyWihdrawInfo',
            data: {
            }
        }).then((data) => {
            this.setState({
                amount: $.toYuan(data.amount), //钱包余额(数字)
                withdrawAmount: $.toYuan(data.withdrawAmount),//钱包可提现余额(数字)
                sysWithdrawAmount: $.toYuan(data.sysWithdrawAmount),//当前用户的当前时间可提现余额(包含垫付金额)
                sysWithdrawRate: $.toYuan(data.sysWithdrawRate),//垫付费率(格式0.002)
            })

            // 提现金额处理
            this.dealMyWihdrawInfo()

        }).catch((msg) => {
            console.log(msg)
        })

    }
    // 提现金额处理
    dealMyWihdrawInfo = () => {
        let { amount, sysWithdrawAmount,maxMoney } = this.state
        //shilingling todu
        // let max = sysWithdrawAmount
        let max = amount;
        if (max > 0) {
            maxMoney = max
        } else {
            maxMoney = 0
        }
        this.setState({
            maxMoney:maxMoney
        })
        // //debugger
    }

    // 提现金额函数（判断显示提示信息展示）
    withdrawAmountFun = (v) => {
        let { feeShown, moreThanTotal, maxMoney } = this.state
        let amt = parseFloat(v)
        if (amt > maxMoney) {
            moreThanTotal = true
            feeShown = false
        } else if (amt > 0) {
            feeShown = true
            moreThanTotal = false
        } else {
            feeShown = false
            moreThanTotal = false
        }
        this.setState({
            moreThanTotal: moreThanTotal,
            feeShown: feeShown,
            withdrawMoney: v,
        }, () => {
            this.realAmount();
        })
    }

    //实际支付金额
    realAmount = () => {
        let { withdrawMoney } = this.state
        withdrawMoney = parseFloat(withdrawMoney) || 0;
        let realAmount = (withdrawMoney - 1).toFixed(2);
        this.setState({
            realAmount,
        })
        return realAmount
    }


    //特别提现手续费
    // fee=()=> {
    //     let { withdrawMoney, n_withdraw_amt,sysWithdrawRate } = this.state
    //     let feeWithdraw = parseFloat(withdrawMoney) || 0
    //     let fee = 0
    //     //是否需要计算特别提现手续费
    //     if (feeWithdraw > n_withdraw_amt) {
    //         fee = (feeWithdraw - n_withdraw_amt) * sysWithdrawRate
    //         if(fee < 1) {
    //             fee = 1
    //         }
    //         return fee.toFixed(2)
    //     }
    //     return 0
    // }

    //申请提现
    onSubmit=()=>{
        this.inputFocus.inputRef.inputRef.blur()
        let { withdrawMoney, maxMoney, amount, realAmount, cardNo} = this.state
        // 判断不能提现的时间区间
        let today = new Date()
        let tdHours = today.getHours()
        let tdMinutes = today.getMinutes()
        if ((tdHours === 22 && tdMinutes >= 45) || (tdHours === 23 && tdMinutes <= 15)) {
            Modal.alertX('提醒', '每日 22:45 至 23:15 为支付系统结算时间，请您稍后再尝试提现', [{
                text: '知道了', onPress: () => {}
            }]);
            return
        }
        let amt = parseFloat(withdrawMoney).toFixed(2);
        let amts=parseFloat(amt);
        let amounts=parseFloat(amount);
        let maxMoneys=parseFloat(maxMoney);
        if (!amts || amts < 1) {
            Modal.alertX('提醒', '提现金额需大于1元', [{
                text: '知道了', onPress: () => { }
            }]);
        
        } else if (amts > maxMoneys) {
            if (!amounts) {
                Modal.alertX('提醒', '您当前没有可提现余额，可能有部分钱款还处于在途状态', [{
                    text: '知道了', onPress: () => { }
                }]);
            } else if (amts > amounts) {
                Modal.alertX('提醒', '提现金额不得大于' + amounts+'元', [{
                    text: '知道了', onPress: () => { }
                }]);
            } else if (maxMoneys < amounts) {
                Modal.alertX('提醒', '您的提现出现了一些小问题，请联系客服解决010-53565973', [{
                    text: '取消', onPress: () => { }
                }, {
                    text: '拨打客服电话', onPress: (e) => {
                        setTimeout("window.location.href = 'tel:010-53565973';", 500)
                    }
                }]);
            } 
        } else if (cardNo=='') {
            Modal.alertX('提醒', '请选择一张银行卡', [{
                text: '知道了', onPress: () => {}
            }]);
        }
         else if (parseFloat(realAmount) <= 0) {
            Modal.alertX('提醒', '您的提现金额过小，请重新输入', [{
                text: '知道了', onPress: () => { }
            }]);
        } else {
            // 调出支付弹窗
            this.setState({
                withdrawMoney:amts,
                payPWD: true
            })
        }
    }
    
    //提交事件
    pwPop = (pwd)=>{
        //是否是微信平台
        if($.isWeiXin){
            this.cashConfirmWechat(pwd)
        }else{
            this.cashConfirApp(pwd)
        }
    }

    // 提现方法微信端
    cashConfirmWechat = (pwd)=>{
        let { bindBankId, withdrawMoney}= this.state
        //发送提现确认请求
        Loading.show();
        $.ajaxE( {
            type: 'POST',
            url: '/user/withdraw/withdrawConfirm',  
            data: {
                bindBankId: bindBankId,  // 银行卡ID
                payPassword: pwd,  //密码
                amount:$.toFen(withdrawMoney),   //客户提现金额
                payMethod:1
            }
        }).then((data) => {
            // 跳转操作结果页面
            let succ={
                amount:this.state.withdrawMoney,
                tradeType:'cash',
                bankCard:this.state.cardNo
            }
            this.props.bankStore.setPaySuccess(succ)
            this.props.history.push({
                pathname: '/card/trade_success'
            })
                
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
			Loading.hide();
		})
    }
    // 提现方法App第一步
    cashConfirApp = (pwd)=>{
        let { bindBankId, withdrawMoney}= this.state
        //发送提现确认请求
        $.ajaxE( {
            type: 'POST',
            url: '/user/withdraw/withdrawApply',  
            data: {
                // 银行卡ID
                bindBankId: bindBankId,
                //密码
                payPassword: pwd,
                //客户提现金额
                amount: $.toFen(withdrawMoney),
            }
        }).then((data) => {
            this.setState({
                modifyData:data,
                pwd:pwd,
                payCode:true
            })

        }).catch((msg) => {
            Modal.infoX(msg);
        })
    }
    // 提现方法App第二步
    onComfirmPay=(code)=>{
        let {modifyData, bindBankId, withdrawMoney,pwd}=this.state;
        Loading.show();
        $.ajaxE( {
            type: 'POST',
            url: '/user/withdraw/withdrawConfirm',  
            data: {
                bindBankId: bindBankId,  // 银行卡ID
                payPassword: pwd,  //密码
                amount: $.toFen(withdrawMoney), //客户提现金额
                orderNo:modifyData.orderNo,   //String 商户订单号（交易id，微信端不传）
                payMethod:1,
                payOrderNo:modifyData.payOrderNo,    //String 支付订单号或协议支付绑卡流水号(第三方支付公司返回，微信端不传)
                payChannelType:modifyData.payChannelType,   //Byte 银行卡支付通道，微信端不传：0-掌上汇通P2P通道；1-掌上汇通快捷通道；2-余额支付通道；4-易联插件通道；5-易联代收代付通道；7-合利宝支付通道；8-易宝支付通道；17-富友-协议支付(代收)；18-银联WAP支付(代收)；19-联拓
                payToken:modifyData.payToken,    //String 支付令牌(第三方支付公司返回，微信端不传)
                authCode:code,   //String 短信验证码，微信端不传
            }
        }).then((data) => {
            // 跳转操作结果页面
            let succ={
                amount:this.state.withdrawMoney,
                tradeType:'cash',
                bankCard:this.state.cardNo
            }
            this.props.bankStore.setPaySuccess(succ)
            this.props.history.push({
                pathname: '/card/trade_success',
            })
        }).catch((msg) => {
            Modal.infoX(msg,()=>{
                this.setState({
                    payPWD:true,
                    payCode:false
                })
            });
        }).finally(()=>{
			Loading.hide();
		})
    }
    // 跳转到支付与提现列表页
    toFaqsList= ()=>{
        this.props.history.push({
            pathname: '/user/faqs_list?faqTypeId=201711291633201382&faqTypeName=支付与提现'
        })
    }
    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        let { feeShown, moreThanTotal, realAmount, payPWD,payCode} = this.state
        return (
            <div className='view-cash view-card'>
                <List>
                    <Picker
                        {...getFieldProps('cardNo', {
                            initialValue: [this.state.cardNo],
                            rules: [{ required: true, message: '请选择银行卡' }],
                        })}
                        data={this.state.usableBankList}
                        cols={1}
                        extra="请选择"
                        onChange={(v) => {this.chosenCard(v)}}
                    >
                        <List.Item arrow="horizontal">银行卡</List.Item>
                    </Picker>
                    <div className='common-jc-error'>{getFieldError('cardNo') && getFieldError('cardNo').join(',')}</div>
                    <InputItem
                        {...getFieldProps('withdrawMoney', {
                            onChange: this.withdrawAmountFun,
                            rules: [{ required: true, message: '请输入提现金额(元)' }],
                        })}
                        ref = {ref=>this.inputFocus = ref}
                        type="digit"
                        clear
                        placeholder={'最多可提现' + this.state.maxMoney}
                    >提现金额(元)</InputItem>
                </List>

                <div className="alert-box tips">
                    {feeShown ?<div className="alert">实际到账金额 {realAmount} 元(扣除基础提现费1.00元)</div> : null}
                    {moreThanTotal?<div className="alert">超出可提现余额，请重新输入</div> :null}
                </div>

                <div className="com-tipe-div active">
                    <div className="com-tipe">
                        <p>提现的规则是什么？</p>
                        <p>正常情况下提现后立即到账；</p>
                        <p>如遇特殊情况，请耐心等待银行结果。</p>
                    </div>
                </div>

                <div className='common-btn_box'>
                    <Tap className='c-black span font16 active' onTap={this.onSubmit}>确认提现</Tap>
                </div>

                {/*支付密码*/}
                <InputValid
                    visible={payPWD}
                    onEnd={(e) => { this.setState({ payPWD: false }); this.pwPop(e)}}
                    onClose={() => { this.setState({ payPWD: false }) }} 
                  />

                {/*短信验证码*/}
                <InputCode 
                onClose={()=>{this.setState({payCode: false})}} 
                visible={payCode} 
                onEnd={(e) => { this.setState({ payPWD: false }); this.onComfirmPay(e)}} />

            </div>
        )
    }
}    

export default createForm()(App);
