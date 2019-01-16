
//信用报告
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import {Tap, InputValid, PullAndPush, Pay,InputCode } from 'COMPONENT'
import { Button, List, Checkbox, Toast } from 'antd-mobile';
import { Loading ,Modal} from 'SERVICE'
import { inject, observer } from 'mobx-react'
const CheckboxItem = Checkbox.CheckboxItem;

const Item = List.Item;

@withRouter
@inject('userStore')
@observer
export default class App extends Component {
    constructor(props, context) {
        document.title = "支付信用报告";
        super(props, context)
        this.state = {
            modal1:false,       //支付规则弹窗
            payVisible: false,  //付款弹框
            cPayVisible:false,  //确认付款验证码
            payData:null,   //支付暂存数据

            checked1:true,//选项1是否选中
            checked2:false,//选项2 初始值选中 
            payMoney:9.90,//选中支付费用
            payCredit:'', //绑卡扣费方式
            
        };
    }

    componentDidMount(){
        //this.getInfo()

        //用户点击银联支付后不支付返回原页面，清空值
        //$.clearThirdBackPath()
    }

    // 选项1
    onChange1 = () => {
        let { checked1, payMoney} = this.state
        this.setState({
            checked1:true,
            checked2:false,
            payMoney:9.90,
        })
    }
    //选项2
    onChange2 = () => {
        let { checked2, payMoney } = this.state
        this.setState({
            checked1: false,
            checked2: true,
            payMoney: 118.80,
        })

    }
    // 显示支付规则弹窗
    showPop = () => {        
        this.setState({
            modal1:true
        })
    }    

