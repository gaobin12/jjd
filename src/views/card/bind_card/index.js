
//银行卡
import '../card.less'
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { List, InputItem, Flex } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Tap, CountDown,Side } from 'COMPONENT'
import { Loading, Modal } from 'SERVICE'
// import cardFarmat from ''


const cardFarmat = require('SERVICE/card_bank_map').default;

@withRouter
class App extends Component {
    constructor(props, context) {
        document.title = "绑定银行卡";
        super(props, context)
        //获取链接信息
        let {query} = this.props.location;
        this.state = {
            //用户是否有信用报告
            creditOk:'',            
            //未设置交易密码
            pwdOk:'',
            //订单号
            orderId:'',
            //银行卡号
            bankCard:'',
            //归属银行
            bankName:'',
            //持卡人姓名
            fullName:'',
            //身份证号码
            idCardNo:'',
            //手机号验证
            mobileValid: false,
            //发送验证码返回的订单信息
            cardOrder:null,
            idCardNoFull:'',  //身份证号全写
            passwordStatus:0,   
            payCredit:1,   
            // passwordStatus:$.getCreditInfo().passwordStatus,   //设置交易密码  0 没有 1有
            // payCredit:query.payCredit,   //状态0 9.9 状态1 198
            payCreditState:3,
            bankNameType:1,
            payButton:false,
            telphone:'',
            bankCardNew:'',
        };
    }

    componentDidMount(){
        let query = this.props.location.query;
        if(query && query.payCredit){
            this.setState({
                payCreditState:query.payCredit
            })
        }
        this.getMyCard();
    }

    
    //获取我的银行卡
    getMyCard = () => {
        $.ajaxE({
            type: 'GET',
            url: '/user/my/getMyIdcard',
            data: {}
        }).then((data) => {
            this.setState({
                fullName:data.fullName,
                idCardNo:data.idCardNo,
                idCardNoFull:data.idCardNoFull
            })
        }).catch((msg) => {
            Modal.infoX(msg);
        })
    }

    // 识别哪个银行
    identBank = (v) => {
        this.setState({
			bankCard:parseInt(v)
		},()=>{
            if(v.length>6){
                let cardHead = v.replace(/\s+/g, '');
                let cardHeadSub = cardHead.substr(0,6);
                let bankNames=cardFarmat[cardHeadSub];
                if(bankNames){
                    this.setState({
                        bankName:bankNames,
                        bankNameType:1
                    })
                }
                
                
            }			
		})        
    }
    //验证银行卡所属银行
	validateCard =(rule, value, callback)=>{
		setTimeout(() => {
			if (this.state.bankName) {
				callback();
			} else {
                callback([new Error('没有找到所属银行')]);
			}
		}, 300);
	}
    //验证银行卡是不是小于25位
    idBanklend=(v)=>{
        let vs=v.replace(/\s+/g, '')
        if(vs.length>30){
            this.setState({
                bankNameType:3
            })
        }else if(!this.state.bankName){
            this.setState({
                bankNameType:2
            })
            
        }else{
            this.setState({
                bankNameType:1
            })
        }
    }

    //手机号码正确可以输入验证码
    onMobileChange=(phone)=>{
        if(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(phone)){
                this.setState({
                    mobileValid: true
                })
        }else{
            this.setState({
                mobileValid: false
            })
        }
    }

    //发送验证码
    onSendValid=()=>{
        let _data = this.props.form.getFieldsValue();
        if(!_data.idCardNo){
            _data.idCardNo=this.state.idCardNoFull;
        }
        if(!_data.fullName){
            _data.fullName=this.state.fullName;
        }
        if(!this.state.payCredit){
            this.state.payCredit = '';
            this.setState({
                payCreditState:3,
            })
        }
        //发送验证码
        $.ajaxE({
            type: 'POST',
            url: '/user/bindCard/getBindCardSMS',
            data: {
                userIdCardNo:_data.idCardNo,
                bankCardNo:_data.bankCard.replace(/\s+/g, ''),
                userTel:_data.phone,
                userFullName:_data.fullName,
                payCredit:this.state.payCredit,
            },
        }).then((data)=>{
            this.setState({
                cardOrder:data,
                payButton:true,
                telphone:_data.phone,
                bankCardNew:_data.bankCard.replace(/\s+/g, ''),
            })
        }).catch((msg,code)=>{
            // Modal.infoX(msg);
            Modal.infoX(<div dangerouslySetInnerHTML={{ __html:msg }}></div>,()=>{
                this.setState({
                    payButton:false
                })
            });
        })
    }
    // 判断传入是否为null
	isNull= (item) =>{
		if(typeof(item)=='undefined' || item==null || item=='' || item == 'undefined' || item == 'null'){
			return true;
		}
		return false;
	}
    //提交表单事件
    onSubmit = () => {
        this.props.form.validateFields((error,values) => {
            if (!error&&this.state.bankNameType==1) {
                this.ajaxCard(values);
            }
        });
    }
    
