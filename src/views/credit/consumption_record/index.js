
//信用报告-消费详情
import '../credit.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { List, Flex } from 'antd-mobile'
import { inject, observer } from 'mobx-react'
import { Loading, Modal } from 'SERVICE'

@withRouter
@inject('creditStore', 'userStore')
@observer
export default class App extends Component {
    constructor(props, context) {
        document.title = "消费详情";
        super(props, context)
        let { query } = this.props.location;
        this.state = {
            //userId:query.userId,
            userId: this.props.userStore.userInfo.userId,
            list:[]        
        };
    }

    componentDidMount(){
    //    this.getRecordInfo();
    }
    getRecordInfo=()=>{
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/credit/user/getEbusinessExpense',
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
                    <Flex.Item>消费记录</Flex.Item>
                    <Flex.Item>消费金额</Flex.Item>
                </Flex>
                <div className="father_flex_div">
                    {list.map((item) => {
                        return (
                            <Flex className="father_flex" key={Math.random()}>
                                <Flex.Item className="fontC4">{item.trans_mth }</Flex.Item>
                                <Flex.Item>{item.all_count }</Flex.Item>
                                <Flex.Item>{item.all_amount.toFixed(2)}元</Flex.Item>
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
