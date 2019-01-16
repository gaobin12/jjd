import React, { Component } from "react";
import { Link,withRouter } from 'react-router-dom'
// 引入样式
import '../form.less';
export default class Feedback extends Component {
	constructor(props) {
		// 设置标题
		document.title = "民事诉讼材料";
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
				<Link to={'/collection/civil' + item.id }>
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
			title: "借款协议 (如需下载建议彩印)"
		},
		{	
			id: "2",
			title: "身份凭证（如需下载建议彩印）"
		},
		{	
			id: "3",
			title: "财产保全申请书"
		},
		{	
			id: "4",
			title: "出借人注册信息"
		},
		{	
			id: "5",
			title: "借款记录"
		},
		{	
			id: "6",
			title: "还款明细"
		},
		{	
			id: "7",
			title: "债务诉讼流程"
		},
		{	
			id: "8",
			title: "民事起诉书"
		},
		{	
			id: "9",
			title: "民事起诉书空模板"
		}
		
	]
}