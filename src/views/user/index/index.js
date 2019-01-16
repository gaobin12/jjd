
import './index.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { List } from 'antd-mobile'
import { Tap, Tips } from 'COMPONENT'

@withRouter
export default class page extends Component {
	constructor(props, context) {
		document.title = "个人信息"
		super(props, context)
		this.state = {
            //userId:$.getUserInfo().userId,
            bankLength:'',
            data:'',
            score:'',//风险测评结果
		};
	}

	componentDidMount() {
	}

	checkCredit = () => {
		$.ajaxE({
			type: 'GET',
			url: '/user/my/checkCredit',
		}).then((data) => {
            let bankLength = 0;
            if(data.userBindBanks&&data.userBindBanks.length){
                data.userBindBanks.forEach(function(element) {
                    if(element.validState)bankLength++
                }, this);
                
            }
            // 0 认证失效，2认证中 
			this.setState({
                data:data,
				bankLength
			})
		}).catch((msg) => {
			console.log(msg)
		})
    }
    gotoPage=(v)=>{
        if(v=='credit'){
            this.props.history.push({
                pathname: '/credit/report_simple',
                query:{
                    userId:this.state.userId
                }
            })
        }
        if(v=='bank'){
            this.props.history.push({
                pathname: '/card',
            })
        }
        if(v=='risk'){
            this.props.history.push({
                pathname: '/user/risk',
            })
        }
    }
    // 获取风险测评分数
    riskReult=()=>{
        let that = this
        $.ajaxE({
            type: 'GET',
            url: '/user/my/getRisk',
            data: {}
        }).then((data) => {
            let num = data.score
            if (num <= 22 && num>=0) {
                this.setState({
                    score:'保守型'
                })
                
            } else if (num > 22 && num <= 44) {
                 this.setState({
                     score:'稳健型'
                })
                
            } else if (num > 44 && num <= 66) {
                 this.setState({
                     score:'平衡性'
                })
            } else if (num > 66 && num <= 88) {
                 this.setState({
                     score:'积极性'
                })
            } else if (num > 88) {
                 this.setState({
                     score:'激进性'
                })
            }

        }).catch((msg) => {
            console.log(msg)
        })
       
    }


	render() {
		return (
			<div className="view-user-index">
                <List renderHeader={() => ''}>
                    <List.Item extra={'extra content'}>Title</List.Item>
                </List>
                <List renderHeader={() => ''}>
                    <List.Item extra={'extra content'}>Title</List.Item>
                </List>
                <List renderHeader={() => ''}>
                    <List.Item extra={'extra content'}>Title</List.Item>
                </List>
                <List renderHeader={() => ''}>
                    <List.Item extra={'extra content'}>Title</List.Item>
                </List>
                <List renderHeader={() => ''}>
                    <List.Item extra={'extra content'}>Title</List.Item>
                </List>
			</div>
		)
	}
}
