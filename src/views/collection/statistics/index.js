import React, { Component } from 'react';
// 引入样式
import './index.less';
export default class Statistics extends Component {
	constructor(props) {
		document.title = "提醒统计";
		super(props);
		this.state = {
			// len: this.props.data.length
		}
	}
	createList() {
		return this.props.data.map((item, index) => {
			return (
				<div className="item">
					<div className="item-header">
						<div className="item-left">{ item.time }</div>
						<div className="item-right">提醒借条<span>{ item.num }</span>张</div>
					</div>
					<div className="detail">
						<span>拨打电话<i>{ item.boda }</i>次，</span>
						<span>短信通知<i>{ item.msg }</i>条，</span>
						<span>接通<i>{ item.pass }</i>次</span>
					</div>
				</div>
			)
		})
	}
	render() {
		return (
			<div className="statistics">
				{ this.createList() }
			</div>
		)
	}
} 

Statistics.defaultProps = {
	data: [
		{
			time: '18/06/01',
			num: 4,
			msg: 2,
			boda: 5,
			pass: 3
		},{
			time: '18/07/01',
			num: 4,
			msg: 7,
			boda: 5,
			pass: 3
		},{
			time: '18/08/01',
			num: 4,
			msg: 2,
			boda: 5,
			pass: 4
		}
	]
}
