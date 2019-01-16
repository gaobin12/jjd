// 重置密码（输入密码）
import './index.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { InputItem, List, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import { Loading, Modal } from 'SERVICE'
import { Tap } from 'COMPONENT'
@withRouter
@inject('userStore')
@observer
class Page extends Component {
    constructor(props, context) {
        document.title = "重置密码";
        super(props, context)
        this.state = {
            type: 'password',//密码框类型
            className: 'icon passw active',//类名
            className2: 'icon passw',
            available:false
        };
    }

    //密码可见不可见
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
    //输入正确按钮可用
    availAble = (v) => {
        if (/^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{8,20}$/.test(v)) {
            this.setState({
                available: true
            })
        }else{
            this.setState({
                available: false
            })
        }
    }
    // 提交信息
    onSubmit=()=>{
        this.props.form.validateFields((error,values) => {
            let state = this.props.location.state;
            const { userStore } = this.props;
            let tel = userStore.userInfo.telephone;
            if (!error) {//验证通过
                let that = this
                $.ajaxE({
                    type: 'POST',
                    url: '/user/passport/resetLoginPwd',            
                    data: {
                        //手机号
                        telephone: tel,
                        //验证码
                        mobileCode: state.vCode,
                        //密码
                        pwd: $.md5($.md5(values.password))
                    }
                }).then((data)=>{
                    Modal.alertX('提醒', '修改密码成功', [{
                        text: '知道了', onPress: function () {
                            // 清空数据跳到登录页面
                            sessionStorage.clear();
                            that.props.history.push({
                                pathname: '/user/login_pwd',
                                query:{
                                    telephone: tel
                                }
                            });
                        }
                    }])
                }).catch((msg)=>{
                    Modal.infoX(msg);
                })
            }
        });
    }


    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        return (
            <div className="view-login">
                <div className="view-con">
                    <div className="wel reset-psd">
                        您正在重置密码
                    </div>
                   
                    <List className="list">
                        <InputItem
                            type={this.state.type} className="ipt-psw"
                            placeholder="请输入8-20位字母数字的组合密码"
                            clear
                            {...getFieldProps('password', {
                                onChange: this.availAble,
                                rules: [
                                    { required: true, message: '*请输入8-20位字母数字的组合密码' },
                                    { pattern: /^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{8,20}$/, message: '*请输入8-20位字母数字的组合密码' },
                                ],
                                validateTrigger:'onBlur'
                            })}>
                            <Tap onTap={() => { this.eyeShow() }}>
                                <div className="box">
                                    <img className={this.state.className} src={'/imgs/com/open-eyes.svg'} />
                                    <img className={this.state.className2} src={'/imgs/com/close-eyes.svg'} />
                                </div>
                            </Tap>
                        </InputItem>
                        <div className='common-jc-error'>{getFieldError('password') && getFieldError('password').join(',')}</div>



                    </List>
                    
                    {this.state.available?<List className="bottom-btn pt28 ">
                        <Tap onTap={this.onSubmit}>
                            <Button type="primary">完成</Button>
                        </Tap>
                    </List>:<List className="bottom-btn active pt28">
                        <Button type="primary">完成</Button>
                    </List>}
                </div>
            </div>
        )
    }
}

export default createForm()(Page);
