
import './index.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { InputItem, List } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Tap,NetValid } from 'COMPONENT'
import { Loading, Modal, util } from 'SERVICE'

@withRouter
@inject('userStore')
@observer
class Page extends Component {
    static defaultProps = {
        length: 6,
        type: 'number',
        visible: false,
    }
    constructor(props) {
        document.title = '验证码'
        super(props);
        let query = this.props.match.params;
        if(query.type==0){
            document.title = '登录'
        }
        const { userStore } = this.props;
        this.state = {
            type: query.type,
            values: '',//存储值
            queryTel: userStore.userInfo.telephone || null,//参数获取手机号
            interval: '',	// 获取验证码的定时器
            ntipsLeft: 60,//重新发送验证码秒数
            running: false,//验证码提示信息
            isSubmit:false,//是否可以提交登录
            captchaShow: false,//图片验证码输入框隐藏
            next: false,//网易云验证成功?
        };
    }

    componentDidMount() {
    }

    onNetValid=(ret)=>{
        const _this = this;
        //获取验证码类型 4.注册 1.修改手机号 2.修改交易密码 3.重置密码 4.短信验证码登录
        let telCodeType = 4;
        if(_this.state.type==0){
            telCodeType = 4;
        }else if(_this.state.type==1){
            telCodeType = 3;
        }else if(_this.state.type==2){
            telCodeType = 2;
        }else if(_this.state.type==3){
            telCodeType = 1;
        }
        if(_this.state.voice){
            Loading.show()
            //语音验证码
            $.ajaxE({
                type: 'POST',
                url: '/user/info/getVoiceCode',
                data: {
                    validate:ret,
                    //手机号
                    telephone: _this.state.queryTel||_this.state.telephone,
                }
            }).then((data) => {
                // 验证码成功
                // 定时器开启
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
                    validate:ret,
                    telephone: _this.state.queryTel || _this.state.telephone,
                    telCodeType
                }
            }).then((data) => {
                // 验证码成功
                // 定时器开启
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
        }
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
    //输入验证码并提交
    onSetVal = (e) => {
        let _this = this,value = e.target.value;//e.keyCode - 48;
        let { values } = this.state;
        let { length } = this.props;
        values = value;
        this.setState({
            values
        })
        if (values.length == length) {
            setTimeout(() => {
                // 校验验证码是否正确
                _this.vCode(values);
            }, 200)
        }
    }

    //验证 验证码
    vCode = (value)=>{
        const _this = this;
        const { type, queryTel } = _this.state;
        Loading.show()
        $.ajaxE({
            type: 'POST',
            url: '/user/passport/registerTempUser',
            data: {
                'mobileCode': value, // 校验码
                'telephone': queryTel || _this.state.telephone
            }
        }).then((data) => {
            if(type==0){
                //登录
                if(data && data.token){
                    _this.props.history.push({
                        pathname: '/user/regist',
                        state: {
                            phoneNum: _this.state.telephone,
                            code:data.token
                        }
                    });
                }else{
                    _this.submitLogin(value);
                }
                
            }else if(type==1){
                //修改登录密码
                _this.props.history.push({
                    pathname: '/user/reset_pwd',
                    state: {
                        vCode: value
                    }
                });

            }else if(type==2){
                //修改交易密码       如果有pathname，则返回路由为传入路由
                _this.props.history.push({
                    pathname: '/user/input_valid2',
                    query: {
                        pathname: this.props.location.query.pathname?this.props.location.query.pathname:'/setting/phone_code',
                        mobileCode:value,
                    }
                });
            }
        }).catch((msg) => {
            this.clearValues()
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide()
            _this.setState({
                values: ''
            })
        })
    }

    // 提交的登录
    submitLogin = (value)=>{
        let _this = this;
        //用户第一次关联微信 传递用户图像 给 后台
        let headUrl = '';
        if($.getUserInfo()){
            headUrl = $.getUserInfo().headimgurl;
        }
        $.ajaxE({
            type: 'POST',
            url: '/user/passport/loginByTelCode',
            data: {
                'head':headUrl?headUrl:'',
                'mobileCode': value, // 校验码
                'telephone': _this.state.queryTel||_this.state.telephone,	//手机号
                'openId':$.getUserOpenId(),
                'unionId':''
            }
        }).then((data) => {
            $.setUserInfo(data);
            _this.props.history.push({
                pathname: '/'
            });
        }).catch((msg) => {
            this.clearValues()
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }

    //发送验证码
    onSendValid = () => {
        this.setState({
            next: false,
            captchaShow:true,
            voice: false,//用户发送短信验证码
        })
    }


    // 获取语音验证码
    getVoiceCode = () => {
        this.setState({
            next: false,
            captchaShow:true,
            voice: true,//用户发送语音验证码
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
    // 检测手机号输入框
    onPhoneChange = (v) => {
        if (/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(v)) {
            //键盘收回
            this.loginInput.inputRef.inputRef.blur()
            // 图片验证显示
            this.setState({
                captchaShow: true,
                telephone: v
            })
        } else {
            this.setState({
                captchaShow: false
            })
        }
    }
    render() {
        const { getFieldProps, getFieldError, getFieldValue } = this.props.form;

        let { values, next, queryTel, telephone } = this.state,
            _type = this.state.type,
            { className, length, type } = this.props,
            inputs = [];
        for (let i = 0; i < length; i++) {
            inputs.push(i)
        }

        let _telephone = queryTel?queryTel:telephone;
        return (
            <div className='view-wy-code'>
                {next?
                <div className='view-next-code'>
                    {_type==0?
                        <div className="hello">
                            您正在登录今借到
                        </div>:_type==1?
                        <div className="hello">
                            您正在重置登录密码
                        </div>
                        :_type==2?
                        <div className="hello">
                            您正在修改交易密码
                        </div>
                        :_type==3?
                        <div className="hello">
                            您正在修改手机号
                        </div>
                    :null}
                    <h4 className="al-send pt57">已发送验证码到</h4>
                    <h4 className="al-send num-font">{_telephone.substr(0,3)}&nbsp;&nbsp;{_telephone.substr(3,4)}&nbsp;&nbsp;{_telephone.substr(7,4)}</h4>
                    <div className={className ? className + ' common-inputvalid' : 'common-inputvalid'}>
                        {inputs.map((ele, index) => {
                            return<input key={'valid' + index} className='num-font' onFocus={()=>{this.hiddenInput.focus()}} className={values.length>index?"active":values.length==index?"active caret":null}
                            type={type ? type : 'number'} value={values[index] || ''}/>
                        })}                        
                    </div>
                    <input type={type ? type : 'number'} onChange={(e) => { this.onSetVal(e) }} ref={el=>this.hiddenInput=el} className='hidden-input' value={values}/>
                    <Tap onTap={() => { !this.state.running&&this.onSendValid() }}>
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
                    {_type==0?<span>
                        <div className="hello">
                            您好，
                        </div>
                        <div className="wel">
                            欢迎来到今借到
                            <Link to='/user/login_pwd'>
                                <span className="txt-tip">密码登录</span>
                            </Link>
                        </div>
                    </span>:_type==1?
                        <div className="wel">
                            您正在重置登录密码
                        </div>
                        :_type==2?
                        <div className="wel">
                            您正在修改交易密码
                        </div>
                        :_type==3?
                        <div className="wel">
                            您正在修改手机号
                        </div>
                    :null}
                    <List className="list">
                        <div>
                            <InputItem
                                type={_type==1||_type==2?"text":"digit"} className="login_input"
                                placeholder="请输入手机号"
                                clear
                                editable = {_type==1||_type==2?false:true}
                                // defaultValue={this.state.telephone}
                                {...getFieldProps('phoneNum', {
                                    ref:el => this.loginInput = el,
                                    initialValue: _telephone,
                                    onChange: (v)=>{this.onPhoneChange(v)},
                                    rules: [
                                        { required: true, message: '请输入手机号' },
                                        { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确手机号码' },
                                    ],
                                    validateTrigger:'onBlur'
                                })}>
                            </InputItem>
                            <div className='common-jc-error'>{(_type==1||_type==2)&&getFieldError('phoneNum') && getFieldValue('phoneNum').length==11 && getFieldError('phoneNum').join(',')}</div>
                        </div>
                        {_type==0?<div className="in-tip">
                            未注册手机号验证后设置密码
                        </div>:null}
                    </List>
                </div>}
                <NetValid show={this.state.captchaShow} onNetValid={ this.onNetValid } />
            </div>
        );
    }
}

export default createForm()(Page)