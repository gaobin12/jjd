
//借条详情（借款人）—确认销账
import '../form.less';
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { Link,withRouter } from 'react-router-dom'
import { List, Flex, Checkbox} from 'antd-mobile'
import { Loading, Modal, util, math } from 'SERVICE'
import { Tap, Pay, InputValid, InputCode } from 'COMPONENT'

const Item = List.Item;

const writeOffPayMethodStr = [
    {
        text: "其他方式已还款",
    },
    {
        text: "出借人自愿免除债务",
    },
    {
        text: "其他",
    }
];

@withRouter
@inject('userStore','afterIouStore')
@observer

export default class Page extends Component {
    constructor(props, context) {
        document.title = "确认销账";
        super(props, context)
        let query = util.getUrlParams(this.props.location.search);
        this.state = {
            payVisible:false,
            //支付交易验证码
            cPayVisible:false,
            //支付暂存数据
			payData:null,
            id:query.id,
            amount: '',// 销账金额
            overdueManageFee: '', // 支付给我们的逾期管理费+逾期特别管理费
            writeOffStatus: '', //销账状态：0-已申请(初始值)；1-已拒绝；2-已接收-支付成功；3-已接收-支付失败
            writeOffPayMethod: 3, // (销账时)还款方式：1-其它方式已还款；2-出借人自愿免除债务；3其它
            borrowerName: '', // 借款人姓名
            borrowerTelephone: '', // 出借人电话
            restTime: '', // 销账申请剩余时间

            orderNo: '', //Long 商户订单号（交易id）
            payOrderNo: '', //String 支付订单号或协议支付绑卡流水号(第三方支付公司返回)
            payToken: '', //String 支付令牌(第三方支付公司返回)
            protocolBind: '', //Boolean 是否协议绑卡(申请支付时返回给前端，确认时原样返回即可)
            payChannelType: '', // 银行卡支付通道：0-掌上汇通P2P通道；1-掌上汇通快捷通道；2-余额支付通道；4-易联插件通道；5-易联代收代付通道；7-合利宝支付通道；8-易宝支付通道；17-富友-协议支付(代收)；18-银联WAP支付(代收)；19-联拓
        };
    }

    componentDidMount() {
        this.getWriteOff();
    }

