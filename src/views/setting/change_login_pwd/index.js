// 修改登陆密码（输入验证码）
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { InputItem, List, Button } from 'antd-mobile'
import { createForm } from 'rc-form';
import { Loading, Modal } from 'SERVICE'
import { Tap } from 'COMPONENT'

class Page extends Component {
    constructor(props, context) {
        document.title = "修改登陆密码";
        super(props, context)
        this.state = {

        };
    }
    
    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        return (
            <div className="view-login">
                <div className="view-con">
                    <div className="wel reset-psd">
                        请输入验证码
                    </div>
                    {/* 输入验证码 */}
                    <List className="list yz-code">
                        <InputItem
                            type="photo" className="login_input"
                            placeholder="请输入图片验证码"
                            clear
                            onFocus = {$.clearErrors.bind(this,'yzCode')}
                            {...getFieldProps('yzCode', {
                                rules: [
                                    { required: true, message: '*请输入正确的图片验证码' },
                                    // { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '*请输入11位手机号码' },
                                ],
                                validateTrigger:'onBlur'
                            })}>
                        
                            <img className="icon yzCode" src={'/imgs/com/2018-04-19_132707.jpg'} />
                            <img className="icon refresh" src={'/imgs/com/refresh-icon.svg'} />
                        </InputItem>
                        <div className='common-jc-error'>{getFieldError('yzCode') && getFieldError('yzCode').join(',')}</div>
                    </List>

                    
                    {/* active 按钮颜色变淡      */}
                    <List className="bottom-btn pt28 active">
                        <Button type="primary">获取手机验证码</Button>
                        <img className="icon refresh" src={'/imgs/com/loading-icon.svg'} />

                    </List>



                </div>
            </div>
        )
    }
}

export default createForm()(Page);
