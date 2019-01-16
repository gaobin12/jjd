
//信用报告-举报记录
import '../credit.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Flex,List } from 'antd-mobile'
import { inject, observer } from 'mobx-react'
import { Loading, Modal, util } from 'SERVICE'

@withRouter
@inject('creditStore', 'userStore')
@observer
export default class App extends Component {
    constructor(props, context) {
        document.title = "举报记录";
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
            url: '/user/my/getReportList',
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
                    <Flex.Item>举报时间</Flex.Item>
                    <Flex.Item>举报人</Flex.Item>
                    <Flex.Item>举报原因</Flex.Item>
                    <Flex.Item>借条金额</Flex.Item>
                </Flex>
                <div className="father_flex_div">
                {list.map((item) => {
                    return (
                        <Flex className="father_flex" key={Math.random()}>
                            <Flex.Item>{item.time }</Flex.Item>
                            <Flex.Item>{item.name }</Flex.Item>
                            <Flex.Item>{item.memo?item.memo:"违约" }</Flex.Item>
                            <Flex.Item>{$.toYuan(item.amount) }元</Flex.Item>
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