    ajaxCard=(v)=>{
        if(!v.idCardNo){
            v.idCardNo=this.state.idCardNoFull;
        }
        if(!v.fullName){
            v.fullName=this.state.fullName;
        }
        if(!this.state.payCredit){
            this.state.payCredit = '';
            this.setState({
                payCreditState:3,
            })
        }
        if(this.state.telphone!=v.phone){
            Modal.alertX('提醒', '手机号已修改，请重新获取验证码', [{
                text: '知道了', onPress: () => {
                    this.setState({
                        mobileValid: true,
                        payButton:false
                    }) 
                 }
            }]);
            return;
        }
        if(this.state.bankCardNew!=v.bankCard.replace(/\s+/g, '')){
            Modal.alertX('提醒', '银行卡号已修改，请重新获取验证码', [{
                text: '知道了', onPress: () => {
                    this.setState({
                        mobileValid: true,
                        payButton:false
                    }) 
                 }
            }]);
            return;
        }
        let postData = {
            orderNo:this.state.cardOrder.orderNo,
            //支付订单号或协议支付绑卡流水号(第三方支付公司返回)
            payOrderNo:this.state.cardOrder.payOrderNo,
            //支付方式 ：0.余额 1.银行卡 2-线下 3.银联(收银台类) 4.微信(app类)
            payMethod:1,
            //银行卡支付通道
            payChannelType:this.state.cardOrder.payChannelType,
            //支付令牌
            payToken:this.state.cardOrder.payToken,
            //是否协议绑卡(申请支付时返回给前端，确认时原样返回即可)
            protocolBind:this.state.cardOrder.protocolBind,
            //短信验证码
            authCode:v.validCode,
            //银行名称
            bankName:this.state.bankName,
            // 用户的身份证号
            userIdCardNo:v.idCardNo,
            //银行卡ID
            bankCardNo:v.bankCard.replace(/\s+/g, ''),
            // 手机号
            userTel:v.phone,
            // 用户的名称
            userFullName:v.fullName,
            //支付费用
            payCredit:this.state.payCredit,
        };
        //绑卡
        Loading.show();
        $.ajaxE({
            type: 'POST',
            url: '/user/bindCard/confirmBindCard',
            data: postData
        }).then((data)=>{
            //更新用户认证状态
            this.getUserInfo();
            let pathname_back=sessionStorage.getItem('card_back_pathname');
            sessionStorage.setItem('card_back_pathname',"");
            if(parseInt(this.state.payCredit)===0 || parseInt(this.state.payCredit)===1){
                Modal.alertX('绑卡成功', '已提交，正在等待银行校验结果', [{
                    text: '知道了', onPress: () => {
                        this.props.history.push({
                            pathname: '/credit',
                        });
                     }
                }]);
            }else if(pathname_back){
                Modal.alertX('绑卡成功', '已提交，正在等待银行校验结果', [{
                    text: '知道了', onPress: () => {
                        this.props.history.push({
                            pathname: pathname_back,
                        });
                     }
                }]);
            }else{
                Modal.alertX('绑卡成功', '已提交，正在等待银行校验结果', [{
                    text: '知道了', onPress: () => {
                        this.props.history.push({
                            pathname: '/card',
                        });
                     }
                }]);
            }
            
        }).catch((msg)=>{
            // Modal.infoX(msg);
            Modal.infoX(<div dangerouslySetInnerHTML={{ __html:msg }}></div>,()=>{
                this.setState({
                    payButton:false
                })
            });
            
        }).finally(()=>{
			Loading.hide();
		})
    }
    getUserInfo=()=>{
        $.ajaxE({
            type: 'GET',
            url: '/user/info/getUserInfo',
            data:{
                userId:$.getUserInfo().userId
            }
        }).then((data)=>{
            $.setUserInfo(data);
        }).catch((msg)=>{   
            console.log(msg);
        })
    }
    

