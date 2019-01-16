
import './index.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { List } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Tap,InputComt,NetValid } from 'COMPONENT'
import { Modal, Loading, rules } from 'SERVICE'

@withRouter
@inject('userStore')
@observer
class Page extends Component {
    constructor(props) {
        document.title = '验证码'
        super(props);
        this.state = {
            values: '',//存储值
            telephone: '',
            interval: '',	// 获取验证码的定时器
            ntipsLeft: 60,//重新获取验证码秒数
            tips: '重新发送（60）',//验证码提示信息
            enableVoice: false,	// 是否获取语音验证码
            color: '#838791',//点击字的颜色
            captchaShow: false,
            next: false,//网易云验证成功?
        };
    }

    componentDidMount() {
    }

    //网易云顿验证通过
    onNetValid=(ret)=>{
        Loading.show();
        if(this.state.enableVoice){
            $.ajaxE({
                type: 'POST',
                url: '/user/info/getVoiceCode',
                data: {
                    //手机号
                    telephone: this.state.telephone,
                    validate:ret,
                }
            }).then((data) => {
                _this.setState({
                    next: true
                })
            }).catch((msg) => {
                Modal.infoX(msg);
            }).finally(()=>{
                Loading.hide();
            })
        }else{
            $.ajaxE({
                type: 'POST',
                url: '/user/info/getTelCode',
                data: {
                    validate:ret,
                    telephone: this.state.telephone,
                    telCodeType:1
                }
            }).then((data) => {
                // 验证码成功
                // 定时器开启
                this.setState({
                    next: true,
                    interval: window.setInterval(this.getVoiceTips, 1000)
                })
            }).catch((msg) => {
                Modal.infoX(msg);
            }).finally(()=>{
                Loading.hide();
            })
        }
        
    }

    NECaptcha=()=>{
        const _this = this;
        //网易云顿
        $.NECaptcha((ret) => {
            //获取验证码类型 4.注册 1.修改手机号 2.修改交易密码 3.重置密码 4.短信验证码登录
            //发送验证码
            $.ajaxE({
                type: 'POST',
                url: '/user/info/getTelCode',
                data: {
                    validate:ret,
                    telephone: _this.state.telephone,
                    telCodeType:1
                }
            }).then((data) => {
                // 验证码成功
                // 定时器开启
                _this.setState({
                    next: true,
                    interval: window.setInterval(this.getVoiceTips, 1000)
                })
            }).catch((msg) => {
                Modal.infoX(msg,()=>{
                    _this.NECaptcha();
                });
            })
        }, (err) => {
            Modal.infoX(err,()=>{
                _this.NECaptcha();
            });
        })
    }

    //发送语音验证码
    NECaptchaVode=()=>{
        const _this = this;
        //网易云顿
        $.NECaptcha((ret) => {
            // 验证码成功
            //提交
            $.ajaxE({
                type: 'POST',
                url: '/user/info/getVoiceCode',
                data: {
                    //手机号
                    telephone: this.state.telephone,
                    validate:ret,
                }
            }).then((data) => {
                _this.setState({
                    next: true
                })
            }).catch((msg) => {
                Modal.infoX(msg,()=>{
                    _this.NECaptchaVode();
                });
            })
        }, (err) => {
            Modal.infoX(err,()=>{
                _this.NECaptchaVode();
            });
        }) 
    }
    
    // 验证码定时器
    getVoiceTips = () => {
        if (this.state.ntipsLeft > 0) {
            this.setState({
                color: '#838791',
                tips: "重新发送（" + this.state.ntipsLeft + '）',
            })
            this.state.ntipsLeft--;
            return;
        }
        window.clearInterval(this.state.interval);
        this.setState({
            tips: "重新发送",
            enableVoice: true,
            color: '#FF9900',
        })
    }
    //提交表单
    onSetVal = (value) => {
        let _this = this;
        let { values } = this.state;
        let { length } = this.props;
        values += value;

        this.setState({
            values
        })
        setTimeout(() => {
            if (values.length == length) {
                // 校验验证码是否正确
                _this.vCode(values);
            }
        }, 200)
    }

    //验证 验证码
    vCode = (value)=>{
        const _this = this;
        const { type } = _this.state;
        $.ajaxE({
            type: 'POST',
            url: '/user/info/modifyTel',
            data: {
                'mobileCode': value, // 校验码
                'telephone':  _this.state.telephone
            }
        }).then((data) => {
            Modal.infoX('修改手机号成功!',()=>{
                _this.props.userStore.setUserInfo({
                    telephone:_this.state.telephone
                })
                _this.props.history.push({
                    pathname: '/setting'
                });
            })
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
            _this.setState({
                values: ''
            })
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

    //发送短信验证码
    onSendValid = () => {    
        this.setState({
            next: false,
            captchaShow:false,
            enableVoice:false
        })
    }


    //发送语音验证码
    getVoiceCode = () => {
        this.setState({
            next: false,
            captchaShow:false,
            enableVoice:true
        })
    }
    // 销毁
    componentWillUnmount() {
        window.clearInterval(this.state.interval);
    }

    render() {
        const { getFieldProps, getFieldError, getFieldValue } = this.props.form;

        let { values, next } = this.state,
            { className, length, type } = this.props,
            inputs = [];
        for (let i = 0; i < length; i++) {
            inputs.push(i)
        }
        return (
            <div className='view-wy-code-phone'>
                {next?
                <div className='view-next-codes'>
                    <h4 className="al-send pt57">已发送验证码到</h4>
                    <h4 className="al-send">{this.state.telephone}</h4>
                    <div className={className ? className + ' common-inputvalid' : 'common-inputvalid'}>
                        {inputs.map((ele, index) => {
                            return <input readOnly ref={'input' + index} type={type && values[index] ? type : 'number'} value={values[index] || ''}
                                key={'valid' + index} />
                        })}
                    </div>
                    {this.state.tips == '重新发送' ?
                        <Tap onTap={() => { this.onSendValid() }}>
                            <div className="re-send" style={{ color: this.state.color }}>
                                {this.state.tips}
                            </div>
                        </Tap>
                        :<div className="re-send" style={{ color: this.state.color }}>
                            {this.state.tips}
                        </div>}
                    {this.state.tips == '重新发送' ?
                        <Tap onTap={() => { this.getVoiceCode() }}>
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
                </div>:
                <div className="view-phone-change">
                    <div className="wel reset-psd">
                        请输入新手机号
                    </div>
                    <List className="list yz-code">
                        <InputComt
                            type="digit" 
                            className="login_input"
                            placeholder="请输入手机号"
                            errorText={getFieldError('phone')}
                            {...getFieldProps('phone', {
                                ref: el => this.mobileInput = el,
                                rules: [
                                    { required: true, message: '请输入11位手机号码' },
                                    rules.tel
                                ],
                                validateTrigger:'onBlur'
                            })}>            
                        </InputComt>                        
                    </List>
                </div>}
                <NetValid show={this.state.captchaShow} onNetValid={ this.onNetValid } />
            </div>
        );
    }
}

export default createForm()(Page)