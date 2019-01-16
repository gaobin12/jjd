//发起销帐 => 发起成功
import '../form.less'
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { Tap, } from 'COMPONENT'
import { List,Flex  } from 'antd-mobile'

@withRouter
export default class App extends Component {
	constructor(props, context) {
		document.title = "发起成功";
		super(props, context)
		
		let { query } = this.props.location;
		// const ssData = $.getItem('pre_state');

		this.state = {
            // needConfirm: ssData.needConfirm,//是否需要确认销账
			// id:query.id,
			// //借款人
			// borrowerName: ssData.borrowerName,
			// //销账金额
			// chargeOffMoney: ssData.chargeOffMoney,
			// //借款人手机号
            // borrowerTel: ssData.tel,
            

            needConfirm: false,//是否需要确认销账
			id:"11",
			//借款人
			borrowerName: '111',
			//销账金额
			chargeOffMoney: 11,
			//借款人手机号
            borrowerTel: '17600130292',
            
			//剩余确认时长
            restTime: this.getLeftTime()
		};
	}
	componentDidMount() {
		//this.getPageInfo();
	}

	//获取今天剩下的时间
	getLeftTime=()=>{
		let now = new Date();
		let h = 23 - now.getHours();
		let m = 59 - now.getMinutes();
		return {h,m}
	}

	render() {
		return (
		<div className='begin_success view-form'>
            {!this.state.needConfirm?<div style={{height: '100%',overflow:'auto'}}>		
                <img src={'/imgs/iou/off-succ.svg'} className="succ-img" />
                <p className="off-money">{this.state.chargeOffMoney/100}<span>元</span></p>
                <p className="off-tit">已完成对出款人的销账</p>
                <p className="off-font">您对应的待收款相应的减少{this.state.chargeOffMoney/100}元，<br/>平台不再对销款项进行催收</p>
            </div>:<div style={{height: '100%',overflow:'auto'}}>		
                <img src={'/imgs/iou/begin-succ.svg'} className="succ-img" />
                <p className="off-money">{this.state.chargeOffMoney/100}<span>元</span></p>
                <p className="off-tit">已向借款人{this.state.borrowerName}发起了销账</p>
                <Flex className="succ-table-flex" justify="between">
                    <Flex.Item className="font14">剩余确认时长</Flex.Item>
                    <Flex.Item className="font14">{this.state.restTime.h}小时{this.state.restTime.m}分钟</Flex.Item>
                </Flex>
                <Flex className="succ-table-flex" justify="between">
                    <Flex.Item className="font14">联系借款人</Flex.Item>
                    <Flex.Item className="font14">{this.state.borrowerTel}</Flex.Item>
                </Flex>
            </div>}
            <div className='common-btn_box'>
                <Tap className='c-black span font16 active' onTap={()=>{history.go(-2) }} >完成</Tap>
            </div>
		</div>
		)
	}
}