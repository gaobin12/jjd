//信用报告-话费详情
import '../credit.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Flex,List } from 'antd-mobile'
import { Loading, Modal } from 'SERVICE'

@withRouter
export default class App extends Component {
    constructor(props, context) {
        document.title = "话费详情";
        super(props, context)
        let { query } = this.props.location;
        this.state = {
            //userId:query.userId,
            //列表   
            list:[]     
        };
    }

    componentDidMount(){
        //this.getRecordInfo();
    }

    getRecordInfo=()=>{
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/credit/user/getMobileBill',
            data:{
                userId: this.state.userId
            }
        }).then((data)=>{
            //保存用户数据
            this.setState({
                list:data
            })
        }).catch((msg)=>{
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }

    render() {
        const { list } = this.state
        return (
            <div className='record-credit'>
                <Flex className="father_flex_tit">
                    <Flex.Item>月份</Flex.Item>
                    <Flex.Item>消费金额</Flex.Item>
                </Flex>
                <div className="father_flex_div">
                    {list.map((item) => {
                        return (
                            <Flex className="father_flex">
                                <Flex.Item>{item.bill_cycle }</Flex.Item>
                                <Flex.Item>{$.toYuan(item.total_amt) }</Flex.Item>
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