    render() {
        const { getFieldProps,getFieldError } = this.props.form;
        let {bankName,mobileValid,fullName,idCardNo,payButton}=this.state;
        return (
            <div className='view-bind-bank-card view-card'>
                <div style={{height: '100%',overflow:'auto'}}>
                    <List className="bank-list">
                        {fullName?<div className="am-list-item am-input-item am-list-item-middle">
                            <div className="am-list-line">
                                <div className="am-input-label am-input-label-5">持卡人</div>
                                <div className="am-input-control">{fullName}</div>
                            </div>
                        </div>:<div>
                            <InputItem
                                type="text"
                                {...getFieldProps('fullName', {
                                    rules: [
                                        { required: true, message: '请输入持卡人姓名！' },
                                        //{pattern: /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/, message: '姓名格式不正确!'},
                                    ],
                                    validateTrigger:'onBlur'
                                })}
                                clear
                                placeholder="请输入姓名"
                            >持卡人</InputItem>
                            <div className='common-jc-error'>{getFieldError('fullName') && getFieldError('fullName').join(',')}</div>
                        </div>}
                        {idCardNo?<div className="am-list-item am-input-item am-list-item-middle">
                            <div className="am-list-line">
                                <div className="am-input-label am-input-label-5">身份证号</div>
                                <div className="am-input-control">{idCardNo}</div>
                            </div>
                        </div>:<div>
                            <InputItem
                                type="text"
                                {...getFieldProps('idCardNo',{
                                    //initialValue:'340881198903241435',
                                    rules: [
                                        {pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证格式不正确!',
                                        }, {
                                            required: true, message: '请输入身份证号码！',
                                        }],
                                        validateTrigger:'onBlur'

                                })}
                                type="text"
                                clear
                                placeholder="请输入身份证号码"
                            >身份证号</InputItem>
                            <div className='common-jc-error'>{getFieldError('idCardNo') && getFieldError('idCardNo').join(',')}</div>
                        </div>}
                        <InputItem
                            type="bankCard"
                            {...getFieldProps("bankCard",{
                                onChange:this.identBank,
                                rules: [
                                    {required: true,message: '请输入银行卡号'}
                                ],
                                validateTrigger:'onBlur'
                            })}
                            onBlur={(v) => { this.idBanklend(v) }}
                            placeholder="请输入银行卡号"
                            clear
                        >银行卡</InputItem>
                        <div className='common-jc-error'>{this.state.bankNameType==2?'请输入正确的银行卡号':this.state.bankNameType==3?'银行卡需小于30位'
                        :getFieldError('bankCard') && getFieldError('bankCard').join(',')}</div>
                        {bankName?<div className="am-list-item am-input-item am-list-item-middle">
                            <div className="am-list-line">
                                <div className="am-input-label am-input-label-5">所属银行</div>
                                <div className="am-input-control">{bankName}</div>
                            </div>
                        </div>:null}
                        <InputItem
                            {...getFieldProps('phone',{
                                onChange: this.onMobileChange,
                                rules: [
                                    {pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '手机号格式不正确!',
                                    }, 
                                    {required: true, message: '务必输入银行预留手机号'}],
                                    validateTrigger:'onBlur'
                            })}
                            clear
                            type="number"
                            placeholder="务必输入银行预留手机号"
                        >手机号码</InputItem>
                        <div className='common-jc-error'>{getFieldError('phone') && getFieldError('phone').join(',')}</div> 
                        
                        <div className="login_row">
                            <InputItem
                                type="number" 
                                {...getFieldProps('validCode',{
                                    rules: [
                                        { required: true, message: '请输入验证码！' },
                                    ],
                                    validateTrigger:'onBlur'
                                })}
                                placeholder="请输入验证码"
                                clear
                            >验证码</InputItem>
                        <CountDown className={mobileValid?"verigy_span":"verigy_span disable"} onSend={mobileValid?this.onSendValid:null} />                        
                        <div className='common-jc-error'>{getFieldError('validCode') && getFieldError('validCode').join(',')}</div>   
                        </div>

                    </List>

                    <Side>
                        <p>提示</p>
                        <p>请您避免绑定信用卡、结算卡</p>
                        {this.state.payCreditState==0?<p>点击【支付认证费】后，银行会向该卡扣取9.90元</p>:null}
                        {this.state.payCreditState==1?<p>点击【支付认证费】后，银行会向该卡扣取118.80元</p>:null}
                        {this.state.payCreditState==3?<p>点击【确认绑卡】后，银行会向该卡扣取0.00元至10.00元随机金额进行验证，
                            扣款成功后该笔验证钱款会存入您的今借到账户余额中，不会对您的资金造成影响</p>:null}
                    </Side>
                </div>
               

                <div className='common-btn_box'>
                    {this.state.payCreditState==3 && this.state.payButton?<Tap className='c-black span font16 active' onTap={this.onSubmit}>确认绑卡</Tap>:null}
                    {this.state.payCreditState==3 && !this.state.payButton?<Tap className='c-black span font16'>确认绑卡</Tap>:null}  
                    
                    {this.state.payCreditState==0 && this.state.payButton?<Tap className='c-black span font16 active' onTap={this.onSubmit}>支付认证费¥9.90</Tap>:null}
                    {this.state.payCreditState==0 && !this.state.payButton?<Tap className='c-black span font16'>支付认证费¥9.90</Tap>:null}

                    {this.state.payCreditState==1&& this.state.payButton?<Tap className='c-black span font16 active' onTap={this.onSubmit}>支付认证费¥118.80</Tap>:null}
                    {this.state.payCreditState==1&& !this.state.payButton?<Tap className='c-black span font16'>支付认证费¥118.80</Tap>:null}
                </div>
            </div>
        )
    }
}

export default createForm()(App);
