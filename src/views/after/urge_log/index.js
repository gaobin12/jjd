
//借条详情 => 催收记录
import './index.less'
import '../form.less';
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import {List, Flex,Tabs} from 'antd-mobile'
import { Loading, Modal } from 'SERVICE'
import Tap from 'COMPONENT/Tap'

const Item = List.Item;
const tabs = [
    { title: '逾期计息' },
    { title: '微信推送' },
    { title: '短信催收' },
    { title: '电话催收' },
  ];

@withRouter
export default class Page extends Component {
	constructor(props, context) {
		document.title = "催收进度";
		super(props, context)
		// let { query } = this.props.location;
		this.state = {
            // id:query.id,
            days:31,
            isSide:false,
            isPhone:false
		};
	}

	componentDidMount() {
        
    }

	
	
	render() {
		return (
			<div className="urge-process">

                <Tabs tabs={tabs} initialPage={0} animated={false} useOnPan={false}>
                    <div>
                        <div className="box_ce">
                            <div className="urge_box_ce">
                                <div>
                                    <span><i className="num-font">500</i>元</span>
                                    <span>逾期金额</span>
                                </div>
                                <div>
                                    <span><i className="num-font">500</i>元</span>
                                    <span>已偿还金额</span>
                                </div>
                                <div>
                                    <span><i className="num-font">50</i>天</span>
                                    <span>逾期天数</span>
                                </div>
                            </div>
                            <div> 
                                <div className="days state2"><img src={'/imgs/iou/time2.svg'} />
                                   <span><i className="jixi marl10">已计息</i>计收基础逾期管理费和罚息</span>
                                </div>
                                <div className="yuqi none">
                                    <div className="marl20">
                                        <span>逾期管理费:1元/天</span>
                                        <span>罚息:（本金*24%/365）*逾期天数</span>
                                    </div>
                                </div>
                            </div> 
                            {this.state.days > 0?<div> 
                                <div className="days state"><img src={'/imgs/iou/time1.svg'} />
                                    <span>逾期1天</span>
                                    <span>计收基础逾期管理费,罚息1%
                                        <Tap onTap="" className={this.state.isSide?"com_side_up active":"com_side_up"}>
                                        <img src={'/imgs/credit/side.svg'} /></Tap>
                                        </span>
                                </div>
                                <div className="yuqi">
                                    <span className="yuqi-time">2018-03-03</span>
                                    <div>
                                        <span>逾期管理费:(逾期本息+罚息)*1%/天</span>
                                        <span>罚息:（逾期本息*24%/365)*逾期天数</span>
                                    </div>
                                </div>
                            </div> :null}
                            {this.state.days > 16 ?<div>
                                <div className="days state1"><img src={'/imgs/iou/time1.svg'} />
                                    <span>逾期16天</span>
                                    <span>计收基础逾期管理费,特殊逾期管理费,罚息*5%
                                    <Tap onTap="" className={this.state.isSide?"com_side_up active":"com_side_up"}>
                                        <img src={'/imgs/credit/side.svg'} /></Tap>
                                    </span>
                                </div>
                                <div className="yuqi">
                                    <span className="yuqi-time">2018-03-03</span>
                                    <div>
                                        <span>特殊逾期管理费:(逾期本息+罚息+基础逾期管理费)*5%</span>
                                        <span>罚息:（逾期本息*24%/365)*逾期天数</span>
                                    </div>
                                </div>
                            </div>: null}
                            {this.state.days > 30 ?<div>
                                <div className="days state2"><img src={'/imgs/iou/time2.svg'} />
                                    <span>逾期30天</span>
                                    <span>计收基础逾期管理费,特殊逾期管理费,罚息*10%<Tap onTap="" className={this.state.isSide?"com_side_up active":"com_side_up"}>
                                        <img src={'/imgs/credit/side.svg'} /></Tap></span>
                                </div>
                                <div className="yuqi none">
                                    <span className="yuqi-time">2018-03-03</span>
                                    <div>
                                        <span>特殊逾期管理费:(逾期本息+罚息+基础逾期管理费)*5%</span>
                                        <span>罚息:（逾期本息*24%/365)*逾期天数</span>
                                    </div>
                                </div>
                            </div>:null}
                        </div>
                    </div>
                    <div>
                        <div className="box_ce">
                            <div className="weixin state1"><img src={'/imgs/iou/time2.svg'} />
                                <span>
                                    2018-02-04
                                    <span>02:00:00</span>
                                </span>
                                <span>已推送</span>
                                <span>已向借款人<i>张渺渺</i>推送微信消息请及时关注还款详情</span>
                            </div>
                            <div className="weixin state1"><img src={'/imgs/iou/time2.svg'} />
                                <span>
                                    2018-02-04
                                    <span>02:00:00</span>
                                </span>
                                <span>已推送</span>
                                <span>已向借款人<i>张渺渺</i>推送微信消息请及时关注还款详情</span>
                            </div>
                            <div className="weixin state1"><img src={'/imgs/iou/time2.svg'} />
                                <span>
                                    2018-02-04
                                    <span>02:00:00</span>
                                </span>
                                <span>已推送</span>
                                <span>已向借款人<i>张渺渺</i>推送微信消息请及时关注还款详情</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="box_ce">
                        
                        </div>
                    </div>
                    <div>
                        <div className="box_ce">
                        <div className="detail_list_div">
                        <List  className={this.state.isPhone?"detail_list phone_list active":"detail_list phone_list"}>
                            <List.Item extra={'111'}>借款人</List.Item>
                            <List.Item extra={'111'}>出借人</List.Item>
                            <List.Item extra={'111'}>借款金额</List.Item>
                            <List.Item extra={'111'}>借款人</List.Item>
                            <List.Item extra={'111'}>出借人</List.Item>
                            <List.Item extra={'111'}>借款金额</List.Item>
                            <List.Item extra={'111'}>借款人</List.Item>
                            <List.Item extra={'111'}>出借人</List.Item>
                            <List.Item extra={'111'}>借款金额</List.Item>
                        </List>
                        <div className="com_phone_side">
                            <Tap className={this.state.isPhone?"com_phone_side_up active":"com_phone_side_up"} 
                                onTap={()=>{this.setState({isPhone:!this.state.isPhone})}}>
                                <img src={'/imgs/credit/side.svg'} />
                            </Tap>
                        </div> 
                        </div>
                            <div className="weixin state1"><img src={'/imgs/iou/time2.svg'} />
                                <span>
                                    2018-02-04
                                    <span>02:00:00</span>
                                </span>
                                <span className="last-blue">全部催收金额已催回，保证金已退回</span>
                            </div>
                            <div className="weixin state1"><img src={'/imgs/iou/time2.svg'} />
                                <span>
                                    2018-02-04
                                    <span>02:00:00</span>
                                </span>
                                <span>已还款</span>
                                <span>
                                    <span>借款人还款金额1000元</span>
                                    <span>扣除佣金100元</span>
                                </span>
                            </div>
                            <div className="weixin state1"><img src={'/imgs/iou/time2.svg'} />
                                <span>
                                    2018-02-04
                                    <span>02:00:00</span>
                                </span>
                                <span>已拨打</span>
                                <span>电话催收--拨打本人--接听--预计本周日还款</span>
                            </div>
                        </div>
                    </div>
                </Tabs>

               
                

			</div>
		)
	}
}
