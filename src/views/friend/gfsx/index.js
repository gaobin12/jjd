// 信用报告 => 工作信息 => creditIncomeInfo / creditReportRevision
// lj
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List, } from 'antd-mobile'
import {Tap, } from 'COMPONENT'
import { Loading, Modal } from 'SERVICE/popup'

const Item = List.Item;

@withRouter
export default class Page extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    };
    constructor(props, context) {
        document.title = "高法失信";
        super(props, context)

        this.state = {
            switchIndex: true,//tab
            show: true,//展开
        };
    };

    // 调接口
    componentDidMount() {
        //this.getJobProve();
    }

    getJobProve=()=>{
        let that = this;
        let { ress}=this.state
        $.ajaxE( {
            type: 'GET',
            url: "/credit/accredit/getInfo",
            data: {
                system_type: "jjd",
                content_type: "job",
            }
        }).then((data) => {

        }).catch((msg) => {
            console.log(msg);
        })
    }
    onSwitch=()=>{
        this.setState({
            switchIndex: !this.state.switchIndex
        })
    }
    onShow=()=>{
        this.setState({
            show: !this.state.show
        })
    }
    render() {
        let {switchIndex,show} = this.state
        return (
            <div className='view-gfsx'>
                <div className='nav-top'>
                    <Tap className={switchIndex?'active':''} onTap={this.onSwitch}>失信被执行人</Tap>
                    <Tap className={!switchIndex?'active':''} onTap={this.onSwitch}>被执行人</Tap>
                </div>
                <List className="gfsx-list" style={{height:!show?'44px':'440px'}}>
                    <Item className='header' arrow={!show?"horizontal":'down'}  onClick={() => {this.onShow()}}>案件1</Item>
                    <Item extra="extra content"  onClick={() => {}}>案件号</Item>
                    <Item extra="extra content"  onClick={() => {}}>立法时间</Item>
                    <Item extra="extra content"  onClick={() => {}}>法院名称</Item>
                    <Item extra="extra content"  onClick={() => {}}>所在省份</Item>
                    <Item extra="extra content"  onClick={() => {}}>执行依据文件号</Item>
                    {<Item extra="extra content"  onClick={() => {}}>失信发布时间</Item>}
                    <Item extra="extra content"  onClick={() => {}}>执行标的</Item>
                    <Item extra="extra content"  onClick={() => {}}>未履行标的</Item>
                    <Item extra="extra content"  onClick={() => {}}>执行情况描述</Item>
                </List>
            </div>
        )
    }
}
