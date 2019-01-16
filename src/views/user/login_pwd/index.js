import './index.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { List } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Loading, Modal, rules } from 'SERVICE'
import { Tap,InputComt,NetValid,Button } from 'COMPONENT'

@withRouter
@inject('userStore')
@observer
class Page extends Component {
    constructor(props, context) {
        document.title = "登录";
        super(props, context)
        this.state = {
            captchaShow:false,
            type: 'password',//密码框类型
            className: 'icon passw active',//类名
            className2: 'icon passw',
        };
    }

    componentDidMount() {
        //Modal.tip('提示');
    }

    //网易云顿验证通过
    onNetValid=(ret)=>{
        Loading.show();
        let { postData } = this.state;
        $.ajaxE({
            type: 'POST',
            url: '/user/passport/login',
            data: {
                validate:ret,
                telephone: postData.phone,
                pwd: $.md5($.md5(postData.pass)),
                openId:'',
                unionId:''
            }
        }).then((data) => {
            this.props.userStore.setUserInfo(data);
            this.props.history.push('/');
        }).catch((msg) => {
            this.setState({
                captchaShow: false
            })
            Modal.tip(msg);
        }).finally(() => {
            Loading.hide();
        })
    }
    
    //提交登录表单
    onBtn = (data) => {
        this.setState({
            captchaShow:true,
            postData:data
        });
    }

    //密码显示不显示
    eyeShow = () => {
        if (this.state.type == 'password') {
            this.setState({
                className: 'icon passw',
                className2: 'icon passw active',
                type: 'text',
            })
        } else {
            this.setState({
                className: 'icon passw active',
                className2: 'icon passw',
                type: 'password',
            })
        }
    }

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        return (
            <div className="view-login" ref={ref=>this.scrollBox = ref}>
                <div className="view-con">
                    <div className="hello">
                        您好，
                    </div>
                    <div className="wel">
                        欢迎来到今借到<Link to='/user/login'>
                            <span className="txt-tip">手机验证码登录</span>
                        </Link>
                    </div>
                    <List className="list">
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
                                ]
                            })}>            
                        </InputComt>

                        <InputComt
                            type={this.state.type}
                            className="login_input ipt-psw"
                            placeholder="请输入密码"
                            errorText={getFieldError('pass')}
                            {...getFieldProps('pass', {
                                ref: el => this.mobileInput = el,
                                rules: [
                                    { required: true, message: '请输入8-20位字母数字的组合密码' },
                                    rules.pass 
                                ],
                            })}>
                            <Tap onTap={() => { this.eyeShow() }}>
                                <div className="box">
                                    <img className={this.state.className} src={'/imgs/com/open-eyes.svg'} />
                                    <img className={this.state.className2} src={'/imgs/com/close-eyes.svg'} />
                                </div>
                            </Tap>
                        </InputComt>
                    </List>

                    <NetValid show={this.state.captchaShow} onNetValid={ this.onNetValid } />
                </div>
                
                <Button onBtn={this.onBtn} 
                    form={this.props.form} 
                    fields={['phone','pass']}
                >登录</Button>
            </div>
        )
    }
}

export default createForm()(Page);
