//借条详情 => 催收记录
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import { List, Flex, Tabs } from 'antd-mobile'
import { Loading, Modal } from 'SERVICE'
import Tap from 'COMPONENT/Tap'

import './index.less'
import '../form.less';

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
		document.title = "记录";
		super(props, context)
		// let { query } = this.props.location;
		this.state = {
            // id:query.id,
            days:31,
            isSide:true,
            isPhone:false,
            isWeixin: true, // 是否有微信推送记录
            isMsg: true, // 是否有电话催收记录
            telStatus: 6  // 对应电话催收的不同状态 可选值有0 1 2 3 4 5 6
		};
	}

	componentDidMount() {

    }

	
	
	render() {
		return (
			<div className="urge-process">

                <Tabs tabs={tabs} initialPage={0} animated={false} useOnPan={false}>
                    <div className="pd20">
                        <div className="box_ce">
                            <div className="urge_box_ce">
                                <div>
                                    <span><i className="num-font">100</i>元</span>
                                    <span>已产生管理费</span>
                                </div>
                                <div>
                                    <span><i className="num-font">60</i>元</span>
                                    <span>预计得到<img className="icon" src='/imgs/iou/detail.png' /></span>
                                </div>
                                <div>
                                    <span><i className="num-font">40</i>元</span>
                                    <span>已得到奖励</span>
                                </div>
                            </div>
                            {/*<div> 
                                <div className="days state2"><img src={'/imgs/iou/time2.svg'} />
                                   <span><i className="jixi marl10">已计息</i>计收基础逾期管理费和罚息</span>
                                </div>
                                <div className="yuqi none">
                                    <div className="marl20">
                                        <span>逾期管理费:1元/天</span>
                                        <span>罚息:（本金*24%/365）*逾期天数</span>
                                    </div>
                                </div>
                            </div> */}
                            {this.state.days > 0 ? <div> 
                                <div className="days state"><img src={'/imgs/iou/time2.svg'} />
                                    <span>逾期<i className="color_org">1天</i></span>
                                    <span>
                                        <i className="jixi marl10">已计息</i>计收基础逾期管理费和罚息1%
                                        <Tap onTap="" className={this.state.isSide ? "com_side_up active" : "com_side_up"}>
                                        <img src={'/imgs/credit/side.svg'} /></Tap>
                                    </span>
                                    {/*<span>计收基础逾期管理费,罚息1%
                                        </span>*/}
                                </div>
                                <div className="yuqi">
                                    <span className="yuqi-time">2018-03-03</span>
                                    <div className="jixi_rule">
                                        <span>逾期管理费:(逾期本息+罚息)*1%/天</span>
                                        <span>罚息:（逾期本息*24%/365)*逾期天数</span>
                                    </div>
                                </div>
                            </div> : null}
                            {this.state.days > 16 ?<div>
                                <div className="days state1"><img src={'/imgs/iou/time1.svg'} />
                                    <span>逾期16天</span>
                                    <span className="absolute">计收基础逾期管理费,特殊逾期管理费,罚息*5%
                                    <Tap onTap="" className={this.state.isSide?"com_side_up active":"com_side_up"}>
                                        <img src={'/imgs/credit/side.svg'} /></Tap>
                                    </span>
                                </div>
                                <div className="yuqi">
                                    <span className="yuqi-time">2018-03-03</span>
                                    <div className="overdueRule jixi_rule">
                                        <span>特殊逾期管理费:(逾期本息+罚息+基础逾期管理费)*5%</span>
                                        <span>罚息:（逾期本息*24%/365)*逾期天数</span>
                                    </div>
                                </div>
                            </div>: null}
                            {this.state.days > 30 ?<div>
                                <div className="days state2"><img src={'/imgs/iou/time1.svg'} />
                                    <span>逾期30天</span>
                                    <span className="absolute">计收基础逾期管理费,特殊逾期管理费,罚息*10%<Tap onTap="" className={this.state.isSide?"com_side_up active":"com_side_up"}>
                                        <img src={'/imgs/credit/side.svg'} /></Tap></span>
                                </div>
                                <div className="yuqi none">
                                    <span className="yuqi-time">2018-03-03</span>
                                    <div className="overdueRule jixi_rule">
                                        <span>特殊逾期管理费:(逾期本息+罚息+基础逾期管理费)*10%</span>
                                        <span>罚息:（逾期本息*24%/365)*逾期天数</span>
                                    </div>
                                </div>
                            </div>:null}
                        </div>
                    </div>
                    {/*微信推送*/}
                    <div>
                        <div className="box_ce">
                            {this.state.isWeixin ? <div>
                                <div className="weixin state1"><img src={'/imgs/iou/time2.svg'} />
                                    <span className="boxtime">
                                        2018-02-04
                                        <span>02:00:00</span>
                                    </span>
                                    <span className="jixi marl10">已推送</span>
                                    <span>已向借款人<i>张渺渺</i>推送微信消息请及时关注还款详情</span>
                                </div>
                                <div className="weixin state1"><img src={'/imgs/iou/time2.svg'} />
                                    <span className="boxtime">
                                        2018-02-04
                                        <span>02:00:00</span>
                                    </span>
                                    <span className="jixi marl10">已推送</span>
                                    <span>已向借款人<i>张渺渺</i>推送微信消息请及时关注还款详情</span>
                                </div>
                                <div className="weixin state1"><img src={'/imgs/iou/time2.svg'} />
                                    <span className="boxtime">
                                        2018-02-04
                                        <span>02:00:00</span>
                                    </span>
                                    <span className="jixi marl10">已推送</span>
                                    <span>已向借款人<i>张渺渺</i>推送微信消息请及时关注还款详情</span>
                                </div>
                            </div> : <div className="g_weixin">
                                <img src="/imgs/iou/weixin.png" alt=""/>
                                <span>暂无微信推送记录</span>
                            </div>}
                        </div>
                    </div>
                    {/*短信催收*/}
                    <div>
                        <div className="box_ce">
                            {this.state.isMsg ? <div>
                                {this.state.days > 0 ? <div> 
                                    <div className="days state"><img src={'/imgs/iou/time2.svg'} />
                                        <span>逾期<i className="color_org">1</i>天</span>
                                    </div>
                                    <div className="yuqi">
                                        <span className="yuqi-time">2018-03-03</span>
                                        <span className="jixi marl10">已发送</span>
                                        <span>已发送催收短信至借款人联系人账户</span>
                                    </div>
                                </div> : null}
                                {this.state.days > 16 ? <div>
                                    <div className="days state1"><img src={'/imgs/iou/time1.svg'} />
                                        <span>逾期<i className="color_org">16</i>天</span>
                                    </div>
                                    <div className="yuqi">
                                        <span className="yuqi-time">2018-03-03</span>
                                        <span className="jixi marl10">已发送</span>
                                        <span>已发送催收短信至借款人紧急联系人2个</span>
                                    </div>
                                </div>: null}
                                {this.state.days > 20 ?<div>
                                    <div className="days state1"><img src={'/imgs/iou/time1.svg'} />
                                        <span>逾期<i className="color_org">20</i>天</span>
                                    </div>
                                    <div className="yuqi">
                                        <span className="yuqi-time">2018-03-03</span>
                                        <span className="jixi marl10">已发送</span>
                                        <span>已发送催收短信至借款人通话记录前10名</span>
                                    </div>
                                </div>: null}
                                {this.state.days > 25 ?<div className="gray">
                                    <div className="days state1"><img src={'/imgs/iou/time1.svg'} />
                                        <span>逾期25天</span>
                                    </div>
                                    <div className="yuqi">
                                        <span className="yuqi-time">2018-03-03</span>
                                        <span>发送催收短信至通话记录前11-20名</span>
                                    </div>
                                </div>: null}
                                {this.state.days > 30 ?<div className="gray">
                                    <div className="days state2"><img src={'/imgs/iou/time1.svg'} />
                                        <span>逾期30天</span>
                                    </div>
                                    <div className="yuqi none">
                                        <span className="yuqi-time">2018-03-03</span>
                                        <span>发送催收短信至通话记录前21-40名</span>
                                    </div>
                                </div>:null}
                            </div> : <div className="g_weixin">
                                <img src="/imgs/iou/msg.png" alt=""/>
                                <span>暂无短信催收记录</span>
                            </div>}
                        </div>
                    </div>
                    {/*电话催收记录*/}
                    <div>
                        <div className="box_ce">
                            <div className="detail_list_div">
                                <List  className={this.state.isPhone ? "detail_list phone_list active" : "detail_list phone_list"}>
                                    <List.Item extra={'92天'}>委托剩余天数</List.Item>
                                    <List.Item extra={'4000元'}>催收金额</List.Item>
                                    <List.Item extra={'4000元'}>以偿还金额</List.Item>
                                    <List.Item extra={'30天'}>逾期天数</List.Item>
                                    <List.Item extra={'12%'}>佣金比例</List.Item>
                                    <List.Item extra={'3000元'}>已偿还金额</List.Item>
                                    <List.Item extra={'100元'}>已扣除佣金</List.Item>
                                    <List.Item extra={'5000元'}>待偿还金额</List.Item>
                                    <List.Item extra={'100元'}>预计佣金</List.Item>
                                </List>
                                <div className="com_phone_side">
                                    <Tap className={this.state.isPhone ? "com_phone_side_up active" : "com_phone_side_up"} 
                                        onTap={() => {this.setState({isPhone:!this.state.isPhone})}}>
                                        <img src={'/imgs/credit/side.svg'} />
                                    </Tap>
                                </div> 
                            </div>
                            {this.state.telStatus === 0 ? <div className="g_weixin">
                                <img src="/imgs/iou/tel.png" alt=""/>
                                <span>暂无电话催收记录</span>
                            </div> : null}
                            
                            {this.state.telStatus === 1 ? <div><div className="weixin state1"><img src={'/imgs/iou/time2.svg'} />
                                    <span id="fs12" className="boxtime">
                                        2018-02-04
                                        <span className="fs10">02:00:00</span>
                                    </span>
                                    <span className="jixi marl10">已拨打</span>
                                    <span id="color999">电话催收--拨打本人--接听--预计本周日还款</span>
                                </div>
                                <div className="weixin state1"><img src={'/imgs/iou/time2.svg'} />
                                    <span id="fs12" className="boxtime">
                                        2018-02-04
                                        <span className="fs10">02:00:00</span>
                                    </span>
                                    <span className="jixi marl10">已拨打</span>
                                    <span id="color999">电话催收--拨打本人--接听--预计本周日还款</span>
                                </div>
                            </div> : null}

                            {this.state.telStatus === 2 ? <div><div className="weixin state1"><img src={'/imgs/iou/time4.svg'} />
                                    <span className="boxtime">
                                        2018-02-04
                                        <span>02:00:00</span>
                                    </span>
                                    <span id="bg_blue">已还款</span>
                                    <div className="shenmebuju">
                                        <div>借款人还款金额：1000元</div>
                                        <span>扣除佣金：100元</span>
                                    </div>
                                </div>
                                <div className="weixin state1"><img src={'/imgs/iou/time2.svg'} />
                                    <span id="fs12" className="boxtime">
                                        2018-02-04
                                        <span className="fs10">02:00:00</span>
                                    </span>
                                    <span className="jixi marl10">已拨打</span>
                                    <span id="color999">电话催收--拨打本人--接听--预计本周日还款</span>
                                </div>
                                <div className="weixin state1"><img src={'/imgs/iou/time2.svg'} />
                                    <span id="fs12" className="boxtime">
                                        2018-02-04
                                        <span className="fs10">02:00:00</span>
                                    </span>
                                    <span className="jixi marl10">已拨打</span>
                                    <span id="color999">电话催收--拨打本人--接听--预计本周日还款</span>
                                </div>
                            </div> : null}

                            {this.state.telStatus === 3 ? <div>
                                <div className="weixin state1"><img className="pic12" src={'/imgs/iou/checkbox-bg-blue.svg'} />
                                    <span className="boxtime">
                                        2018-12-27
                                        <span>02:00:00</span>
                                    </span>
                                    <span className="last-blue">全部催收金额已催回，保证金已退回</span>
                                </div>
                                <div className="weixin state1"><img src={'/imgs/iou/time2.svg'} />
                                    <span className="boxtime">
                                        2018-02-04
                                        <span>02:00:00</span>
                                    </span>
                                    <span id="bg_blue">已还款</span>
                                    <div className="shenmebuju">
                                        <div>借款人还款金额：1000元</div>
                                        <span>扣除佣金：100元</span>
                                    </div>
                                </div>
                                <div className="weixin state1"><img src={'/imgs/iou/time2.svg'} />
                                    <span className="boxtime">
                                        2018-02-04
                                        <span>02:00:00</span>
                                    </span>
                                    <span className="jixi marl10">已拨打</span>
                                    <span id="color999">电话催收--拨打本人--接听--预计本周日还款</span>
                                </div>
                            </div> : null}
                            {this.state.telStatus === 4 ? <div>
                                <div className="weixin state1"><img className="pic12" src={'/imgs/iou/checkbox-bg-blue.svg'} />
                                    <span className="boxtime">
                                        2018-12-27
                                        <span>02:00:00</span>
                                    </span>
                                    <span className="last-blue">催收委托已到期，保证金已退回</span>
                                </div>
                                <div className="weixin state1"><img src={'/imgs/iou/time2.svg'} />
                                    <span className="boxtime">
                                        2018-02-04
                                        <span>02:00:00</span>
                                    </span>
                                    <span id="bg_blue">已还款</span>
                                    <div className="shenmebuju">
                                        <div>借款人还款金额：1000元</div>
                                        <span>扣除佣金：100元</span>
                                    </div>
                                </div>
                                <div className="weixin state1"><img src={'/imgs/iou/time2.svg'} />
                                    <span className="boxtime">
                                        2018-02-04
                                        <span>02:00:00</span>
                                    </span>
                                    <span className="jixi marl10">已拨打</span>
                                    <span id="color999">电话催收--拨打本人--接听--预计本周日还款</span>
                                </div>
                                <div className="weixin state1"><img src={'/imgs/iou/time2.svg'} />
                                    <span className="boxtime">
                                        2018-02-04
                                        <span>02:00:00</span>
                                    </span>
                                    <span className="jixi marl10">已拨打</span>
                                    <span id="color999">电话催收--拨打本人--接听--预计本周日还款</span>
                                </div>
                            </div> : null}
                            {this.state.telStatus === 5 ? <div>
                                <div className="weixin state1 border_blue"><img className="pic12" src={'/imgs/iou/time3.svg'} />
                                    <span className="boxtime">
                                        2018-12-27
                                        <span>02:00:00</span>
                                    </span>
                                    <span className="last-blue">催收委托已停催，保证金已退回</span>
                                </div>
                                <div className="weixin state1"><img src={'/imgs/iou/time4.svg'} />
                                    <span className="boxtime">
                                        2018-02-04
                                        <span>02:00:00</span>
                                    </span>
                                    <span id="bg_blue">已还款</span>
                                    <div className="shenmebuju">
                                        <div>借款人还款金额：1000元</div>
                                        <span>扣除佣金：100元</span>
                                    </div>
                                </div>
                                <div className="weixin state1"><img src={'/imgs/iou/time2.svg'} />
                                    <span className="boxtime">
                                        2018-02-04
                                        <span>02:00:00</span>
                                    </span>
                                    <span className="jixi marl10">已拨打</span>
                                    <span id="color999">电话催收--拨打本人--接听--预计本周日还款</span>
                                </div>
                            </div> : null}
                            {this.state.telStatus === 6 ? <div>
                                <div className="weixin state1 border_blue"><img className="pic12" src={'/imgs/iou/checkbox-bg-blue.svg'} />
                                    <span className="boxtime">
                                        2018-12-27
                                        <span>02:00:00</span>
                                    </span>
                                    <div className="last-blue">
                                        <div>催收委托已停催</div>
                                        <div className="g_tishi">经平台核实有违约行为，扣除保证金</div>
                                    </div>
                                </div>
                                <div className="weixin state1"><img src={'/imgs/iou/time4.svg'} />
                                    <span className="boxtime">
                                        2018-02-04
                                        <span>02:00:00</span>
                                    </span>
                                    <span id="bg_blue">已还款</span>
                                    <div className="shenmebuju">
                                        <div>借款人还款金额：1000元</div>
                                        <span>扣除佣金：100元</span>
                                    </div>
                                </div>
                                <div className="weixin state1"><img src={'/imgs/iou/time2.svg'} />
                                    <span className="boxtime">
                                        2018-02-04
                                        <span>02:00:00</span>
                                    </span>
                                    <span className="jixi marl10">已拨打</span>
                                    <span id="color999">电话催收--拨打本人--接听--预计本周日还款</span>
                                </div>
                            </div> : null}
                        </div>
                    </div>
                </Tabs>

			</div>
		)
	}
}
