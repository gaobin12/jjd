
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
		document.title = "添加好友";
		super(props, context)
		this.state = {
			switchIndex: 1,
			list:{}
		};
	}

	componentDidMount() {
        this.autoFocusInst.inputRef.focus();
	}

	// 输入手机号触发
    onChange = (telephone) => {
        var regValid = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
        if (regValid.test(telephone)) {
            this.setState({
                isSearch: true
            })
            this.searchFriend(telephone);
        } else {
            this.setState({
                isSearch: false,
                isAdd: false,
                data: null
            })
        }
    }
	// 根据手机号搜索好友
    searchFriend = (telephone) => {
        $.ajaxE({
            type: 'GET',
            url: '/user/friend/searchFriend',
            data: {
                telephone: telephone
            }
        }).then((data) => {
            this.setState({
                data
            })
        }).catch((msg) => {
            console.log(msg);
        })
    }
    // 发送好友请求
    sendFriendRequest = () => {
        Loading.show();
        $.ajaxE({
            type: 'POST',
            url: '/user/friend/sendFriendRequest',
            data: {
                telephone: this.state.data.telephone,
                source: 0,
            }
        }).then(() => {
            this.autoFocusInst.inputRef.blur();
            this.setState({
                isAdd: true
            })
            Modal.alertX('提醒', '已成功发送您的好友请求，请耐心等待', [
                { text: '知道了', onPress: () => {history.back()} },
            ])
        }).catch((msg) => {
            Modal.infoX(msg);
		}).finally(()=>{
			Loading.hide();
		})
    }

	render() {
		const { data, } = this.state;
		return (
		<div className="view-friend view-friend-add">
			<SearchBar placeholder="搜索手机号或者添加好友" maxLength={11} ref={ref => this.autoFocusInst = ref} onChange={this.onChange} />
			{data?data.isExist ?<List className='friend-list'>
				<Item align="top" 
					extra = {data.isFriend?<Tap className='com-btn-border-color'>已添加</Tap>:<Tap className='com-btn-grandual' onTap={this.sendFriendRequest}>添加</Tap>}
					thumb={data.avatarUrl||data.fullName&&data.fullName[0]} multipleLine>
					{data.fullName}
					<Brief>{data.telephone}</Brief>
				</Item>
			</List>:
			<div className='common-no-data'>
				用户不存在
			</div>
			:null}
		</div>
		)
	}
}