
//设置
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { List, Toast } from 'antd-mobile'
import { Loading, Modal } from 'SERVICE'

const Item = List.Item;
@withRouter
@inject('userStore')
@observer
export default class App extends Component {
	constructor(props, context) {
		document.title = "设置";
		super(props, context)
		this.state = {
		};
	}
	componentDidMount(){
	}
	
    //退出登录
    quitBack=()=>{
		sessionStorage.clear();
		document.cookie = "";
        $.ajaxE({
			type: 'GET',
			url: '/user/passport/loginOut',
			data: {}
		}).then((data) => {
            this.props.history.push({
                pathname: '/',
            });
		}).catch((msg) => {
			console.log(msg)
		})
    }

	onLink=(url)=>{
        const { userStore } = this.props;
        let _this=this;
        if(userStore.creditInfo.idCardStatus){
            if(url=='/setting/change_trade_pwd'){
                _this.props.history.push({
                    pathname: url,
                    query: { pathname: '/setting/phone_code' }
                });
            }
            if(url=="/user/input_valid"){
                _this.props.history.push({
                    pathname: url,
				    query: { pathname: '/setting/change_phone' }
                });
            }
        }else{
            Modal.infoX('您还没有身份认证，去认证',()=>{
                _this.props.history.push({
                    pathname: '/user/id_auth',
                    query:{
                        pathType:2,
                    } 
                });
            });
        }
        
    }
    onLinks=(url)=>{
        let _this=this;
        if(url=='/user/id_auth'){
            _this.props.history.push({
                pathname: url,
                query:{
                    pathType:2,
                } 
            })
        }else if(url=='/setting/about'){
            _this.props.history.push({
                pathname: url
            })
        }
        else if(url=="/setting/valid/1"){
            _this.props.history.push({
                pathname: url
            })
        }
        
    }

	render() {
        const { userStore } = this.props;
		return (
			<div className='view-setting'>
				<List className="my-list">
                    <Item arrow="horizontal" extra={userStore.creditInfo.idCardStatus? "" : "实名后可更换"} 
                    onClick={() => {this.onLink('/user/input_valid') }}>
						更换手机号码
					</Item>
					<Item arrow="horizontal" onClick={() => { this.onLinks('/setting/valid/1') }}>
						修改登录密码
					</Item>
                    {userStore.creditInfo.passwordStatus?<Item arrow="horizontal"  
                    onClick={() => { this.onLink('/setting/change_trade_pwd') }}>
						修改交易密码
                    </Item>:<Item arrow="horizontal"  onClick={() => { this.onLinks('/user/id_auth') }}
                     extra={userStore.creditInfo.idCardStatus? "" : "实名后可设置"} > 
						设置交易密码
                    </Item>}
				</List>

				<List renderHeader={() => ''} className="my-list">
					{/* <Item arrow="horizontal" onClick={() => { this.onLinks('/setting/update_history') }}>
						版本介绍
					</Item> */}
					<Item arrow="horizontal" onClick={() => { this.onLinks('/setting/about') }}>
						关于我们
					</Item>
                    {$.isWeiXin?null:<Item arrow="horizontal" onClick={() => { this.quitBack() }}>
						退出登录
					</Item>}
				</List>
			</div>
		)
	}
}
