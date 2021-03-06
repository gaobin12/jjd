
import './index.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { InputItem, List, Button,Flex } from 'antd-mobile';
import { createForm } from 'rc-form';
import { Loading, Modal } from 'SERVICE'
import { Tap } from 'COMPONENT'

@withRouter
class Page extends Component {
    constructor(props, context) {
        document.title = "登录";
        super(props, context)
        this.state = {
            type: 'password',//密码框类型
            isPopupShow:false,
            interval: '',	// 获取验证码的定时器
            ntipsLeft: 60,//重新发送验证码秒数
            running: false,//验证码提示信息
            iscode:false //验证码可以输入
        };
    }

    componentDidMount() {  
        this.createTask();
    }
    //支付宝创建任务
    createTask = () => {
        let that = this
        Loading.show();
        $.ajaxE({
            type: 'POST',
            url: '/credit/accredit/alipay/addJob',
            data: {
                process_code: 2700,
            }
        }).then((data) => {
            setTimeout(that.queryMobileInterval, 1000);
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(() => {
            Loading.hide();
        })
    }
    //提交登录表单
    loginSubmit = () => {
        let that = this
        this.props.form.validateFields((error, values) => {            
            if (!error) {
                this.setState({
                    isPopupShow:true
                })
                $.ajaxEX({
                    type: 'POST',
                    url: '/credit/accredit/alipay/publish',
                    data: {
                        process_code:'2703',    
                        process_content:values.code, 
                    }
                }).then((json) => {
                    switch (json.status) {
                        case 2501:
                            setTimeout(that.queryMobileInterval, 1000);
                            break;

                        default:
                            break;
                    }
                }).catch((msg) => { 
                    // Modal.infoX(msg);
                }).finally(() => {
                    Loading.hide();
                }) 
            }
        });
    }

    //发送验证码
    getCode=()=>{

        let values = this.props.form.getFieldsValue();
        if(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(values.photonum)){
            if(this.state.iscode){
                this.getcodevolid(values);
            }else{
                Modal.infoX("当前通道繁忙，请稍后再试");
            }
        }else{
            Modal.infoX("请输入正确的手机号");
        }
    }
    // 获取验证码接口
    getcodevolid=(values)=>{
        this.setState({
            running: true,
            interval: window.setInterval(this.getVoiceTips, 1000)
        })
        $.ajaxEX({
            type: 'POST',
            url: '/credit/accredit/alipay/publish',
            data: {
                process_code:'2702', 
                process_content:values.photonum, 
            }
        }).then((json) => {
            switch (json.status) {
                case 2501:
                    setTimeout(that.queryMobileInterval, 1000);
                    break;

                default:
                    break;
            }
        }).catch((msg) => { 
            // Modal.infoX(msg);
        }).finally(() => {
            Loading.hide();
        }) 
    }
    // 验证码定时器
    getVoiceTips = () => {
        if (this.state.ntipsLeft > 0) {
            this.state.ntipsLeft--;
            this.setState({
                ntipsLeft: this.state.ntipsLeft--
            })
            return;
        }
        window.clearInterval(this.state.interval);
        this.setState({
            ntipsLeft: 60,
            running: false,
        })
    }
    // 销毁
    componentWillUnmount() {
        window.clearInterval(this.state.interval);
    }
    //跳转页面
    gotoPage=()=>{
        this.props.history.push({
            pathname: "/credit/zhifubao_pwd",
        })
    }

    //支付宝轮询获取状态
    queryMobileInterval=()=>{
        let _this = this;
        let queryGrabStatus = ()=>{
            $.ajaxEX({
                type: 'POST',
                url: '/credit/accredit/alipay/poll',
                data: {
                }
            }).then((json) => {    
                switch (json.status) {
                     // 认证流程失败退出 
                    case 201:{
                        _this.setState({
                            isPopupShow: false
                        });
                        Modal.alertX('提醒', json.msg, [
                            {
                                text: '确定', onPress: () => {
                                    history.back()
                                }
                            }]
                        )
                        break;
                    }
                    //继续轮询
                    case 2501:{
                        setTimeout(_this.queryMobileInterval, 1000);
                        break;
                    }
                    //通道不可用 
                    case 2502:{
                        _this.setState({
                            isPopupShow: false
                        });
                        Modal.alertX('提醒', json.msg, [
                            {
                                text: '确定', onPress: () => {
                                    history.back()
                                }
                            }               
                        ])                  
                        break;
                    }
                    // 开始支付宝授权采集任务  
                    case 2700:{
                        _this.setState({
                            isPopupShow: false
                        });
                        break;
                    }
                    //等待业务侧消息传入          
                    case 2701:{
                        _this.setState({
                            isPopupShow: false,
                            iscode:true,
                        });
                        break;
                    }
                    //发送短信验证码请求指令 
                    case 2702:{
                        _this.setState({
                            isPopupShow: false
                        });
                        break;
                    }
                    //短信码已发送到用户手机, 短信验证码登录指令 
                    case 2703:{
                        _this.setState({
                            isPopupShow: false
                        });
                        break;
                    }
                    // 发送账密登录指令 
                    case 2704:{
                        _this.setState({
                            isPopupShow: false
                        });
                        break;
                    }
                    // 姓名增强验证阶段 
                    case 2710:{
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: "/credit/zhifubao_verify2",
                        })
                        break;
                    }
                    // 身份证号增强验证阶段  
                    case 2711:{
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: "/credit/zhifubao_verify3",
                        })
                        break;
                    }
                    // 短信授权码增强验证阶段  
                    case 2712:{
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: "/credit/zhifubao_verify1",
                        })
                        break;
                    }
                    // 银行卡列表增强验证阶段 
                    case 2713:{
                        _this.setState({
                            isPopupShow: false
                        });
                        sessionStorage.setItem('zhifubao', JSON.stringify(json.data))
                        _this.props.history.push({
                            pathname: "/credit/zhifubao_verify5"
                        })
                        break;
                    }
                    //  银行卡信息增强验证阶段   
                    case 2714:{
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: "/credit/zhifubao_verify4",
                        })
                        break;
                    }
                    //  列表类问题增强验证阶段
                    case 2715:{
                        _this.setState({
                            isPopupShow: false
                        });
                        sessionStorage.setItem('zhifubao', JSON.stringify(json.data))
                        _this.props.history.push({
                            pathname: "/credit/zhifubao_verify6"
                        })
                        break;
                    }
                    //  九宫格类问题增强验证阶段  
                    case 2716:{
                        _this.setState({
                            isPopupShow: false
                        });
                        sessionStorage.setItem('zhifubao', JSON.stringify(json.data))
                        _this.props.history.push({
                            pathname: "/credit/zhifubao_verify7"
                        })
                        break;
                    }
                    //  刷脸增强验证阶段   
                    case 2717:{
                        _this.setState({
                            isPopupShow: false
                        });
                        sessionStorage.setItem('zhifubao', JSON.stringify(json.data))
                        _this.props.history.push({
                            pathname: "/credit/zhifubao_face"
                        })
                        break;
                    }
                    // 采集成功, 通知前端跳转   
                    case 2721:{
                        _this.setState({
                            isPopupShow: false
                        });
                        Modal.alertX('提醒', json.msg, [
                            {
                                text: '确定', onPress: () => {
                                    _this.props.history.push({
                                        pathname: "/credit",
                                    })
                                }
                            }               
                        ])  
                        break;
                    }
                    // 上送消息校验错误, 等待重新提交(此时需要重新poll来获取验证方式)  
                    case 2730:{
                        // setTimeout(_this.queryMobileInterval, 1000);
                        _this.setState({
                            isPopupShow: false
                        });
                        Modal.alertX('提醒', json.msg, [
                            {
                                text: '确定', onPress: () => {
                                }
                            }
                        ])   
                        break;
                    }
                    // 任务执行失败 
                    case 2731:{
                        _this.setState({
                            isPopupShow: false
                        });
                        Modal.alertX('提醒', json.msg, [
                            {
                                text: '确定', onPress: () => {
                                    _this.props.history.push({
                                        pathname: "/credit",
                                    })
                                }
                            }               
                        ])    
                        break;
                    }
                    // 任务执行超时 
                    case 2732:{
                        _this.setState({
                            isPopupShow: false
                        });
                        Modal.alertX('提醒', json.msg, [
                            {
                                text: '确定', onPress: () => {
                                    _this.props.history.push({
                                        pathname: "/credit/zhifubao_pwd",
                                    })
                                }
                            }               
                        ])     
                        break;
                    }
                    
                }
    
            }).catch((msg) => {
            });
        }

        queryGrabStatus();
        
    }


    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        return (
            <div className="view-login">
                <div style={{height: '100%',overflow:'auto'}}>
                    <Flex justify="center" className="step_bar">
                        <img src={'/imgs/credit/zhifubao.svg'} />
                    </Flex>

                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">支付宝账号</span>
                    </Flex>

                    <List className="form-list">
                        <InputItem
                            type="text"
                            {...getFieldProps('photonum', {
                                rules: [{ required: true, message: '请输入支付宝绑定的手机号' }],
                                validateTrigger:'onBlur'
                            })}
                            onFocus = {$.clearErrors.bind(this,'photonum')}
                            placeholder="请输入支付宝绑定的手机号"
                            clear
                        ></InputItem>
                        <div className='common-jc-error'>{getFieldError('photonum') && getFieldError('photonum').join(',')}</div>
                    </List>
                    
                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">验证码</span>
                    </Flex>
                    <List className="form-list">
                        <InputItem
                            type="text"
                            onFocus = {$.clearErrors.bind(this,'code')}
                            {...getFieldProps('code', {
                                initialValue: this.state.password,
                                rules: [{ required: true, message: '请输入验证码' }],
                                validateTrigger:'onBlur'
                            })}
                            placeholder="请输入验证码"
                        ></InputItem>
                        <Tap className="zfb_code_font" onTap={() => {!this.state.running&&this.getCode() }}>
                            {this.state.running?this.state.ntipsLeft:'获取验证码'}
                        </Tap>
                        <div className='common-jc-error'>{getFieldError('code') && getFieldError('code').join(',')}</div>
                    </List>
                    <Tap onTap={this.gotoPage} className="gotopage">收不到验证码？试试账密登录</Tap>
                </div>
                
                <div className='common-btn_box'>
                    <Tap className='c-black span font16 active' onTap={this.loginSubmit}>授权登录</Tap>
                </div>
                <div className="popup-box" hidden={!this.state.isPopupShow}>
                    <div className="fade-transition"></div>
                    <div className="mui-slider waiting slide-bottom-transition">
                        <div className="mui-slider-group ">
                            <div className="mui-slider-item hide">
                                <div className="wait_tip">
                                    <div className="title_op">正在验证中 </div>
                                    <div className="time-tip">大概需要 60 秒，请稍作等待</div>
                                </div>
                                <div className="more_op">
                                    <span className="dot_1"></span>
                                    <span className="dot_2"></span>
                                    <span className="dot_3"></span>
                                </div>
                                <div className="tips_op">
                                    <div className="pay_tips_op">
                                        <div>小提示</div>
                                        <div className="box_op">
                                            <div>今借到平台自身不放款，只提供信息服务，您需要把自己的借贷信息分享给他人看到。</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>        
            </div>
        )
    }
}

export default createForm()(Page);
