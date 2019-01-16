// 信用报告 => 高法失信
import './index.less'
import '../credit.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { Picker, List, InputItem, DatePicker,Button, Toast } from 'antd-mobile'
import {Tap, ImgUpload,Tips} from 'COMPONENT'
import { Loading, Modal } from 'SERVICE/popup'
import { createForm } from 'rc-form'

const Item = List.Item;
@withRouter
export default class App extends Component{
    constructor(props, context) {
        document.title = "高法失信";
        super(props, context)
        this.state = {
            switchIndex: 2,//tab"type": 失信类型，0：被执行人；1：限制消费人员；2：失信被执行人,
            show: [true],//展开   
            data: null,
            timer: null,
        };
    };

    componentDidMount() {
        this.onGetInfo()
    }
    onGetInfo=(type)=>{
        $.ajaxE({
            type: 'GET',
            url: '/credit/accredit/getInfo',
            data:{
                content_type:"dishonest",
            }
        }).then((data)=>{
            // [{
            //     "type": 失信类型，0：被执行人；1：限制消费人员；2：失信被执行人,
            //     "caseID": "案件号",
            //     "caseCreateTime": "立案时间",
            //     "courtName": "法院名称",
            //     "province": "法院所在省份",
            //     "caseDocumentID": 执行依据文件号,
            //     "discreditPublishTime": "如为失信被执行人，则此字段为失信发布日期",
            //     "executionTarget": 执行标的,
            //     "leftTarget": 未履行标的,
            //     "executionDescription": 执行情况描述,
            //     "caseEndTime": "如为终本案件，则此字段为终本时间；否则无此字段"
            // }]
            this.setState({
                data: data.dishonestCasesList
            })
            if(type == 'update'){                
                Toast.info('更新完成',1)
            }
        }).catch((msg)=>{
            console.log(msg);
        })
    }
    // 选择框
    onSwitch=(value)=>{
        this.setState({
            switchIndex: value
        })
    }
    onShow=(index)=>{
        let {show} = this.state;
        show[index] = !show[index]
        this.setState({
            show
        })
    }
    onAlertll=(e)=>{
        if(e){
            Modal.alertX('详细信息',e)
        }
    }
    // 更新数据
    onUpdate(){
        $.ajaxE({
            type: 'POST',
            url: '/credit/accredit/submitLoginParams',
            data:{
                content_type:"dishonest",
            }
        }).then((data)=>{

        }).catch((msg)=>{
            console.log(msg);
        })
        let timer = this.state.timer;
        Toast.info('更新数据中...',10);
        timer = setInterval(() => {
            $.ajaxE({
                type: 'POST',
                url: '/credit/accredit/queryGrabStatus',
                data:{
                    content_type:"dishonest",
                }
            }).then((data)=>{
                Toast.hide()
                clearInterval(timer)
                this.onGetInfo('update')
            }).catch((msg)=>{
                console.log(msg);
            })
        }, 1000);
        this.setState({
            timer
        })
    }
    componentWillUnmount(){
        let timer = this.state.timer;
        clearInterval(timer)
    }
    render() {
        let {switchIndex,show, data} = this.state;

        let noData = true;
        data&&data.length&&data.map((item,index)=>{
            if((item.type==0&&switchIndex==0)||(item.type==2&&switchIndex==2)){
                noData = false
            }
        })

        return (
            <div className='view-gfsx'>
                <div style={{height:"100%",overflow:'auto'}}>
                    <div className='nav-top'>
                        <Tap className={switchIndex?'active':''} onTap={()=>{this.onSwitch(2)}}>失信被执行人</Tap>
                        <Tap className={!switchIndex?'active':''} onTap={()=>{this.onSwitch(0)}}>被执行人</Tap>
                    </div>
                    {noData?<div className="no-data">
                        <div className="icon">
                            <img src={'/imgs/friend/null.png'} />
                        </div>
                        <div className="row_font">暂无任何内容</div>
                    </div>:data.map((item,index)=>{
                        if(item.type==0&&switchIndex!=0){
                            //type 0 被执行人列表
                        }else if(item.type==2&&switchIndex!=2){
                            //type 2 失信被执行人列表
                        }else{//其他情况不显示
                            return
                        }
                        return<List className="gfsx-list" style={{height:!show[index]?'44px':'440px'}} key={item.caseID}>
                            <Item className='header' arrow={!show?"horizontal":'down'}  onClick={() => {this.onShow(index)}}>案件{item.caseID}</Item>
                            <Item extra={item.caseID} >案件号</Item>
                            <Item extra={item.caseCreateTime} >立法时间</Item>
                            <Item extra={item.courtName} >法院名称</Item>
                            <Item extra={item.province} >所在省份</Item>
                            <Item extra={item.caseDocumentID} >执行依据文件号</Item>
                            <Item extra={item.discreditPublishTime&&item.discreditPublishTime!='null'?item.discreditPublishTime:'无'} >失信发布时间</Item>
                            <Item extra={item.executionTarget} >执行标的</Item>
                            <Item extra={item.leftTarget} >未履行标的</Item>
                            <Item extra={item.executionDescription} className='click' onClick={()=>{this.onAlertll(item.executionDescription)}}>执行情况描述</Item>
                        </List>                    
                    })}
                </div>

                <div className='common-btn_box'>
                    <Tap className='c-black span font16 active' onTap={this.onUpdate}>更新数据</Tap>
                </div>
            </div>
        )
    }
}

