import React, { Component } from 'react';
import { findDOMNode } from "react-dom";
// 引入样式
import "./index.less";
export default class Evidence extends Component {
	constructor(props) {
		// 定义标题
		document.title = "下载证据";
		super(props);
		// 定义状态数据
		this.state = {
			isChoose: [false, true, true]
		}
	}
	chooseItem(idx) {
		let arr = new Array(3).fill(true);
		this.state.isChoose.forEach(function(item, index) {
			item = true;
		})
		arr[idx] = false;
		this.setState({isChoose: arr})
	}
	createList() {
		return this.props.data.map((item, index) => (<div key={index} className="item_list inner" 
			onClick={ () => { this.chooseItem(index) } }> 
			<img className="circle" src={this.state.isChoose[index] ? item.circle_default : item.circle_active} alt=""/>
			<img className="download" src={this.state.isChoose[index] ? item.load_default : item.load_active} alt=""/>
			<div className="need_text">
				<div>{item.title}</div>
				<span className="sub_title">{item.sub_title}</span>
			</div>
			<img className="arrow" src="/imgs/pay/arrow-r.svg" alt=""/>
		</div>))
	}
	render() {
		return (
			<div>
				{this.createList()}
				<div className="choose inner">请您选择以下任意方式下载材料</div>
				<div className="btn">
					<div className="copy" onClick={() => {}}>复制下载链接</div>
					<div className="email" onClick={() => {}}>一键发送邮箱</div>
				</div>
			</div>
		)
	}
	componentDidMount() {
	}
} 

Evidence.defaultProps = {
	data: [
		{
			title: "民事诉讼材料",
			sub_title: "诉讼材料_TJD201804131706076770443",
			circle_default: "/imgs/iou/default.svg",
			circle_active: "/imgs/iou/active.svg",
			load_default: "imgs/iou/load_default.svg",
			load_active: "imgs/iou/load_active.svg"
		},
		{
			title: "仲裁申请材料",
			sub_title: "仲裁材料_TJD201804131706076770443",
			circle_default: "/imgs/iou/default.svg",
			circle_active: "/imgs/iou/active.svg",
			load_default: "imgs/iou/load_default.svg",
			load_active: "imgs/iou/load_active.svg"
		},
		{
			title: "举报信材料",
			sub_title: "举报材料_TJD201804131706076770443",
			circle_default: "/imgs/iou/default.svg",
			circle_active: "/imgs/iou/active.svg",
			load_default: "imgs/iou/load_default.svg",
			load_active: "imgs/iou/load_active.svg"
		}
	]
}