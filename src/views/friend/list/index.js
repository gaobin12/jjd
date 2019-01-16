
//主页 => 好友
import '../common.less'
import './index.less'
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { SearchBar } from 'antd-mobile'
import { Tap, List, } from 'COMPONENT'
import { Loading, Modal } from 'SERVICE'

const Item = List.Item
const Brief = Item.Brief

@withRouter
@inject('userStore','friendStore')
@observer
export default class Page extends Component {
	constructor(props, context) {
		document.title = "好友列表";
		super(props, context)
		this.state = {
			switchIndex: 1,
			list:{},
			requestCnt: 0,//好友请求
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
			this.setState({
                requestCnt: data.requestCnt,
				list: data.friendList
			})
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
		const { requestCnt, list, } = this.state;
		return (
		<div className="view-friend view-friend-list">
			<SearchBar placeholder="搜索手机号或者添加好友" maxLength={11} onChange={this.onSearch} />
			<List className='handle-top'>
				<Item extra={requestCnt?requestCnt:null} thumb="imgs/friend/new.png" arrow="horizontal" onClick={() => {this.props.history.push({pathname: '/friend/new'})}}>新的好友</Item>
				<Item thumb="imgs/friend/add.png" arrow="horizontal" onClick={() => {this.props.history.push({pathname: '/friend/add'})}}>添加好友</Item>
			</List>
			{Object.keys(list).map(key=>{
				if(list[key].length){
					return <List className='friend-list'>
					{list[key].map((item,index)=>{
						return <Item align="top" thumb={item.avatarUrl||item.fullName&&item.fullName[0]} multipleLine>
							{item.fullName}
							<Brief>{item.telephone}</Brief>
						</Item>
					})}
					</List>
				}
			})}
		</div>
		)
	}
}