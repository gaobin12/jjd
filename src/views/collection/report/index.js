import React, { Component } from "react";
import { Link,withRouter } from 'react-router-dom'

// 引入样式
import '../form.less';
export default class Feedback extends Component {
	constructor(props) {
		// 设置标题
		document.title = "举报信材料";
		super(props);
		// 定义状态数据
		this.state = {

		}
	}
	onChange = (key) => {
		console.log(key);
	}
	createList() {
		return this.props.data.map((item, index) => {
			return (
				<Link to={ '/collection/report' + index }>
					<div className="g_item" key={item.id} onClick={() => {console.log(item.id)}}>
						<span>{item.title}</span>
						<img src="/imgs/iou/more.png" alt=""/>
					</div>
				</Link>
			)
		})
	}
	render() {
		return (
			<div className='civil'>
				{ this.createList() }
			</div>
		)
	}
}
Feedback.defaultProps = {
	data: [
		{	
			id: "1",
			title: "举报信模板"
		}
	]
}