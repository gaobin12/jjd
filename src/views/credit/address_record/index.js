
//信用报告-京东认证-电商收货地址
import '../credit.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Flex,List } from 'antd-mobile'
import { inject, observer } from 'mobx-react'
import { Loading, Modal, util} from 'SERVICE'
import { Link,withRouter } from 'react-router-dom'

@withRouter
@inject('creditStore', 'userStore')
@observer
export default class App extends Component {
    constructor(props, context) {
        document.title = "电商收货地址";
        super(props, context)
        let query = util.getUrlParams(this.props.location.search);
        const { userStore } = this.props;
        this.state = {
            userId:query.userId,
            //列表   
            list:[1,2,3]     
        };
    }
    componentDidMount(){
        this.getReportDetailInfo();
    }
    //获取基础信息
    getReportDetailInfo = () => {
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/user/my/getDetailReport',
            data: {
                userId: this.state.userId,
            }
        }).then((data) => {
            this.setState({
                list: data.creditDetailReport.deliverAddresslist,
            });
        }).catch((msg) => {
            console.error(msg);
        }).finally(() => {
            Loading.hide();
        })

    };
    // 缺少接口
    render() {
        const { list } = this.state
        return (
            <div className='record-credit'>
                {list.length>0 ?
                    list.map((ele, index) => {
                        let { address, receiver, total_count, total_amount, begin_date, end_date } = ele;

                        return (
                            <div className="card-record">
                                <Flex className="table_flex" justify="between">
                                    <Flex.Item className="fontC4 flex1">电商收货地址</Flex.Item>
                                    <Flex.Item className="fontC1 flex2">{address}</Flex.Item>
                                </Flex>
                                <Flex className="table_flex" justify="between">
                                    <Flex.Item className="fontC4 flex1">消费次数</Flex.Item>
                                    <Flex.Item className="fontC1 flex2">{total_count}</Flex.Item>
                                </Flex>
                                <Flex className="table_flex" justify="between">
                                    <Flex.Item className="fontC4 flex1">消费金额</Flex.Item>
                                    <Flex.Item className="fontC1 flex2">{(Number(total_amount)).toFixed(2)}元</Flex.Item>
                                </Flex>
                                <Flex className="table_flex" justify="between">
                                    <Flex.Item className="fontC4 flex1">收货时间</Flex.Item>
                                    <Flex.Item className="fontC1 flex2">{begin_date}至{end_date}</Flex.Item>
                                </Flex>
                            </div>
                        )
                    }) :
                    null
                }
                {/* <div className="card-record">
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="fontC4 flex1">电商收货地址</Flex.Item>
                        <Flex.Item className="fontC1 flex2">北京市海淀区**********</Flex.Item>
                    </Flex>
                        <Flex className="table_flex" justify="between">
                        <Flex.Item className="fontC4 flex1">收货人姓名</Flex.Item>
                        <Flex.Item className="fontC1 flex2">问*</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="fontC4 flex1">联系电话</Flex.Item>
                        <Flex.Item className="fontC1 flex2">122**343</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="fontC4 flex1">消费次数</Flex.Item>
                        <Flex.Item className="fontC1 flex2">2</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="fontC4 flex1">消费金额</Flex.Item>
                        <Flex.Item className="fontC1 flex2">12</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="fontC4 flex1">收货时间</Flex.Item>
                        <Flex.Item className="fontC1 flex2">2</Flex.Item>
                    </Flex>
                </div> */}
                {/* {list.map((item) => {
                    return (
                        <Flex className="father_flex" key={Math.random()}>
                            <Flex.Item>{item.phone_num}</Flex.Item>
                            <Flex.Item>{item.call_cnt}</Flex.Item>
                        </Flex>
                    )
                })} */}
                <List className="no_data" hidden={list.length !== 0}>
                    <img src={'/imgs/iou/loan-null.svg'} />
                    <div className="row_font">暂无任何内容</div>
                </List>
            </div>
        )
    }
}
