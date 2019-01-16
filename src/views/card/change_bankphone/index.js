
//银行卡=>更改预留手机号码
import '../card.less'
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { List, InputItem } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Loading, Modal } from 'SERVICE'
import { InputValid,Tap } from 'COMPONENT'

@withRouter
@inject('bankStore')
@observer
class App extends Component {
    constructor(props, context) {
        document.title = "更换手机号";
        super(props, context)
        let { query } = this.props.location;
        this.state = {
            phoneNumber: "", // 手机号
            isPayPasswdShow: false, // 是否显示支付密码组件
        };
    }

    // 点击提交
    onSubmit=()=>{ 
        this.props.form.validateFields((error, values) => {
            if (!error) {
                this.setState({
                    isPayPasswdShow:true,
                    phoneNumber:values.phoneNumber
                });     
            }
        });
    }

    // 提交手机号+密码
    verifyPasswd = (value) => {
        let that=this;
        Loading.show();
        $.ajaxE( {
            type: 'POST',
            url: '/user/bindCard/modifyBankTel',
            data: {
                bindBankId: this.props.bankStore.currentBank.id, // 银行卡号
                userTel: that.state.phoneNumber, // 银行卡预留手机号
                payPassword: value, // 密码
            }
        }).then((data) => {
            // 成功
            Modal.alertX('提示', '预留手机号码修改成功', [
                { text: '确定', onPress: () => {
                    that.props.history.push({ // 修改成功，返回银行卡详情页
                        pathname: '/card',
                    });
                } },
            ]);            
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
			Loading.hide();
		})
    }    

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        let { isPayPasswdShow}=this.state;
        return (
            <div className="view_modify_bank_tel view-card">
                <List className="bank-list">
                    <InputItem
                        {...getFieldProps('phoneNumber', {
                            rules: [
                                {
                                    pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '手机号格式不正确!',
                                }, {
                                    required: true, message: '请输入新预留手机号',
                                }],
                            validateTrigger:'onBlur'
                        })}                        
                        type="number"
                        placeholder="请输入新预留手机号"
                        clear
                    >新预留手机号</InputItem>
                    <div className='common-jc-error'>{getFieldError('phoneNumber') && getFieldError('phoneNumber').join(',')}</div>
                </List>

                <div className='common-btn_box'>
                    <Tap className='c-black span font16 active' onTap={this.onSubmit}>确定</Tap>
                </div>

                {/*支付密码组件*/}
                {/* <InputValid
                    visible={isPayPasswdShow}
                    onEnd={(e) => { this.setState({ isPayPasswdShow: false }); this.verifyPasswd(e) }}
                    onClose={() => { this.setState({ isPayPasswdShow: false }); }}
                /> */}
            </div>
        )
    }
}

export default createForm()(App);
