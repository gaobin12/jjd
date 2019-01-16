
//信用报告-通话记录详情
import '../credit.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { List, Flex } from 'antd-mobile'
import { inject, observer } from 'mobx-react'
import { Loading, Modal, util} from 'SERVICE'

@withRouter
@inject('creditStore', 'userStore')
@observer
export default class App extends Component {
    constructor(props, context) {
        document.title = "通话记录详情";
        super(props, context)
        let query = util.getUrlParams(this.props.location.search);
        this.state = {
            userId:query.userId,
            //列表   
            list:[]     
        };
    }
    componentDidMount(){
        this.getContactList();
    }
    //运营商通话记录详情
    getContactList = () => {
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/credit/user/getContactList',
            data: {
                userId: this.state.userId
            }
        }).then((data) => {
            //保存用户数据
            this.setState({
                list: data
            })
        }).catch((msg) => {
            console.log(msg);
        }).finally(() => {
            Loading.hide();
        })
    }
    render() {
        const { list } = this.state
        return (
            <div className='record-credit'>
                <Flex className="father_flex_tit">
                    <Flex.Item>手机号</Flex.Item>
                    <Flex.Item>通话次数</Flex.Item>
                    <Flex.Item>时长(分)</Flex.Item>
                    <Flex.Item>短信条数</Flex.Item>
                </Flex>
                <div className="father_flex_div">
                    {list.map((item) => {
                        return (
                            <Flex className="father_flex" key={Math.random()}>
                                <Flex.Item className="fontC4">{item.phone_num}</Flex.Item>
                                <Flex.Item>{item.call_cnt}</Flex.Item>
                                <Flex.Item className="fontC4">{item.call_len.toFixed(2) }</Flex.Item>
                                <Flex.Item>{item.sms_cnt}
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