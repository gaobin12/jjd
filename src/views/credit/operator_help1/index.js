
//运营商认证3
import '../credit.less' 
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import {Flex } from 'antd-mobile'
import PropTypes from 'prop-types'


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
                    <span className="form-font">授权失败的常见原因？</span>
                </Flex>
                <div className="oper_help">
                    <p className="fontC3 font12 mart10">1、全部173、大部分177、大部分170号码段，企业账号，携号转网用户，不能正常授权成功；</p>
                    <p className="fontC3 font12 mart10">2、电信（吉林、陕西、陕西、湖南、浙江、重庆、广西、云南、）这8个省份的号码必须实名制才可以；</p>
                    <p className="fontC3 font12 mart10">3、授权次数过多导致超时没有输入，需要刷新当前页面或者返回上一页再次尝试。</p>
                </div>
            </div>
        )
    }
}

