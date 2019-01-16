
//发起销账
import '../form.less'
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { Link,withRouter } from 'react-router-dom'
import { List, Flex,InputItem, Picker, Button,Checkbox,} from 'antd-mobile'
import { createForm } from 'rc-form'
import { Loading, Modal, util,  } from 'SERVICE'
import { Tap,InputValid, InputCode, Pay, } from 'COMPONENT'

const c_payMethod = [
    {
        label: "其它方式已还款",
        value: '1'
    },{
        label: "出借人自愿免除债务",
        value: '2'
    },{
        label: "其它",
        value: '3'
    }
];
const c_payPeople = [
    {
        label: "借款人支付",
        value: 1
    },{
        label: "我来支付",
        value: 2
    }
];
@withRouter
@inject('userStore','afterIouStore')
@observer
class Page extends Component {
    constructor(props, context) {
        document.title = "发起销账";
        super(props, context)
        let query = util.getUrlParams(this.props.location.search);
        let ssData = this.props.afterIouStore.detail;
        this.state = {
            id:query.id,
            inputValidStatus: false, //验证支付密码弹窗
            payMethodSelected: 0, //选择的支付方式
            payPeople:1,
            payVisible:false,
            cPayVisible:false,
            //提交
            maxAmount:ssData.amount,
            overdueManageAmount:ssData.overdueManageAmount,
            //显示
            chargeOffMoney: ssData.amount, // 销账金额
            partOff:ssData.partOff,               //部分销账
            offId:null
        };
    }    

    onComfirm=(pwd)=>{
        Loading.show();
        let _this = this;
        const {amount,} = _this.props.afterIouStore.detail;
        const { payMethodSelected,payPeople,overdueManageAmount } = this.state;
        const postData = {
            amount: amount,
            loanId: _this.state.id,
            writeOffPayMethod: payMethodSelected,
            payPassword: pwd,
            offlinePayMethod:overdueManageAmount==0?2:payPeople
        };
        $.ajaxE({
            flag: 1,
            type: 'POST',
            url: '/loanlater/repay/applyWriteOffDirect',
            data: postData
        }).then((res) => {
            if(payPeople==2 && overdueManageAmount>10){
                _this.setState({
                    payVisible:true,
                    offId: res.data.orderNo
                });
            }else{
                _this.props.afterIouStore.setDetail({chargeOffMoney: amount*100,})
                _this.props.history.push({
                    pathname: '/after/writeoff_status',
                    search: `?id=${_this.state.id}___${res.data.orderNo}___2&payPeople=${payPeople}`,
                });
            }
        }).catch((res) => {
            _this.fromStatus(res.msg,res,2);
        }).finally(()=>{
            Loading.hide();
        })
    }    

    // 确定销账点击事件
    submit = () => {
        this.props.form.validateFields((error, value) => {
            if (!error) {
                this.setState({
                    inputValidStatus: true,
                    chargeOffMoney:value.chargeOffMoney,
                })
            }
        })
    }
    
    //根据repay/repayApply 返回的status 判断
    fromStatus=(msg,res,type)=>{
        const _this = this;
        if(res.status==202){
            //"msg": "有一笔线下还款需要您处理，请先处理后再发起销账",
            Modal.alertX('提示', msg, [
                { text: '取消', onPress: () => {} },
                { text: '去处理', onPress: () => {
                    _this.props.history.push({
                        pathname: '/after/loan_detail',
                        search: `?id=${res.data.payToken}&tab=1`
                    });
                }},
            ])
        }else{
            if(type==2){
                Modal.infoX(msg);
            }else{
                Modal.infoX(msg);
            }
        }
    }

    // 验证输入的支付密码
    onPwdConfirm = (pwd) => {
        this.onComfirm(pwd)    
    }

    onMountTip = ()=>{
        if(!this.state.partOff){
            Modal.infoX('该借条目前只支持全额销账,金额不能修改。只支持全额销账的借条类型有：被举报成功的补借条、线上分期或逾期的借条。');
        }
    }

    //验证输入金额
	validateAmt =(rule, value, callback)=>{
		setTimeout(() => {
			if (value > this.state.maxAmount/100 || value <= 0) {
				callback([new Error('销账金额不得小于等于0,不得大于'+this.state.maxAmount/100)]);
			} else {
				callback();
			}
		}, 300);
    }
    
    onTypeSelect=(v)=>{
        this.setState({ payMethodSelected: v[0] });
    }

    onPeopleSelect=(v)=>{
        this.setState({ payPeople: v[0] });
    }

