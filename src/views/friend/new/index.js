
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
        document.title = "新的好友"
        super(props, context)
        this.state = {
            data: null,
            //搜索
            searchWord: null,
            searchList: {}
        };
    }

    componentDidMount() {
        this.getFriendRequestList();
    }

    // 获取好友请求列表
    getFriendRequestList = () => {
        Loading.show();
        $.ajaxE( {
            type: 'GET',
            url: '/user/friend/getFriendRequestList',
            data: {}
        }).then((data) => {
            data.map((ele, index) => {
                ele.status = 0
            })
            this.setState({
                data
            })
        }).catch((msg) => {
            Modal.infoX(msg);
		}).finally(()=>{
			Loading.hide();
		})
    }

    // 根据手机号搜索好友
    searchFriend = (v) => {
        if (v.length) {
            let { data, searchList } = this.state;
            searchList = data.filter((Item) => {
                return item.telephone.indexOf(v) != -1 || (item.fullName ? item.fullName.indexOf(v) != -1 : false);
            })
            this.setState({
                searchWord: v,
                searchList
            })
        } else {
            this.setState({
                searchWord: null,
                searchList: {}
            })
        }
    }

    // 输入手机号触发
    onChange = (v) => {
        this.searchFriend(v);
    }

    // 处理好友请求
    handleFriendRequest = (friendUser, state, index) => {
        Loading.show();
        $.ajaxE({
            type: 'POST',
            url: '/user/friend/handleFriendRequest',
            data: {
                "friendUserId": friendUser.uid,
                "state": state
            }
        }).then(() => {
            this.state.data[index].status = state
            this.setState({
                data: this.state.data
            })
        }).catch((msg) => {
            Modal.infoX(msg);
		}).finally(()=>{
			Loading.hide();
		})
    }

    render() {
        let { data, searchList, searchWord } = this.state;
        let dataList = null;
        if(searchWord){
            dataList = searchList;
        }else{
            dataList = data;
        }
        return (
            <div className='view-friend view-friend-new'>
                <SearchBar placeholder="搜索手机号或姓名" maxLength={11} onChange={this.onChange} />
                {dataList && dataList.length ?
                    dataList.map((ele, index) => {
                        return (
                        <List className='friend-list'>
                            <Item align="top" 
                                extra = {ele.status === 0?(<span className='flex-box'><Tap className='com-btn-grandual' onTap={() => this.handleFriendRequest(ele, 1, index)}>接受</Tap><Tap className='com-btn-border-color' onTap={() => this.handleFriendRequest(ele, 2, index)}>忽略</Tap></span>):
                                <Tap className='com-btn-border-color'>{ele.status === 1 ?'已接受':'已忽略'}</Tap>}
                                thumb={ele.avatarUrl||ele.fullName&&ele.fullName[0]} multipleLine>
                                {ele.fullName}
                                <Brief>{ele.telephone}</Brief>
                            </Item>
                        </List>
                        )
                    })
                    : <div className='common-no-data'>
						暂无
					</div>}
            </div>
        )
    }
}