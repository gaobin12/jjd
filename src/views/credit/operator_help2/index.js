
//运营商认证3
import '../credit.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import {Flex } from 'antd-mobile'

@withRouter
export default class App extends Component {
    constructor(props, context) {
        document.title = "运营商信息";
        super(props, context)
        this.state = {
        };
    };


    render() {
        return (
            <div className='view-credit-all view-credit-help'>
                <Flex className="single">
                    <span className="form-line"></span>
                    <span className="form-font">如何获取服务密码？</span>
                </Flex>
                <div className="oper_help">
                    <p className="fontC3 font12 mart10">移动用户</p>
                    <p className="fontC3 font12">方法一：手机拨打<a href="tel:10086">10086</a>，转“人工服务”；</p>
                    <p className="fontC3 font12">方法二：访问<a href="http://www.10086.cn">www.10086.cn</a>，登录，“忘记密码”查询；</p>
                    <p className="fontC3 font12 mart10">联通用户</p>
                    <p className="fontC3 font12">方法一：手机拨打<a href="tel:10010">10010</a>，转“人工服务”；</p>
                    <p className="fontC3 font12">方法二：访问<a href="http://wap.10010.com">wap.10010.com</a>，登录，“忘记密码”查询；</p>
                    <p className="fontC3 font12 mart10">电信用户</p>
                    <p className="fontC3 font12">方法一：手机拨打<a href="tel:10010">10000</a>，转“人工服务”；</p>
                    <p className="fontC3 font12">方法二：访问<a href="http://www.189.cn">www.189.cn</a>，登录，“忘记密码”查询；</p>
                </div>
            </div>
        )
    }
}

