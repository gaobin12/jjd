
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tap } from 'COMPONENT'
import { Modal, Loading } from 'SERVICE'

export default class InputValid extends React.Component {
    static defaultProps = {
        length: 6,
        type: 'password',
        visible: false,
    }
    static propTypes = {
        className: React.PropTypes.string,
        length: React.PropTypes.number,//长度
        type: React.PropTypes.string,//类型
    }
    constructor(props) {
        document.title = '验证码'
        super(props);
        let { state } = this.props.location;
        this.state = {
            values: '',//存储值
            telephone: state.phoneNum,
            interval: '',	// 获取验证码的定时器
            ntipsLeft: 60,//重新获取验证码秒数
            tips: '重新发送短信验证码（60）',//验证码提示信息
            enableVoice: false,	// 是否允许用户点击获取验证码按钮
            color: '#838791',//点击字的颜色
            isSubmit:false,//是否可以提交登录
        };
    }

    componentDidMount() {
        // 定时器开启
        this.setState({
            interval: window.setInterval(this.getVoiceTips, 1000)
        })
      
    }
    
    // 验证码定时器
    getVoiceTips = () => {
        if (this.state.ntipsLeft > 0) {
            this.setState({
                color: '#838791',
                tips: "重新发送短信验证码（" + this.state.ntipsLeft + '）',
            })
            this.state.ntipsLeft--;
            return;
        }
        window.clearInterval(this.state.interval);
        this.setState({
            tips: "重新发送短信验证码",
            enableVoice: 'true',
            color: '#FF9900',
        })


    }
    //提交表单
    onSetVal = (value) => {
        let _this = this;
        let { values } = this.state;
        let { length, onEnd, location } = this.props;
        values += value;

        this.setState({
            values
        })
        setTimeout(() => {
            if (values.length == length) {
                _this.CheckPhoneNUm(values);
                //清空            
                _this.setState({
                    values: ''
                })
            }
        }, 200)
    }

    //验证 验证码
    vCode = (value)=>{
        let _this = this
        $.ajaxE({
            type: 'POST',
            url: '/user/info/checkSMSCode',
            data: {
                'mobileCode': value, // 校验码
                'telephone':_this.state.telephone,
                'openId':$.getUserOpenId(),
            }
        }).then((data) => {            
            _this.CheckPhoneNUm(value);
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }

    // 校验手机号时候注册过
    CheckPhoneNUm = (code)=>{
        const _this = this;
        $.ajaxE({
            type: 'GET',
            url: '/user/passport/checkTelephoneIsRegister',
            data: {
                "telephone": _this.state.telephone,	//手机号
            }
        }).then((data) => {
            if (data){
                _this.submitLogin(code);
            }else{
                _this.props.history.push({
                    pathname: '/user/regist',
                    state: {
                        phoneNum: _this.state.telephone,
                        code
                    }
                });
            }
        }).catch((msg) => {
            Modal.infoX(msg);
        })
    }

    // 提交的登录
    submitLogin = (value)=>{
        let _this = this
        $.ajaxE({
            type: 'POST',
            url: '/user/passport/loginByTelCode',
            data: {
                'mobileCode': value, // 校验码
                'telephone': _this.state.telephone,	//手机号
                'openId':$.getUserOpenId(),
                'unionId':''
            }
        }).then((data) => {            
            $.setUserInfo(data);
            sessionStorage.setItem('token', data.token);
            _this.props.history.push({
                pathname: '/',
                state: {
                    telephone: _this.state.telephone
                }
            });
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }

    onDeltVal = (type) => {
        let { values } = this.state;
        if (values == '') return
        if (type == 'all') {
            values = ''
        } else {
            values = values.substr(0, values.length - 1)
        }
        this.setState({ values })
    }
    //发送验证码
    onSendValid = () => {
        let that = this
        if (!this.state.enableVoice) {
            return;
        }

        //发送验证码
        $.ajaxE({
            type: 'GET',
            url: '/user/info/getTelCode',
            data: {
                telephone: this.state.telephone,
                telCodeType: 0
            }
        }).then((data) => {
            Modal.infoX('请输入您的注册手机号收到的短信验证码');
            this.setState({
                enableVoice: false,
                ntipsLeft: 60,
                interval: window.setInterval(that.getVoiceTips, 1000)
            })

        }).catch((msg) => {
            Modal.infoX(msg);
        })
    }


    // 获取语音验证码
    getVoiceCode = () => {
        if (this.state.enableVoice) {
            //提交
            $.ajaxE({
                type: 'GET',
                url: '/user/info/getVoiceCode',
                data: {
                    //手机号
                    telephone: this.state.telephone,
                }
            }).then((data) => {
                Modal.infoX('获取语音验证码成功');
            }).catch((msg) => {
                Modal.infoX(msg);
            })
        }

    }
    // 销毁
    componentWillUnmount() {
        window.clearInterval(this.state.interval);
    }

    render() {
        let { values } = this.state,
            { className, length, type } = this.props,
            inputs = [];
        for (let i = 0; i < length; i++) {
            inputs.push(i)
        }
        return (
            <div className='view-input-valid-code'>
                <div className="login-jjd">
                    您正在登录今借到
                </div>
                <h4 className="al-send pt57">已发送验证码到</h4>
                <h4 className="al-send">{this.state.telephone}</h4>


                <div className={className ? className + ' common-inputvalid' : 'common-inputvalid'}>
                    {inputs.map((ele, index) => {
                        return <input readOnly ref={'input' + index} type={type && values[index] ? type : 'number'} value={values[index] || ''}
                            key={'valid' + index} />
                    })}
                </div>
                {
                    this.state.tips == '重新发送短信验证码' ?
                        <Tap onTap={() => { this.onSendValid() }}>
                            <div className="re-send" style={{ color: this.state.color }}>
                                {this.state.tips}
                            </div>
                        </Tap>
                        :
                        <div className="re-send" style={{ color: this.state.color }}>
                            {this.state.tips}
                        </div>
                }
                {this.state.enableVoice?<Tap onTap={() => { this.getVoiceCode() }}>
                    <h4 className="al-send yuyinCode">发送语音验证码</h4>
                </Tap>:null}

                <div className='input-board'>
                    <Tap onTap={() => { this.onSetVal(1) }}>1</Tap>
                    <Tap onTap={() => { this.onSetVal(2) }}>2</Tap>
                    <Tap onTap={() => { this.onSetVal(3) }}>3</Tap>
                    <Tap onTap={() => { this.onSetVal(4) }}>4</Tap>
                    <Tap onTap={() => { this.onSetVal(5) }}>5</Tap>
                    <Tap onTap={() => { this.onSetVal(6) }}>6</Tap>
                    <Tap onTap={() => { this.onSetVal(7) }}>7</Tap>
                    <Tap onTap={() => { this.onSetVal(8) }}>8</Tap>
                    <Tap onTap={() => { this.onSetVal(9) }}>9</Tap>
                    <Tap onTap={() => { this.onDeltVal('all') }}>
                        <img src={'/imgs/com/rev-num_del.png'} />
                    </Tap>
                    <Tap onTap={() => { this.onSetVal(0) }}>0</Tap>
                    <Tap onTap={() => { this.onDeltVal('one') }}>
                        <img src={'/imgs/com/rev-num_cha.png'} />
                    </Tap>
                </div>
            </div>
        );
    }
}