    // 弹支付组件
    payCardPass = (v) => {
        let {payCredit,payMoney}=this.state;
        if(payMoney==9.9){
            payCredit=0;
        }else if(payMoney==118.8){
            payCredit=1;
        }
        this.setState({
            payCredit:payCredit,
            payVisible:true
        }) 
    }  
    //确定支付
    onPay=(data)=>{
        data.amount=$.toFen(data.amount)
        if($.isWeiXin && data.payMethod==0){
            this.setState({
                payVisible:false,
                cPayVisible: false,
                payData: data
            },()=>{
                this.onComfirmPay();
            })
        }else{
            Loading.show();
            $.ajaxE({
                type: 'POST',
                url: '/user/creditFee/payCreditFee',
                data:{
                    bindBankId:data.bindBankId,
                    amount:data.amount, //Integer 金额
                    payPassword:data.payPassword, //String 支付密码
                    payMethod:data.payMethod, //Byte 支付方式 ：0.余额 1.银行卡 2-线下 3.银联(收银台类) 4.微信(app类)
                }
            }).then((res)=>{
                if(data.payMethod==2){
                    //线下支付
                    Toast.success('支付成功', 2);
                    store=[]
                    // 成功之后
                    this.setState({
                        payVisible: false,
                        cPayVisible: false
                    })
                    this.props.userStore.getUserCreditInfo();
                    this.props.history.push({
                        pathname: '/credit',
                    });
                }else if(data.payMethod==3){
                    localStorage.setItem('ylCredit',"pay_creditSuccess");
                    //银联支付
                    document.write(res.payToken);
                } else if(data.payMethod==4){//微信支付
                    let payToken = JSON.parse(res.payToken)
                    localStorage.setItem('wxCredit',"pay_creditSuccess");
                    $.payWeiXin(payToken);
                }else{
                    //确认支付   余额和银行卡需要
                     //orderNo:22,payChannelType:1,payOrderNo:22,payToken:22 
                     let payData = {
                        orderNo:res.orderNo,  //String 商户订单号（交易id）
                        amount:data.amount,   // 支付金额
                        payOrderNo:res.payOrderNo,    //支付订单号或协议支付绑卡流水号(第三方支付公司返回)
                        payMethod:data.payMethod,   //Byte 支付方式 ：0.余额 1.银行卡 2-线下 3.银联(收银台类) 4.微信(app类)
                        payChannelType:res.payChannelType,   //银行卡支付通道：0-掌上汇通P2P通道；1-掌上汇通快捷通道；2-余额支付通道；4-易联插件通道；5-易联代收代付通道；7-合利宝支付通道；8-易宝支付通道；17-富友-协议支付(代收)；18-银联WAP支付(代收)；19-联拓
                        payToken:res.payToken,    //支付令牌(第三方支付公司返回)
                        payPassword:data.payPassword,
                        protocolBind:data.protocolBind,
                        //authCode:'1234',  //短信验证码、
                    };
                     this.setState({
                        cPayVisible: true,
                        payData: payData
                    })
                }
            }).catch((msg)=>{
                Modal.infoX(msg);
            }).finally(()=>{
                Loading.hide();
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
            url: '/user/creditFee/payCreditFeeConfirm',
            data: payData,
        }).then((data)=>{
            this.setState({
                payVisible: false,
                cPayVisible: false
            })
            this.props.userStore.getUserCreditInfo();
            this.props.history.push({
                pathname: '/credit',
            });
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
        let { payMoney, checked1, checked2} = this.state;
        return (
            <div className='view-pay-credit'>
                <div className="cred-com-li">
                    <span className="line"></span>
                    <span className="font bold">信用认证费用类别</span>
                    <div className='rule'>
                        <img src={'/imgs/credit/quest-mark.svg'} /><span className="font">规则</span>
                    </div>
                </div>
                
                <div className={checked1?"pay-cred mat06 active":"pay-cred mat06"}>
                    <Tap onTap={this.onChange1}>
                        <div className="pay-cred-tit font18">单次认证</div>
                        <div className="pay-cred-con"><span className="pay-icon">普</span><span className="font">有效期仅有30天，到期可续费</span></div>
                        <div className="pay-cred-money"><i>¥</i> 9.90</div>
                    </Tap>
                </div>

                
                <div className={checked2?"pay-cred active":"pay-cred"}>
                    <Tap onTap={this.onChange2}>
                        <div className="pay-cred-tit">超级认证20次</div>
                        <div className="pay-cred-con"><span className="pay-icon">超</span><span className="font">有效期长达360天</span></div>
                        <div className="pay-cred-money"><s>¥118.80</s><i>¥</i> 118.80</div>
                    </Tap>
                </div>
                

                <div className='common-btn_box'>
                    <Tap onTap={() => { this.payCardPass() }} className='c-black span font16 active'>支付认证费{payMoney.toFixed(2)}元</Tap>
                </div>



                <Modal
                    visible={this.state.modal1}
                    transparent
                    bodyStyle={{height:'200px'}}
                    maskClosable={false}
                    title="提示"
                    className='pay-credit'
                    footer={[{ text: '知道了', onPress: () => {this.setState({modal1: false})} }]}
                    >
                    <p className="topbot10">1.信用认证费</p>
                    <p>9.90元/次，用于更新信用报告时，支付给第三方数据公司，一次认证有效期为30天，超过30天需重新认证，只有信用认证过后才可以正确使用求借款/补借条/申请借款/去借出等功能。</p>
                    <p  className="topbot10">2.超级认证费</p>
                    <p>a.当您是出借人身份时：可以360天免认证，同时获得20次免费主动更新认证机会，当您的重要信息发生变化时，即可更新认证，让您更值得借款人信任;</p>
                    <p>b.当您是借款人身份时：可获得20次免费主动认证机会，当您需要认证时，可直接抵用认证次数，无需再次付费，让您更快借到钱；</p>
                    <p  className="topbot10">c.所有购买用户：若360天内20次认证用完，需再次付费认证；超过360天后，若还剩余免费认证次数，则免费认证次数失效。</p>
                    <p  className="topbot10">3.若在有效期内，由于其他原因需要重新认证生成信用报告，则需要再次支付单次认证费用或自动扣除超级认证次数。</p>
                    <p  className="topbot10">4.若在认证过程中，支付没有成功，建议重新支付。如果上次已经扣款成功，平台会在第二个工作日将您多支付的款项存入您的账户余额中。</p>
                    <p>5.为了不影响您对产品功能的使用，建议您的重要信息发生变化后尽快进行重新认证更新信用报告。</p>
                    
                </Modal>

                <Pay 
                    money={this.state.payMoney}
                    moneyL={this.state.payMoney}
                    input={false}
                    noPoundage={true}
                    payVisible={this.state.payVisible}
                    payCredit={this.state.payCredit}
                    onEnd={this.onPay}
                    onClose={()=>{this.setState({payVisible: false})}}
                />
                <InputCode onClose={()=>{this.setState({cPayVisible: false})}} visible={this.state.cPayVisible} onEnd={this.onComfirmPay} />
                

            </div>
        )
    }
}
