import React, { Component } from "react";

import { Accordion, List } from 'antd-mobile';


// 引入样式
import '../form.less';
import "./index.less";
export default class Feedback extends Component {
	constructor(props) {
		// 设置标题
		document.title = "反馈借款人信息";
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
				<div id='g_feedback'>
					<form action="demo_form.asp" id="usrform">
						<Accordion className="my-accordion" onChange={this.onChange}>
							<Accordion.Panel className="title" header={ item.title }>
								<List className="my-list">
									{item.isRegion ? item.list.map((v, i) => (<List.Item className="addSelect">
										<div className="textarea_title">{ v.sub_title }</div>
										<textarea className="textarea" name="comment" form="usrform" placeholder='请在此处输入文本...'></textarea>
									</List.Item>)) 
									: item.list.map((v, i) => (<List.Item>
										<span>{ v.sub_title }</span>
										<input type="text" placeholder={ v.sub_title }/>
									</List.Item>))}
								</List>
							</Accordion.Panel>
						</Accordion>
					</form>
				</div>
			)
		})
	}
	render() {
		return (
			<div className="g_feedOuter">
				{ this.createList() }
			</div>
		)
	}
}
Feedback.defaultProps = {
	data: [
		{
			title: "基本信息",
			isRegion: false,
			list: [
				{
					sub_title: "手机号码",
				},
				{
					sub_title: "座机号码",
				}
			]
		},
		{
			title: "家庭信息",
			isRegion: false,
			list: [
				{
					sub_title: "家庭地址",
				},
				{
					sub_title: "家庭成员数",
				},
				{
					sub_title: "父亲姓名",
				},
				{
					sub_title: "父亲手机",
				},
				{
					sub_title: "母亲姓名",
				},
				{
					sub_title: "母亲手机",
				},
				{
					sub_title: "配偶姓名",
				},
				{
					sub_title: "配偶手机",
				}
			]
		},
		{
			title: "公司信息",
			isRegion: false,
			list: [
				{
					sub_title: "公司名称",
				},
				{
					sub_title: "所属部门",
				},
				{
					sub_title: "职位",
				},
				{
					sub_title: "公司地址",
				},
				{
					sub_title: "公司电话",
				}
			]
		},
		{
			title: "财产信息",
			isRegion: true,
			list: [
				{
					sub_title: "公司名称",
				},
				{
					sub_title: "所属部门",
				}
			]
		},
		{
			title: "人脉信息",
			isRegion: false,
			list: [
				{
					sub_title: "联系人1",
				},
				{
					sub_title: "关系",
				},
				{
					sub_title: "手机",
				},
				{
					sub_title: "联系人2",
				},
				{
					sub_title: "关系",
				},
				{
					sub_title: "手机",
				},
				{
					sub_title: "联系人3",
				},
				{
					sub_title: "关系",
				},
				{
					sub_title: "手机",
				}
			]
		},
		{
			title: "网络信息",
			list: [
				{
					sub_title: "微信号",
				},
				{
					sub_title: "微博主页",
				},
				{
					sub_title: "微博号",
				},
				{
					sub_title: "QQ号",
				},
				{
					sub_title: "支付宝号",
				}
			]
		},
		{
			title: "其他信息",
			isRegion: true,
			list: [
				{
					sub_title: ""
				}
			]
		}
	]
}