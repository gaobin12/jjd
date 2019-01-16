
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'

@withRouter
export default class Page extends Component {
	
	constructor(props, context) {
		document.title = "邀请有礼";
		super(props, context)
		this.state = {
		};
	}
	render() {
		return (
			<div className="view-user-invite">
				<div className="top-img">
					<img src={'/imgs/com/why-top.png'} alt="" />
				</div>

				<div className="my-code">
					<div className="title">
						我的邀请码
                	{/* <div>活动规则
                    	<i className="rightB"></i>
					</div> */}
					</div>
					<div className="code">
						<span>1</span>
						<span>3</span>
						<span>7</span>
						<span>1</span>
						<span>8</span>
						<span>1</span>
						<span>2</span>
						<span>1</span>
						<span>2</span>
						<span>3</span>
						<span>4</span>
					</div>
				</div>

				<div className="activity-info">
					<div className="row1">
						<div>
							活动时间
                	</div>
						<div>
							2018.04.04至2018.05.04
                	</div>
					</div>
					<div className="row1">
						<div>
							活动范围
                	</div>
						<div>
							微合约注册用户
                	</div>
					</div>
					<div className="row1">
						<div>
							活动规则
                    	<img src={'/imgs/com/why-money.png'} alt="" />
						</div>
						<div>
							邀请出借人注册微合约，被邀请者每出借一次，邀请者与被邀请者都可以得到现金奖励，满100元可提现至微信钱包
					</div>
					</div>
					<span className="red"></span>
					<span className="red r"></span>
				</div>

				<div className="liucheng-title">
					活动流程
        	</div>

				<div className="img-text-list">
					<div className="one">
						<div className="number">1</div>
						<img className="phone" src={'/imgs/com/why-phone.png'} alt="" />
						<div className="btn">
							邀请注册
					</div>
					</div>
					<div className="one">
						<div className="number">2</div>
						<img className="jietiao" src={'/imgs/com/why-jietiao.png'} alt="" />
						<div className="btn">
							打借条
					</div>
					</div>
					<div className="one">
						<div className="number">3</div>
						<img className="jiangli" src={'/imgs/com/why-jiangli.png'} alt="" />
						<div className="btn">
							获得奖励
					</div>
					</div>
				</div>

				<div className="text-box">
					<p>
						<span>1</span>被邀请者通过邀请码/二维码/链接注册微合约
            	</p>
					<p>
						<span>2</span>被邀请者在微合约以出借人身份打借条
            	</p>
					<p>
						<span>3</span>被邀请者注册后的一个月内，只要被邀请者生成 一张借条，被邀请者就可以收到3块钱的现金奖励; 被邀请者注册后的一年内，只要被邀请者生成一张借 条，邀请者就可以收到1块钱的现金奖励
            	</p>
					<div>
						微合约可以根据本活动的实际情况对活动规则进行调整<br />
						相关调整将公布在活动页上，并于公布时即时生效
            	</div>
				</div>

				<button className="mashang-yaoqing">
					马上注册
        	</button>

			</div>
		)
	}
}