    //获取销账详情
    getWriteOff = () => {
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/loanlater/repay/getWriteOffConfirmInfo',
            data: {
                writeOffId: this.state.id
            }
        }).then((data) => {
            this.setState({
                amount: data.amount,// 销账金额
                overdueManageFee: data.overdueManageFee, // 支付给我们的逾期管理费+逾期特别管理费
                writeOffStatus: data.writeOffStatus, //销账状态：0-已申请(初始值)；1-已拒绝；2-已接收-支付成功；3-已接收-支付失败
                writeOffPayMethod: data.writeOffPayMethod, // (销账时)还款方式：1-其它方式已还款；2-出借人自愿免除债务；3其它
                borrowerName: data.borrowerName, // 借款人姓名
                borrowerTelephone: data.borrowerTelephone, // 出借人电话
                restTime: data.restTime, // 销账申请剩余时间
            })
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
            //Loading.show();
            Loading.hide();
        })
    }

    // 驳回销账
    rejectWriteOff = () => {
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/loanlater/repay/rejectWriteOff',
            data: {
                id:this.state.id
            }
        }).then((data) => {
            Modal.infoX('驳回销账成功',()=>{
                history.back();
            });
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
            //Loading.show();
            Loading.hide();
        })
    }

    //确认销账
    onConfirm=()=>{
        this.setState({
            payVisible:true
        });
    }

    onPay=(data)=>{
        //debugger;
        const _this = this;
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
                url: '/loanlater/repay/confirmWriteOffApply',
                data: {
                    writeOffId: _this.state.id,//销账申请id
                    bindBankId:data.bindBankId,
                    amount: _this.state.overdueManageFee,
                    payPassword:data.payPassword,
                    payMethod:data.payMethod
                }
            }).then((res) => {
                if(data.payMethod==2){
                    //不需要确认
                    _this.setState({
                        payVisible: false,
                    },()=>{                        
                        Modal.infoX('销账成功!',()=>{
                            history.back();
                        });
                    })
                }else if(data.payMethod==3){
                    //银联支付
                    document.write(res.payToken);
                }else if(data.payMethod==4){//微信支付
                    //history.pushState(null, null, '/');
                    localStorage.setItem('confirm_write_off_back','-2')
                    let payToken = JSON.parse(res.payToken)
                    $.payWeiXin(payToken);
                }else{
                    //确认支付   余额和银行卡需要
                     //orderNo:22,payChannelType:1,payOrderNo:22,payToken:22 
                     let payData = {
                        writeOffId: _this.state.id,//销账申请id
                        amount:_this.state.overdueManageFee,
                        orderNo:res.orderNo,//Long 商户订单号（交易id）
                        payOrderNo:res.payOrderNo, //支付订单号或协议支付绑卡流水号(第三方支付公司返回)
                        payMethod:data.payMethod,//Byte 支付方式 ：0.余额  1.银行卡  2-线下 3.银联(收银台类) 4.微信(app类)
                        payChannelType:res.payChannelType, //银行卡支付通道：0-掌上汇通P2P通道；1-掌上汇通快捷通道；2-余额支付通道；4-易联插件通道；5-易联代收代付通道；7-合利宝支付通道；8-易宝支付通道；17-富友-协议支付(代收)；18-银联WAP支付(代收)；19-联拓
                        payToken:res.payToken,//支付令牌(第三方支付公司返回)
                        //authCode:'1234', //短信验证码
                        protocolBind:res.protocolBind,//Boolean 是否协议绑卡
                    };
                     _this.setState({
                        payVisible:false,
                        cPayVisible: true,
                        payData: payData
                    })
                }
            }).catch((msg) => {
                Modal.infoX(msg);
            }).finally(()=>{
                //Loading.show();
                Loading.hide();
            })
        }
    }

    //验证码确认支付
    onComfirmPay=(valus)=>{
        const _this = this;
        let payData = _this.state.payData;
        if($.isWeiXin && payData.payMethod==0){
            //微信环境 余额支付直接走确认
            payData.payChannelType = 2;//这个值本来应该从申请支付后台返回，现在直接走确认，所以写死
        }else{
            //接收验证码
            payData.authCode = valus;
            delete payData.payPassword;
        }
        payData.writeOffId = _this.state.id;//销账申请id
        payData.amount = _this.state.overdueManageFee;
        // debugger;
        // return;
        Loading.show();
        $.ajaxE({
            type: 'POST',
            url: '/loanlater/repay/confirmWriteOffConfirm',
            data: payData,
        }).then((data)=>{
            Modal.infoX('销账成功!',()=>{
                history.back();
            });
        }).catch((msg)=>{
            _this.setState({
                payVisible: false,
                cPayVisible: false
            },()=>{
                Modal.infoX(msg,()=>{
                    _this.setState({
                        payVisible: true,
                        cPayVisible: false
                    })
                })
            })
        }).finally(()=>{
            //Loading.show();
            Loading.hide();
        })
    }


    render() {
        let { writeOffPayMethod, amount, overdueManageFee } = this.state;
        return (
            <div className="view-form">
                <List className="detail_list">
                    <List.Item extra={writeOffPayMethodStr[writeOffPayMethod - 1].text}>销帐原因</List.Item>
                    <List.Item extra={amount/100+'元'}>销账金额</List.Item>
                    <List.Item extra={overdueManageFee/100+'元'}>应还逾期管理费</List.Item>
                </List>

                <div className='common-btn_box'>
                    <Tap className='c-white span font16' onTap={this.rejectWriteOff}>驳回</Tap>
                    <Tap className='c-black span font16 active' onTap={this.onConfirm}>确定销账</Tap>
                </div>
                {this.state.payVisible?<Pay telephone={this.props.userStore.userInfo.telephone}
							money={this.state.overdueManageFee/100}
							moneyL={this.state.overdueManageFee/100}
                            onPayEnd={this.onPay}
                            input={false}
                            noPoundage={true}
                            onClose={()=>{this.setState({payVisible:false})}}
                            payVisible={this.state.payVisible}>	
                </Pay>:null}
                <InputCode onClose={()=>{this.setState({cPayVisible: false})}} visible={this.state.cPayVisible} onEnd={this.onComfirmPay} />

            </div>
        )
    }
}


