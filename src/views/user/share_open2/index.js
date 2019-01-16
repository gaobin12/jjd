
//用户扫完分享二维码=>分享打开页面
import './index.less'
import '../share_open/index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { List, Button } from 'antd-mobile'

const Item = List.Item;

@withRouter
export default class App extends Component {
	constructor(props, context) {
		document.title = "分享打开页面";
		super(props, context)

		this.state = {
			applyCount: 1,//申请人数
			passRate: 4,//申请率
			dealHour: 1,//处理时间

			lendAmt: 1000,//放贷金额
			lendTm: 5,//放贷时间
			interestRate:4,//年利率
			service_fee:100,//服务费
			name: '',//出借人名字
			telephone: $.getUserInfo().telephone,//手机号
		};
	}

	componentDidMount() {

	}



	render() {
		return (
			<div className='view-share-open view-share-open2'>

				{/* 头部 */}
				<div className="share_top">
					<img src="/imgs/com/logo.png" alt="" className="logo1" />
					<img src="/imgs/com/slogan.png" alt="" className="logo2" />
				</div>
				{/* 借款内容 */}

				<List className="con-loan">
					<Item className="txt-item">
						<div className="icon">
							<img src={'/imgs/com/default_icon.svg'} alt="" className="logo1" />
						</div>
						<ul>
							<li>{this.state.applyCount}人申请</li>
							<li>{this.state.passRate}%通过</li>
							<li>{this.state.dealHour}小时处理</li>
						</ul>
					</Item>
					<Item className="txt-item2 pdtb10">
						<div className="i-lef">
							<div className="top">{this.state.lendAmt}元</div>
							<div className="bot">单笔出借额度</div>
						</div>
						<div className="i-rig">
							<div className="top">{this.state.lendTm}天</div>
							<div className="bot">借款时长</div>
						</div>
					</Item>
					<Item className="txt-item2 txt-item3">
						<div className="i-lef">
							<div className="bot">年利率
								<span className="colorff9900">{this.state.interestRate}</span>
							%</div>
						</div>
						<div className="i-rig">
							<div className="bot">服务费
							<span className="colorff9900">{this.state.service_fee}</span>
							元</div>
						</div>
					</Item>

				</List>



				{/* 说明文字 */}
				<div className="exp-txt">
					<p className="title">
						今借到是一个基于大数据征信服务的金融科技 SaaS 平台，依托微信社交平台，通过信用大数据风控和立体催收系统，帮助出借人获客、风控、交易和催收，从而提高借贷效率。目前主要提供求借款、补借条、查信用和去出借四大功能。
					</p>
					<List className="con-txt">
						<Item className="txt-item">
							<div className="icon">
								<img src="/imgs/com/shareOnce1.png" alt="" className="logo1" />
							</div>
							<ul>
								<li>方便</li>
								<li>使用方便，无需下载。</li>
								<li>微信关注公众号即可。</li>
							</ul>
						</Item>
						<Item className="txt-item">
							<div className="icon">
								<img src="/imgs/com/shareOnce2.png" alt="" className="logo1" />
							</div>
							<ul>
								<li>快速</li>
								<li>求借款、补借条、申请借款。</li>
								<li>多种借款姿势想怎么借就怎么借。</li>
							</ul>
						</Item>
						<Item className="txt-item">
							<div className="icon">
								<img src="/imgs/com/shareOnce3.png" alt="" className="logo1" />
							</div>
							<ul>
								<li>安全</li>
								<li>实名认证、信用报告、电子合同、第三方支付。</li>
								<li>确保安全有法律效力。</li>
							</ul>
						</Item>

						<Item className="txt-item">
							<div className="icon">
								<img src="/imgs/com/shareOnce4.png" alt="" className="logo1" />
							</div>
							<ul>
								<li>透明</li>
								<li>出借指标、收费标准、借款进度...</li>
								<li>一目了然，公开透明。</li>
							</ul>
						</Item>




					</List>

					{/* 按钮 */}
					<List className="bottom-btn">
						<Button type="primary">查看借条详情</Button>
					</List>

				</div>


			</div>
		)
	}
}
