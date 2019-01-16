//信用报告-公积金缴费详情
import '../credit.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { List, Flex } from 'antd-mobile'
import { Loading, Modal, util } from 'SERVICE'

@withRouter
export default class Page extends Component {
    constructor (props, context) {
        document.title = "公积金缴费详情";   
        super(props, context)
        let query = util.getUrlParams(this.props.location.search);
        this.state = {  
            userId:query.userId,
            list:[]
        };
    }
    componentDidMount(){
        this.getRecordInfo();
    }
    getRecordInfo=()=>{
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/credit/user/getGjjDetail',
            data:{
                userId: this.state.userId
            }
        }).then((data)=>{
            //保存用户数据
            this.setState({
                list:data.task_data.bill_record
            })
        }).catch((msg)=>{
            Modal.infoX(msg);
        }).finally(()=>{
			Loading.hide();
		})
    }
    render () {
        let { list } = this.state
        return (
            <div className='record-credit'>
                <Flex className="father_flex_tit">
                    <Flex.Item>缴纳时间</Flex.Item>
                    <Flex.Item>单位缴存</Flex.Item>
                    <Flex.Item>个人缴存</Flex.Item>
                    <Flex.Item>取出金额</Flex.Item>
                    <Flex.Item>余额</Flex.Item>
                </Flex>
                <div className="father_flex_div">
                    {list.map((item) => {
                        return (
                            <Flex className="father_flex" key={Math.random()}>
                                <Flex.Item className="fontC4">{item.deal_time}</Flex.Item>
                                <Flex.Item>{item.desc}</Flex.Item>
                                <Flex.Item>{item.income}</Flex.Item>
                                <Flex.Item>{item.outcome }</Flex.Item>
                                <Flex.Item>{item.balance}
                                </Flex.Item>
                            </Flex>
                        )
                    })}
                </div>
                <List className="no_data" hidden={list.length !== 0}>
                    <img src={'/imgs/iou/loan-null.svg'} />
                    <div className="row_font">暂无任何内容</div>
                </List>
            </div>
        )
    }
}
