
//信用报告
import './index.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Loading, Modal } from 'SERVICE'
import { Tap } from 'COMPONENT'

@withRouter
@inject('userStore')
@observer
export default class Page extends Component {
	constructor (props, context) {
		document.title = "二维码分享";
		super(props, context)
		this.state = {
			//获取的 base64
			qrCode:'',
			shareUrl:''
		}
		this.state.url = this.getShareUrl();
	}

	componentDidMount(){
		this.getQRCode();
		$.wxShare();
	}

	getShareUrl = ()=>{
		const share = $.getItem('wx_share');
		let appId = sessionStorage.getItem('appId');
		let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appId+'&redirect_uri='+ location.origin +'/html/wx_login.html';
		url += '&response_type=code&scope=snsapi_userinfo&state='+share.path+"?id="+share.id+'#wechat_redirect';
		return url;
	}

	getQRCode=()=>{
		const share = $.getItem('wx_share');
		if(share.param.repayType=='到期还本付息'){
			share.param.repayType='还本付息'
		}
		let _key = '还款日期';
		if(share.param.repayDate.indexOf('期')!=-1){
			_key = '分期次数'
		}else if(share.param.loanType == 4 || share.param.loanType == 2 ||  share.param.repayDate.indexOf('至')!=-1){
			_key = '借款时长'
		}
		$.ajaxE({
			type: 'POST',
			url: '/user/wx/getQrCodePoster',
			data:{
				loanType: share.param.loanType,//0：补借条；1：求借款； 2去出借；3：极速借条,4:借条草稿;
				qrCodeUrl: this.state.url,//分享链接
				params: [{"key": "金额", "value": share.amt+'元'},
				 	{"key": share.param.creatorType, "value": share.param.creatorName||''},
					{"key": "还款方式", "value": share.param.repayType||''},
				  	{"key": _key, "value": share.param.repayDate}, 
				  	{"key": "年化利率", "value": share.param.rate+'%'}],
			}
		}).then((base64)=>{
				this.setState({
					qrCode: 'data:image/jpg;base64,'+base64
				})
        }).catch((msg)=>{
			Modal.infoX(msg);
		})
    }
    //跳转首页
    gotoPage=(v)=>{
        this.props.history.push({
            pathname: '/',
        });
    }

	render () {
		return (
			<div className='view-share-img'>
				<div className="bg">
					{this.state.qrcodeLoaded?<img className='hand' src='imgs/iou/share-btn1.svg' />:null}
					<img className='main-img' src={this.state.qrCode} style={this.state.qrcodeLoaded?null:{display:'none'}} onLoad={()=>{this.setState({qrcodeLoaded:true})}} />

					<div className='loading' style={this.state.qrcodeLoaded?{display:'none'}:null}>二维码加载中...</div>

				</div>

					<Tap className="share_index" onTap={this.gotoPage}>返回首页</Tap>

			</div>
		)
	}
}