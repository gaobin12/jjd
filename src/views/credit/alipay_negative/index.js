//信用报告-负面记录
import '../credit.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { Flex,List } from 'antd-mobile'
import { Loading,Modal,util } from 'SERVICE'

@withRouter
export default class App extends Component {
    constructor(props, context) {
        document.title = "负面记录";
        super(props, context)
        let query = util.getUrlParams(this.props.location.search);
        this.state = {
            userId: query.userId,
            //列表   
            list:[]     
        }
    }
    componentDidMount(){
        this.queryData();
    }
    //获取支付宝信息
    queryData = () => {
        $.ajaxE({
            type: 'POST',
            url: '/credit/accredit/alipay/queryData',
            data: {
                user_id: this.state.userId,
            }
        }).then((data) => {
            this.setState({
                list: data.badRecords ? data.badRecords:[]
            })
        }).catch((msg) => {
            console.log(msg);
        })
    }
    render() {
        const { list } = this.state
        return (
            <div className='record-credit'>
                <Flex className="father_flex_tit">
                    <Flex.Item>名称</Flex.Item>
                    <Flex.Item>类型</Flex.Item>
                    <Flex.Item>当前状态</Flex.Item>
                </Flex>
                <div className="father_flex_div">
                    {list.map((item) => {
                        return (
                            <Flex className="father_flex" key={Math.random()}>
                                <Flex.Item>{item.bad_credit_name  }</Flex.Item>
                                <Flex.Item>{item.bad_credit_reason }</Flex.Item>
                                <Flex.Item>{item.bad_credit_handle }</Flex.Item>
                            </Flex>
                        )
                    })}
                </div>
                <List className="no_data" hidden={list.length !== 0}>
                    <img src={'/imgs/friend/null.png'} />
                    <div className="row_font">暂无任何内容</div>
                </List>
        </div>
        )
    }
}
