import './index.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { InputItem, List } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Tap, InputComt, NetValid, Button } from 'COMPONENT'
import { Modal, Loading } from 'SERVICE'

@withRouter
@inject('userStore')
@observer
class Page extends Component {

    constructor(props) {
        document.title = '验证码'
        super(props);
        this.state = {
            type: 0,
            values: '',//存储值
            interval: '',	// 获取验证码的定时器
            ntipsLeft: 60,//重新发送验证码秒数
            running: false,//验证码提示信息
            next: false,//网易云验证成功?
            inputs:[0,1,2,3,4,5]
        };
    }

    componentDidMount() {
    }

    // 检测手机号输入框
    onPhoneChange = (v) => {
        if (/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(v)) {
            //键盘收回
            this.loginInput.inputRef.inputRef.blur()
            // 图片验证显示
            this.props.userStore.setLoginForm({
                captchaShow:true,
                telephone: v
            })
        }else {
            this.props.userStore.setLoginForm({
                captchaShow:false
            })
        }
    }

    onNetValid=(v)=>{
        let _this = this;
        const { userStore,userStore:{loginForm} } = this.props;
        if(_this.state.voice){
            Loading.show()
            //语音验证码
            $.ajaxE({
                type: 'POST',
                url: '/user/info/getVoiceCode',
                data: {
                    validate:v,
                    //手机号
                    telephone: loginForm.telephone,
                }
            }).then((data) => {
                // 验证码成功
                // 定时器开启
                userStore.setLoginForm({
                    captchaShow:false,
                })
                _this.setState({
                    next: true,
                    running: true,
                    interval: window.setInterval(this.getVoiceTips, 1000)
                },()=>{
                    //键盘弹出
                    _this.hiddenInput.focus()
                })
            }).catch((msg) => {
                Modal.infoX(msg);
            }).finally((msg)=>{
                Loading.hide()
            })
        }else{
            Loading.show()
            //发送短信验证码
            $.ajaxE({
                type: 'POST',
                url: '/user/info/getTelCode',
                data: {
                    validate:v,
                    telephone: loginForm.telephone,
                    telCodeType:4
                }
            }).then((data) => {
                userStore.setLoginForm({
                    captchaShow:false,
                })
                // 定时器开启
                _this.setState({
                    next: true,
                    running: true,
                    interval: window.setInterval(_this.getVoiceTips, 1000)
                })
            }).catch((msg) => {
                Modal.infoX(msg);
            }).finally((msg)=>{
                Loading.hide()
            })
        }
    }

    onInputChange=(v,index)=>{        
        let { values } = this.state;
        let vv = v.target.value;
        if(vv.length){
            values += vv;        
            if(index == 5){
                this.isUserRegist(values);
            }else{
                v.target.nextSibling.focus();
                this.setState({
                    values
                });
            }
        }else{
            values = values.substr(0,values.length);
            if(index==0){
                this.setState({
                    values
                });
            }else{
                v.target.previousSibling.focus();
                this.setState({
                    values
                });
            }
        }
    }

    //验证 判断用户是否已注册 如已注册就登录
    isUserRegist = (value)=>{
        const _this = this;
        const { userStore,userStore:{loginForm} } = this.props;
        Loading.show()
        $.ajaxE({
            type: 'POST',
            url: '/user/passport/registerTempUser',
            data: {
                mobileCode: value, // 校验码
                telephone: loginForm.telephone
            }
        }).then((data) => {
            //登录
            if(data && data.token){
                userStore.setLoginForm({
                    tokenCode:data.token
                })
                _this.props.history.push({
                    pathname: '/user/regist'
                });
            }else{
                _this.submitLogin(value);
            }
        }).catch((msg) => {            
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide()
            this.clearValues()
        })
    }

