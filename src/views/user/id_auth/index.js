
//银行卡
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { List, InputItem } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Tap } from 'COMPONENT'
import { Loading, Modal } from 'SERVICE'

@withRouter
@inject('userStore')
@observer
class Page extends Component {
    
    constructor(props, context) {
        document.title = "实名认证";
        super(props, context)
        //获取链接信息
        let query = this.props.location.query;
    
        this.state = {
            pathType:query.pathType||"",  //类型，根据类型设置跳转地址 1.绑卡2.极速借条3.设置
            payCredit:query.payCredit||"", //绑卡跳转传值 0：9.9元 1:118元 "":绑卡
        };
    }

    componentDidMount(){
        
    }

    //提交表单事件
    onSubmit = () => {
        this.inputBlur1.inputRef.inputRef.blur()
        this.inputBlur2.inputRef.inputRef.blur()
        this.props.form.validateFields((error,values) => {
            if (!error) {
                this.ajaxCard(values);
            }
        });
    }

    // 实名认证
    ajaxCard=(v)=>{
        const _this = this;
        Loading.show();
        $.ajaxE({
            type: 'POST',
            url: '/credit/faceVerify/verifyIdcardNameNumber',
            data: {
                name:v.fullName,
                number:v.idCardNo
            }
        }).then((data)=>{
            _this.props.userStore.getUserCreditInfo();
            _this.props.history.push({
                pathname: '/user/input_valid2',
                query: {
                    pathType: this.state.pathType,
                    payCredit: this.state.payCredit,
                }
            });
        }).catch((msg)=>{
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }

    render() {
        const { getFieldProps,getFieldError } = this.props.form;
        return (
            <div className='view-bind-bank-idcard'>
                <List>
                        <InputItem
                            type="text"
                            {...getFieldProps('fullName', {
                                ref : ref => this.inputBlur1 = ref,
                                rules: [
                                    { required: true, message: '请输入姓名！' },
                                ],
                                validateTrigger:'onBlur'
                            })}
                            clear
                            placeholder="请输入真实姓名"
                        >姓名</InputItem>
                        <div className='common-jc-error'>{getFieldError('fullName') && getFieldError('fullName').join(',')}</div>
                        <InputItem
                            type="text"
                            {...getFieldProps('idCardNo',{
                                ref : ref => this.inputBlur2 = ref,
                                rules: [
                                    {pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证格式不正确!',
                                    }, {
                                        required: true, message: '请输入身份证号码！',
                                    }],
                                    validateTrigger:'onBlur'

                            })}
                            type="text"
                            clear
                            placeholder="请输入身份证号"
                        >身份证号</InputItem>
                        <div className='common-jc-error'>{getFieldError('idCardNo') && getFieldError('idCardNo').join(',')}</div>
                        {/* <div className="bottom bottom_fixed">
                            <Tap  onTap = {this.onSubmit}>
                                <div className="bottom_button">
                                    下一步
                                </div>
                            </Tap>
                        </div> */}

                        
                </List>
                <div className='common-btn_box'>
                    <Tap className='c-black span font16 active' onTap={this.onSubmit}>下一步</Tap>
                </div>
            </div>
        )
    }
}

export default createForm()(Page);
