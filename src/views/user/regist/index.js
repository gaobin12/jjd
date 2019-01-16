// 新注册
import './index.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { List, Checkbox } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Loading, Modal,rules } from 'SERVICE'
import { Tap,InputComt,Button } from 'COMPONENT'

const AgreeItem = Checkbox.AgreeItem;

@withRouter
@inject('userStore')
@observer
class Page extends Component {    
    constructor(props, context) {
        document.title = "注册";
        super(props, context)
        this.state = {
            agreement:false,//协议
            agree:'none',//协议提示显示隐藏
            type: 'password',//密码框类型
            className: 'icon passw active',//类名
            className2: 'icon passw',
            bgcolor: "bottom-btn pt28 active",//按钮北京颜色
            _passWord:'',//存值密码
        };
    }
    
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

    loginSubmit=()=>{  
        this.inputPWD.inputRef.inputRef.blur() 
        this.props.form.validateFields((error, values) => {         
            if (!error) {//验证通过 
                if(this.state.agreement){
                    this.ajaxRegist(values);
                }else{
                    Modal.infoX('请选择阅读并同意今借到用户协议，征信授权书');
                }               
            }
        });
    }

    ajaxRegist = (v) => {
        let _this = this
        if (navigator && navigator.onLine === false) {
            Modal.infoX('请检查网络连接');   
        } else {
            //用户第一次关联微信 传递用户图像 给 后台
            let headUrl = '';
            if($.getUserInfo()){
                headUrl = $.getUserInfo().headimgurl;
            }
            Loading.show();
            $.ajaxE({
                type: 'POST',
                url: '/user/passport/register',
                data: {
                    head:headUrl?headUrl:'',
                    //手机号
                    telephone: this.state.telephone,
                    //密码
                    pwd: $.md5($.md5(v.password)),
                    openId: $.getUserOpenId(),
                    token:this.state.code,
                    //邀请码
                    unionId: "",
                }
            }).then((data) => {
                ////debugger
                $.setUserInfo(data);
                sessionStorage.setItem('token', data.token);
                this.props.history.push({
                    pathname: '/'
                });
            }).catch((msg) => {
                Modal.infoX(msg, () => {
                    _this.props.history.push({
                        pathname: '/user/wy_valid/0',
                        query: {
                            telephone: _this.state.telephone
                        }
                    })
                });
            }).finally(() => {
                Loading.hide();
            })
        }
        
    }

    onAgreementChange=(v)=>{
        this.props.userStore.setLoginForm({
            checked:v.target.checked
        });
    }

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        const { userStore:{loginForm} } =  this.props;
        return (
            <div className="view-login-regist">
                <div className="view-con">
                    <div className="hello">
                        您好，
                    </div>
                    <div className="wel">
                        您的账号还未注册
                    </div>
                    <div className="wel pt0">
                        请设置登录密码完成注册
                    </div>
                    <List className="list">
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

                        <AgreeItem className="reg-agree" checked={form.checked} onChange={this.onAgreementChange}>
                            已阅读并同意
                            <Link to='/agreement'>
                                《今借到用户协议》
                            </Link>
                            <Link to='/agree/auth'>
                                《征信授权书》
                            </Link>
                        </AgreeItem>
                    </List>
                    
                    {/* active 按钮颜色变淡      */}
                    <Button onBtn={this.onBtn} 
                        form={this.props.form} 
                        fields={['pass']}
                    >注册</Button>

                </div>
            </div>
        )
    }
}

export default createForm()(Page);
