
//主页 => 好友
import '../common.less'
import './index.less'
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { List,SearchBar } from 'antd-mobile'
import { Tap } from 'COMPONENT'
import { Loading, Modal } from 'SERVICE'

const Item = List.Item
const Brief = Item.Brief

@withRouter
@inject('userStore','friendStore')
@observer
export default class Page extends Component {
	constructor(props, context) {
		document.title = "共同好友";
		super(props, context)
		this.state = {
			switchIndex: 1,
			list:[]
		};
	}

	componentDidMount() {
		this.getMyFriend();
	}

	// 获取我的好友列表
	getMyFriend = () => {
        Loading.show();
		$.ajaxE({
            type: 'GET',
            url: '/user/friend/getMyFriend',
            data: {}
		}).then((data) => {
		}).catch((msg) => {
            Modal.infoX(msg);
		}).finally(()=>{
			Loading.hide();
		})
	}
	onSearch=(v)=>{
		const { friendStore } = this.props;

	}

	render() {
		const { switchIndex } = this.state;
		return (
		<div className="view-friend view-friend-common">
			<SearchBar placeholder="搜索手机号或者添加好友" maxLength={11} onChange={this.onSearch} />
			<List>
				<Item align="top" thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine>
					琚城
					<Brief>13623563562</Brief>
				</Item>
				<Item align="top" thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine>
					琚城
					<Brief>13623563562</Brief>
				</Item>
				<Item align="top" thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine>
					琚城
					<Brief>13623563562</Brief>
				</Item>
			</List>
		</div>
		)
	}
}