//信用报告-交易详情
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { Flex,List } from 'antd-mobile'
import { inject, observer } from 'mobx-react'
import { Loading, Modal, util} from 'SERVICE'

@withRouter
@inject('creditStore', 'userStore')
@observer
export default class App extends Component {
    constructor(props, context) {
        document.title = "交易信息";
        super(props, context)
        let query = util.getUrlParams(this.props.location.search);
        this.state = {
            //列表   
            userId:query.userId,
            list: []  
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
                list: data.billRecords
            })
        }).catch((msg) => {
            console.log(msg);
        })
    }
    render() {
        const { list } = this.state
        console.log(list)
        const items = (
            list.map(e=>{
                return <li>
                    <div className='alipay-left'>
                        <div className='consumeTitle'>{e.consumeTitle}</div>
                        <div className="consumeDate">{e.consumeDate}</div>
                    </div>
                    <div className="alipay-right">
                        <div className="consumeFee">{e.consumeFee}</div>

                    </div>
                </li>
            })
        )
        return (
            <div className='alipay-credit'>
                <ul>
                    {items}
                </ul>
            </div>
            
        )
    }
}
