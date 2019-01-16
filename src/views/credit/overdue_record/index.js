//信用报告-逾期记录
import '../credit.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { Flex,List } from 'antd-mobile'
import { inject, observer } from 'mobx-react'
import { Loading, Modal, util } from 'SERVICE'

@withRouter
@inject('creditStore', 'userStore')
@observer
export default class App extends Component {
    constructor(props, context) {
        document.title = "逾期记录";
        super(props, context)
        let query = util.getUrlParams(this.props.location.search);
        this.state = {
           userId:query.userId,
            //列表   
            list:[]     
        }
    }
    componentDidMount(){
        this.getRecordInfo();
    }
    getRecordInfo=()=>{
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/user/my/getOverdueList',
            data:{
                userId: this.state.userId
            }
        }).then((data)=>{
            this.setState({
                list:data
            })
        }).catch((msg)=>{
            console.log(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }
    render() {
        const { list } = this.state
        return (
            <div className='record-credit'>
                <Flex className="father_flex_tit">
                    <Flex.Item>逾期时间</Flex.Item>
                    <Flex.Item>逾期天数</Flex.Item>
                    <Flex.Item>逾期金额</Flex.Item>
                    <Flex.Item>状态</Flex.Item>
                </Flex>
                <div className="father_flex_div">
                    {list.map((item) => {
                        return (
                            <Flex className="father_flex" key={Math.random()}>
                                <Flex.Item className="fontC4">{item.time  }</Flex.Item>
                                <Flex.Item>{item.day }</Flex.Item>
                                <Flex.Item>{$.toYuan(item.amount) }</Flex.Item>
                                <Flex.Item>{item.state?"是":"否"}</Flex.Item>
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