    onPay=(data)=>{
        const _this = this;
        if($.isWechat && data.payMethod==0){
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
                    writeOffId: _this.state.offId,//销账申请id
                    bindBankId:data.bindBankId,
                    amount: _this.state.overdueManageAmount,
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
                            _this.props.history.push({
                                pathname: '/after/writeoff_status',
                                search: `?id=${_this.state.id}___${_this.state.offId}___2&payPeople=${_this.state.payPeople}`,
                            });
                        });
                    })
                }else if(data.payMethod==3){
                    //银联支付
                    $.payYinLian(res.payToken);
                }else if(data.payMethod==4){//微信支付
                    //history.pushState(null, null, '/');
                    localStorage.setItem('confirm_write_off_back','-2')
                    let payToken = JSON.parse(res.payToken)
                    $.payWeiXin(payToken);
                }else{
                    //确认支付   余额和银行卡需要
                     //orderNo:22,payChannelType:1,payOrderNo:22,payToken:22 
                     let payData = {
                        writeOffId: _this.state.offId,//销账申请id
                        amount:_this.state.overdueManageAmount,
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
        if($.isWechat && payData.payMethod==0){
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
            url: '/loanlater/repay/confirmWriteOffConfirm',
            data: payData,
        }).then((data)=>{
            Modal.infoX('销账成功!',()=>{
                _this.props.history.push({
                    pathname: '/after/writeoff_status',
                    search: `?id=${_this.state.id}___${_this.state.offId}___2&payPeople=${_this.state.payPeople}`
                });
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
        const { getFieldProps, getFieldError } = this.props.form;
        return (
            <div className="apply-write_off view-form">
                <List className="form-input-list">
                    <Picker
                        {...getFieldProps('payMethodSelected', {
                            rules: [{ required: true, message: '请选择销帐原因' }],
                        })}
                        data={c_payMethod}
                        cols={1}
                        extra={'请选择'}
                        value={this.state.payMethodSelected}
                        onOk={this.onTypeSelect}>
                        <List.Item arrow="horizontal">销帐原因</List.Item>
                    </Picker>
                    <div className='common-jc-error'>{getFieldError('payMethodSelected') && getFieldError('payMethodSelected').join(',')}</div>

                    <InputItem
                        {...getFieldProps('chargeOffMoney', {
                            initialValue:this.state.maxAmount/100,
                            rules: [
                                { required: true, message: '请输入销账金额' },
                                { validator: this.validateAmt },
                            ],
                        })}
                        editable={this.state.partOff}
                        type="digit"
                        onFocus={this.onMountTip}
                        placeholder="请输入销账金额"
                        clear
                        extra='元'>
                        销账金额
                    </InputItem>
                    <div className='common-jc-error'>{getFieldError('chargeOffMoney') && getFieldError('chargeOffMoney').join(',')}</div>
                    {this.state.overdueManageAmount&&this.state.payPeople==1?<div className="tip-money">需借款人支付逾期管理费{parseInt(Math.round(this.state.overdueManageAmount/100*100))/100}元</div>:null}
                </List>
                <div className="com-tipe-div active">
                    <div className="com-tipe">
                        <p>提示</p>
                        <p>销账前请务必确认已收到对方还款</p>
                    </div>
                </div>
                {this.state.overdueManageAmount?<div className="select-item">
                <Picker
                    data={c_payPeople}
                    cols={1}
                    extra={'请选择'}
                    value={[this.state.payPeople]}
                    onOk={this.onPeopleSelect}>
                    <List.Item arrow="horizontal" multipleLine>
                    逾期管理费
                        {this.state.payPeople==2?<List.Item.Brief>
                            需支付金额:{parseInt(Math.round(this.state.overdueManageAmount/100*100))/100}元
                        </List.Item.Brief>:null}
                    </List.Item>
                </Picker>
                </div>:null}
                <div className='common-btn_box'>
                    <Tap className='c-black span font16 active' onTap={this.submit}>确定销账</Tap>
                </div>

                <Modal visible={this.state.pop1}
                    transparent
                    maskClosable={false}
                    footer={[
                        { text: '取消', onPress: () => {this.setState({pop1:false})}},
                        { text: '继续发起', onPress: () => {}}]}>
                        <div className="model_common">
                            <img src={'/imgs/iou/model-error.svg'} className="model_img" />
                            <div className="model_font mart4">销账等同于还款，发起销账前请您务必确认已收到还款，销账一经发起不能撤销，请慎重操作。</div>
                        </div>
                </Modal>

                <Pay telephone={this.props.userStore.userInfo.telephone}
                    money={parseInt(Math.round(this.props.afterIouStore.detail.overdueManageAmount/100*100))/100}
                    moneyL={parseInt(Math.round(this.props.afterIouStore.detail.overdueManageAmount/100*100))/100}
                    input={false}
                    onPayEnd={this.onPay}
                    onClose={()=>{this.setState({payVisible: false})}}
                    payVisible={this.state.payVisible}>	                    
                </Pay>
                <InputCode onClose={()=>{this.setState({cPayVisible: false})}} visible={this.state.cPayVisible} onSend={this.applyWriteOff} onEnd={this.onComfirmPay} />
                <InputValid
                    visible={this.state.inputValidStatus}
                    onEnd={(e) => { this.setState({ inputValidStatus: false }), this.onPwdConfirm(e) }}
                    onClose={() => { this.setState({ inputValidStatus: false }) }}
                />
            </div>
        )
    }
}
export default createForm()(Page);