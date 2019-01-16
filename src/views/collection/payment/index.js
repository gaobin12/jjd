import React, { Component } from "react";
// 引入样式
import "./index.less";
export default class payment extends Component {
	constructor(props) {
		// 设置标题
		document.title = "支付成功";
		super(props);
		// 定义状态数据
		this.state = {

		}
	}
	render() {
		return (
			<div className="g_payment">
				<img src="/imgs/iou/loan-success.svg" alt=""/>
				<h2>100.00<i className="yuan">元</i></h2>
				<h3>付款成功</h3>
				<div className="describe">
					<div>您申请的电话催收已受理，</div>
					<div>您也可以通过反馈借款人信息操作来提高催收成功率</div>
				</div>
				<div className="btn" onClick={ () => {} }>反馈借款人信息</div>
			</div>
		)
	}
}