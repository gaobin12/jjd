
//用户扫完分享二维码=>分享打开页面
import './index.less'
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
			wxNum:'',//微信号码

			qrCode: '',//图片地址
			okUrl: '',//画出图片地址
			lendAmt: '',//放贷金额
			lendTm: '',//放贷时间
			name:'',//出借人名字
			telephone:$.getUserInfo().telephone,//手机号
		};
	}

	componentDidMount() {
		this.drawCard()
	}
	drawCard = () => {
		let canvas = document.getElementById('myCanvas')
		canvas.width = 1122
		canvas.height = 709
		let ctx = canvas.getContext('2d')

		// 画出圆角矩形卡片
		/* eslint-disable max-len, func-names */
		window.CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
			this.beginPath()
			this.moveTo(x + r, y)
			this.arcTo(x + w, y, x + w, y + h, r)
			this.arcTo(x + w, y + h, x, y + h, r)
			this.arcTo(x, y + h, x, y, r)
			this.arcTo(x, y, x + w, y, r)
			// this.arcTo(x+r, y);
			this.closePath()
			return this
		}
		/* eslint-enable max-len, func-names */
		ctx.roundRect(0, 0, 1122, 709, 0)
		ctx.fillStyle = 'white'
		ctx.fill()
		ctx.textAlign = 'left'
		let y = 100
		ctx.font = '50px STHeiti SimHei'
		ctx.fillStyle = '#999999'
		ctx.fillText('手机  ' + this.state.telephone, 50, 250 + (y / 2))
		if (this.state.wxNum) {
			//ctx.fillText(`微信  ${this.wxNum}`, 50, 310 + (y / 2))
		}
		ctx.font = '40px STHeiti SimHei'
		if (this.showQrcode) {
			ctx.fillText('微信扫一扫', 865, 320 + (y / 2))
		}
		ctx.fillStyle = '#333333'
		ctx.font = 'bold 70px STHeiti SimHei'
		ctx.fillText(this.state.name, 50, 140 + (y / 2))
		ctx.font = '46px STHeiti SimHei'
		ctx.fillStyle = '#333333'
		ctx.fillText('放贷额度', 50, 540 + (y / 2))
		ctx.fillText('借款时长', 600, 540 + (y / 2))
		ctx.fillStyle = '#ff9900'
		ctx.fillText(this.state.lendAmt, 260, 540 + (y / 2))
		ctx.fillText(this.state.lendTm, 810, 540 + (y / 2))
		// ctx.fillText(this.lendAmt, 260, 540 + (y / 2))
		// ctx.fillText(this.lendTm, 810, 540 + (y / 2))

		ctx.fillStyle = '#999999'
		ctx.beginPath()
		ctx.moveTo(50, 410 + (y / 2))
		ctx.lineTo(1072, 410 + (y / 2))
		ctx.lineWidth = 0.5
		ctx.closePath()
		ctx.stroke()
		// 添加二维码
		//setTimeout(function() {
		let preQrcode = document.querySelector('.qrCode');
		ctx.drawImage(preQrcode, 842, 30 + ((y / 2)), 250, 250);
		let downloadUrl = canvas.toDataURL('image/png');
		this.setState({
			okUrl: downloadUrl
		})

		//}, 500);
	}


	render() {
		return (
			<div className='view-share-open'>

				{/* 头部 */}
				<div className="share_top">
					<img src="/imgs/com/logo.png" alt="" className="logo1" />
					<img src="/imgs/com/slogan.png" alt="" className="logo2" />
				</div>
				{/* 需要插入的canvas图片 */}
				<div className="box">
					<img src={this.state.qrCode} style={{ display: 'none' }} className="qrCode" />
					<canvas id="myCanvas" style={{ display: 'none' }}></canvas>
					<div id="result" className="result">
						<img src={this.state.okUrl} />
					</div>
				</div>

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
						<Button type="primary">向TA借款</Button>
					</List>

				</div>


			</div>
		)
	}
}
