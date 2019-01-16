//借条详情 => 发起展期
import '../form.less';
import './index.less';
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import {List,Flex } from "antd-mobile";
import { Loading, Modal } from 'SERVICE'

const Item = List.Item;


@withRouter
export default class App extends Component {
    constructor(props, context) {
        document.title = "逾期管理";
        super(props, context)
    
        this.state = {
        }        
    }

    componentDidMount() {

    }

    
  

    render() {
        return (
            <div className='view-form urge'>
                <div className="urge_card">
                    <div className="urge_card_top">
                        <span className="name">张苗苗</span>
                        <span className="tag">催收中</span>
                    </div>
                    <div className="urge_card_bot">
                        <div>
                            <span><i className="num-font">500</i>元</span>
                            <span>逾期金额</span>
                        </div>
                        <div>
                            <span><i className="num-font">500</i>元</span>
                            <span>已偿还金额</span>
                        </div>
                        <div>
                            <span><i className="num-font">50</i>天</span>
                            <span>逾期天数</span>
                        </div>
                    </div>
                </div>
                <Flex justify='start' className='list-title mar166'>
                    <span className='title'>基础管理</span>
                </Flex> 
                <List className="detail_list mar30">
                    <Item 
                    arrow="horizontal" 
                    onClick={() => {}} >逾期计息
                        <span className="urge_item">逾期费用<i>100</i>元</span>
                    </Item>
                    <Item arrow="horizontal" 
                    onClick={() => {}}>微信推送
                        <span className="urge_item">已推送消息<i>5</i>条</span>
                    </Item>
                    <Item arrow="horizontal" 
                    onClick={() => {}}>黑名单上传
                        <span className="urge_item">逾期<i>30</i>天上传黑名单</span>
                    </Item>
                </List>
                <Flex justify='start' className='list-title mar166'>
                    <span className='title'>平台催收</span>
                </Flex> 
                <List className="detail_list mar30">
                    <Item 
                    arrow="horizontal" 
                    onClick={() => {}} >短信催收
                        <span className="urge_item">发发送短信<i>100</i>条</span>
                    </Item>
                    <Item arrow="horizontal" 
                    onClick={() => {}}>电话催收
                        <span className="urge_item">可申请</span>
                    </Item>
                </List>
                <Flex justify='start' className='list-title mar166'>
                    <span className='title'>法律支持</span>
                </Flex> 
                <List className="detail_list mar30">
                    <Item 
                    arrow="horizontal" 
                    onClick={() => {}} >下载证据
                    </Item>
                </List>
            </div>
        )
    }
}