    // 提交的登录
    submitLogin = (value)=>{
        //用户第一次关联微信 传递用户图像 给 后台
        const _this = this;
        const { userStore,userStore:{userInfo,loginForm} } = this.props;
        $.ajaxE({
            type: 'POST',
            url: '/user/passport/loginByTelCode',
            data: {
                head: userInfo.avatarUrl,
                mobileCode: value, // 校验码
                telephone: loginForm.telephone,	//手机号
                openId: userInfo.openId,
                unionId:''
            }
        }).then((data) => {
            userStore.setUserInfo(data,()=>{
                _this.props.history.push('/');
            });
        }).catch((msg) => {
            _this.clearValues()
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }

    //发送验证码
    onSendValid = () => {
        this.setState({
            next: false,
            voice: false,
        })
        this.props.userStore.setLoginForm({
            captchaShow:true
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

    // 获取语音验证码
    getVoiceCode = () => {
        this.setState({
            next: false,
            voice: true,
        })
        this.props.userStore.setLoginForm({
            captchaShow:true
        })
    }
    // 销毁
    componentWillUnmount() {
        window.clearInterval(this.state.interval);
    }

    clearValues=()=>{
        this.setState({
            values: ''
        })
    }
    
    render() {
        const { getFieldProps, getFieldError, getFieldValue } = this.props.form;
        const { userStore:{loginForm} } = this.props;
        const { values, next, inputs } = this.state;
        return (
            <div className='view-wy-code'>
                {next?
                <div className='view-next-code'>
                    <div className="hello">
                        您正在登录今借到
                    </div>
                    <h4 className="al-send pt57">已发送验证码到</h4>
                    <h4 className="al-send num-font">{loginForm.telephone.substr(0,3)}&nbsp;&nbsp;{loginForm.telephone.substr(3,4)}&nbsp;&nbsp;{loginForm.telephone.substr(7,4)}</h4>
                    <div className='common-inputvalid'>
                        {inputs.map((ele, index) => {
                            return <input key={'input' + index} className='num-font' 
                            type='number'
                            style={values.length>=index?{borderBottomColor:'#333'}:null}
                            onChange={(e)=>{this.onInputChange(e,index)}} />
                        })}               
                    </div>
                    <Tap onTap={() => { !this.state.running && this.onSendValid() }}>
                        <div className="re-send" style={this.state.running?{color: '#999'}:{ color: '#ff9900' }}>
                            {this.state.running&&this.state.voice?'重新发送语音验证码'+this.state.ntipsLeft:
                            this.state.running?'重新发送短信验证码'+this.state.ntipsLeft:
                            '重新发送短信验证码'}
                        </div>
                    </Tap>
                    {!this.state.running?<Tap onTap={() => { this.getVoiceCode() }}>
                        <h4 className="al-send yuyinCode">{this.state.voice?'重新发送语音验证码':'发送语音验证码'}</h4>
                    </Tap>:null}
                </div>:
                <div className='view-first-code'>       
                    <span>
                        <div className="hello">
                            您好，
                        </div>
                        <div className="wel">
                            欢迎来到今借到
                            <Link to='/user/login_pwd'>
                                <span className="txt-tip">密码登录</span>
                            </Link>
                        </div>
                    </span>
                    <List className="list">
                        <div>
                            <InputItem
                                type="digit" className="login_input"
                                placeholder="请输入手机号"
                                clear
                                editable = {true}
                                {...getFieldProps('phoneNum', {
                                    ref:el => this.loginInput = el,
                                    onChange: (v)=>{this.onPhoneChange(v)},
                                    rules: [
                                        { required: true, message: '请输入手机号' },
                                        { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确手机号码' },
                                    ],
                                    validateTrigger:'onBlur'
                                })}>
                            </InputItem>
                            <div className='common-jc-error'>{getFieldError('phoneNum') && getFieldValue('phoneNum').length==11 && getFieldError('phoneNum').join(',')}</div>
                        </div>
                    </List>
                    <div className="in-tip">
                        未注册手机号验证后设置密码
                    </div>
                </div>}
                <NetValid show={loginForm.captchaShow} onNetValid={ this.onNetValid } />
            </div>
        );
    }
}
export default createForm()(Page)
