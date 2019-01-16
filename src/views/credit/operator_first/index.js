
//认证 => 运营商认证 
import '../credit.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Picker, List, InputItem,Flex } from 'antd-mobile'
import { Loading, Modal } from 'SERVICE'
import { createForm } from 'rc-form'
import { Tap,Side } from 'COMPONENT'

@withRouter
@inject('userStore')
@observer
class Page extends Component {
    constructor(props, context) {
        document.title = "运营商信息";
        super(props, context)
        this.state = {
            // getedUserInfo: $.getUserInfo(), //用户信息
            isPopupShow: false, // 闪烁弹窗
            curPassword: "", // 当前密码
            phoneList:[],    //所有手机号
            currentPhoneNum:'',  //当前选中的手机号
        };
    };

    componentDidMount() {
        this.handleCheckCredit();
        this.getUserBindTel();
    }
    
    // 调用 校验用户信用接口
    handleCheckCredit=()=>{
        Loading.show();
        let that=this;
        $.ajaxE({
            type: 'GET',
            url: '/credit/user/getCreditSwitch',
            data:{}
        }).then((data)=>{
            if(data.face_verify_status=='0' || data.face_verify_status==0){
                Modal.alertX('提醒', '人脸对比未通过，请重新尝试', [
                    {
                        text: '重新尝试', onPress: () => {
                            that.faceVerify();
                        }
                    }
                ])
            }else if(data.baseInfo_credit_status==0){
                Modal.alertX('提醒', '基础信息尚未填写，请先填写基础信息', [
                    {
                        text: '回去填写', onPress: () => {
                            this.props.history.push({
                                pathname: "/credit/base",
                            })
                        }
                    }
                ])
            } 
        }).catch((msg)=>{
            console.log(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }

    // 获取用户绑定手机号
    getUserBindTel=()=>{
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/user/info/getUserBindBankTel',
            data: {}
        }).then((data) => {
            // 选择器数据格式
            let phoneList = data.map(function (item) {
                return {
                    value: item,
                    label: item,
                }
            });
            this.setState({
                phoneList
            });
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }

    // 选择器改变手机号
    changePhoneNumber=(value)=>{
        this.setState({
            currentPhoneNum: value[0]
        });
    }

    //获取状态
    queryMobileInterval=()=>{
        let _this = this;
        
        // 200;//验证成功，正在抓取
        // 201;//操作失败  
        // 2501;// 继续查询
        // 2502;// 通道不支持
        // 2503;//等待输入短信验证码
        // 2504;//等待输入图片验证码
        // 2505;//等待输入短信验证码和图片验证码
        let queryGrabStatus = ()=>{
            $.ajaxEX({
                type: 'POST',
                url: '/credit/accredit/queryGrabStatus',
                data: {
                    content_type: "yys",
                }
            }).then((json) => {    
                switch (json.status) {
                    case 200:{
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.userStore.getUserCreditInfo();
                        //处理跳转
                        let pathname_back=localStorage.getItem('credit_back_pathname');
                        localStorage.removeItem('credit_back_pathname');
                        //表单页面跳转处理
                        let pathname_back_from=sessionStorage.getItem('mobile_back_pathname');
                        sessionStorage.setItem('mobile_back_pathname',"");
                        if(pathname_back){
                            _this.props.history.push({
                                pathname: pathname_back,
                            })
                        }else if(pathname_back_from){
                            _this.props.history.push({
                                pathname: pathname_back_from,
                            })
                        }else{
                            _this.props.history.push({
                                pathname: "/credit",
                            })
                        }
                        break;
                    }
                    case 201:{
                        _this.setState({
                            isPopupShow: false
                        });
                        Modal.alertX('提醒', json.msg, [
                            {
                                text: '再试试', onPress: () => {
                                }
                            }]
                        )
                        break;
                    }
                    //继续轮询
                    case 2501:{
                        setTimeout(_this.queryMobileInterval, 3000);
                        break;
                    }
                    //通道不支持
                    case 2502:{
                        _this.setState({
                            isPopupShow: false
                        });
                        Modal.alertX('提醒', "由于您所在地区的运营商临时下线 ，您可以跳过运营商认证，还可以通过认证其他信息，获得更多权益。", [
                            {
                                text: '再试试', onPress: () => {
                                }
                            },
                            { 
                                text: '跳过运营商认证', onPress: () => {

                                    $.ajaxE( {
                                        type: 'POST',
                                        url: '/user/creditFee/skipMobileAuth',
                                        data: {
                                            telephone: _this.state.currentPhoneNum
                                        },
                                    }).then((json) => {
                                            _this.props.history.push({
                                                pathname: "/credit",
                                            });
                                    }).catch((msg) => {
                                        Modal.infoX(msg);
                                    });                                
                                }
                            }                        
                        ]);                        
                        break;
                    }
                    //等待输入短信验证码                
                    case 2503:{
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: '/credit/operator_second',
                            query: {
                                creditPhoneNo: _this.state.currentPhoneNum,
                            }
                        });
                        break;
                    }
                    //等待输入图片验证码
                    case 2504:{
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: '/credit/operator_third',
                            query: {
                                creditPhoneNo: _this.state.currentPhoneNum,
                                codeBase64: json.data,
                            }
                        });
                        break;
                    }
                    //等待输入短信验证码和图片验证码
                    case 2505:{
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: '/credit/operator_four',
                            query: {
                                creditPhoneNo: _this.state.currentPhoneNum,
                                codeBase64: json.data,
                            }
                        });
                        break;
                    }
                    
                }
    
            }).catch((msg) => {
            });
        }

        queryGrabStatus();
        
    }

    //同意授权
    onSubmit =()=>{
        let that=this;
        that.props.form.validateFields((error, values) => {
            if(!error){
                that.submitCreditParams(values);
            }
        });        
    }
    submitCreditParams=(values)=>{
        let that=this;
        Loading.show();
        $.ajaxE({
            type: 'POST',
            url: '/credit/accredit/submitLoginParams',
            data: {
                content_type:"yys",
                loginMobileParams:{
                    "phone": that.state.currentPhoneNum, /* 运营商用户名 */
                    "password": values.curPassword, /* 运营商登录密码 */
                }
            },
        }).then((json) => {
            that.setState({
                isPopupShow: true,
            });
            setTimeout(that.queryMobileInterval, 3000); //定时调用querymobile接口,3秒一次
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }

    //人脸识别
    faceVerify=()=>{
        $.ajaxE({
            type: 'GET',
            url: '/credit/faceVerify/getToken',
            data:{}
        }).then((data)=>{
            if(data!=null){
                if(data.token!=null){
                    window.location.href='https://api.megvii.com/faceid/lite/do?token='+data.token
                }
                if(data.ocrParam!=null){
                    window.location.href=data.ocrParam;
                }
            }
        }).catch((msg)=>{
            console.error(msg);
        })      
    }

    render() {

        const { getFieldProps, getFieldError } = this.props.form;
        return (
            <div className='view-credit-all'>
                <div style={{height: '100%',overflow:'auto',paddingBottom: '0.2rem'}}>
                    <Flex justify="center" className="step_bar">
                        <img src={'/imgs/credit/sel-operator.svg'} />
                    </Flex>

                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">绑卡手机号</span>
                    </Flex>

                    <List className="form-list">
                        <Picker 
                            data={this.state.phoneList} 
                            cols={1} 
                            extra={"请选择"}
                            onOk={this.changePhoneNumber}
                            {...getFieldProps('currentPhoneNum', {
                                initialValue: this.state.currentPhoneNum,
                                rules: [{ required: true, message: '请选择手机号' }],
                            })}>
                            <List.Item arrow="horizontal"></List.Item>
                        </Picker>
                        <div className='common-jc-error'>{getFieldError('currentPhoneNum') && getFieldError('currentPhoneNum').join(',')}</div>
                    </List>
                    
                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">服务密码</span>
                    </Flex>
                    <List className="form-list">
                        <InputItem
                            type="password"
                            placeholder="请输入您的服务密码"
                            clear
                            {...getFieldProps('curPassword', {
                                initialValue: this.state.curPassword,
                                rules: [{ required: true, message: '请输入服务密码' }],
                                validateTrigger:'onBlur'
                            })} >
                        </InputItem>
                        <div className='common-jc-error'>{getFieldError('curPassword') && getFieldError('curPassword').join(',')}</div>
                    </List>

                    <Side>
                        <p>点击同意授权代表您同意以下内容:</p>
                        <p>授权北京人人信科技有限公司获取以下信息包括但不限于姓名、身份证号、手机号码、通话记录，用于生成个人信用报告；</p>
                        <p>你的好友可查看你的手机号码使用时长、互通联系人数量、通话次数、通话时长以及短信条数、话费缴纳情况，以便甄别出借风险；</p>
                        <p>当你发生违约或其他影响信用的不良行为时，北京人人信科技有限公司有权利用相关信息向你的联系人发送提醒消息，如有需要还会向有关部门提供可能联系到你的电话号码、地址等信息，用于追究违约责任。</p>
                    </Side>

                    <div className="link_div">
                        <Link to="/credit/operator_help2">我的客服</Link><span className="link_line"></span>
                        <Link to="/credit/operator_help1">常见问题</Link>
                    </div>
                </div>
                
                <div className='common-btn_box'>
                    <Tap className='c-black span font16 active' onTap={this.onSubmit}>同意授权</Tap>
                </div>

                <div className="backdrop" hidden={!this.state.isPopupShow}>
                    <div className="waiting slide-bottom-transition">
                        <img src={'/imgs/pay/wait.svg'} />
                        <div className="title_op">正在验证，请不要离开</div>
                        <div className="box_op">今借到平台自身不放款，只提供信息服务<br />您需要把自己的借款信息分享给他人知道</div>
                    </div>
                </div>              
            </div>
        )
    }
}


export default createForm()(Page);
