//借条详情 => 催收进度
import React, { Component, PropTypes } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Button, WingBlank } from 'antd-mobile'
import { Loading, Modal } from 'SERVICE/popup'
import './index.less'

export default class Page extends Component {
	// static contextTypes = {
	// 	router: PropTypes.object.isRequired
	// }
	constructor(props, context) {
		document.title = "催收进度";
		super(props, context)
		let { query } = this.props.location;
		this.state = {
			// id:query.id,
			// days:query.days,
			// onlineStatus:query.onlineStatus,
			userInfo:{
				versionNumber:10
			},
			showbtn:false
		};
	}

	componentDidMount() {
		this.getPageInfo();
		this.getUrgeStatus();
    }

	//获取页面内容
    getPageInfo = () => {
		const _this = this;
		Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/loanlater/loaninfo/getLoan',
            data: {
                loanId: _this.state.id
            }
        }).then((data) => {
            data.purposeType = $.purpose(data.purposeType);       
            _this.setState({
                userInfo: data
            });
        }).catch((msg,res) => {
            if(res.status == 202){
                Modal.infoX(msg,() =>{
                    _this.props.history.push({
                        pathname: '/'
                    });
                });
            }else{
                Modal.infoX(msg);
            }
        }).finally(() =>{
			Loading.hide();
		}) 
	}

	//获取页面内容
    getUrgeStatus = () => {
		const _this = this;
		Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/loanlater/collection/getLoanCollectionStatus',
            data: {
                loanId: _this.state.id
            }
        }).then((data) => {     
            _this.setState({
                showbtn: data
            });
        }).catch((msg,res) => {
			Modal.infoX(msg);
        }).finally(() =>{
			Loading.hide();
		}) 
	}

	render() {
		const { days,userInfo:{versionNumber} } = this.state;
		return (
			<div className="urge-process">
				{/* 内容 */}
				<div className="row">
					<div className="box_ce">
						{/* 加上ok会变成橘色 */}
						<div className="days ok">逾期</div>
						{/* 第一天 */}
						{this.state.days > 0 ? <div> <div className="days  ok">第<span className="date_coll">1</span>天</div>
							<div className="timeline  ok">
								<img src={'/imgs/com/wx.svg'} />
								开始向还款人定时推送微信消息提醒还款
							</div>
							<div className="timeline  ok">
								<img src={'/imgs/com/cl.svg'} />
								上传并定时更新逾期记录至本平台信用中心
							</div>
							<div className="timeline  ok">
								<img src={'/imgs/com/mn.svg'} />
								以待还本息为基数，每日按年化利率24%计收罚息
							</div>
							<div className="timeline  ok">
								<img src={'/imgs/com/hm.svg'} />
								{versionNumber>=10?<span>开始计收逾期管理费1元/天</span>:<span>开始计收基础逾期管理费(逾期本息+罚息)*1‰/天</span>}
							</div>
						</div> :<div><div className="days">第<span className="date_coll">1</span>天</div>
								<div className="timeline">
									<img src={'/imgs/com/wx_g.svg'} />	
									开始向还款人定时推送微信消息提醒还款
								</div>
								<div className="timeline">
									<img src={'/imgs/com/cl_g.svg'} />
									上传并定时更新逾期记录至本平台信用中心
								</div>
								<div className="timeline">
									<img src={'/imgs/com/mn_g.svg'} />
									以待还本息为基数，每日按年化利率24%计收罚息
								</div>
								<div className="timeline">
									<img src={'/imgs/com/hm_g.svg'} />
									{versionNumber>=10?<span>开始计收逾期管理费1元/天</span>:<span>开始计收基础逾期管理费(逾期本息+罚息)*1‰/天</span>}
								</div>
							</div>
							}
					{/* 第16天 */}
						{this.state.days > 16 ?
						<div>
							<div className="days ok">第<span className="date_coll">16</span>天</div>
							<div className="timeline ok">
								<img src={'/imgs/com/wx.svg'} />
								开始短信通知还款人的部分手机联系人
							</div>
							{versionNumber>=10?null:<div className="timeline ok">
								<img src={'/imgs/com/cl.svg'} />
								产生特殊逾期管理费(逾期本息+罚息+基础逾期管理费)*5%
							</div>}
							</div> : <div>
								<div className="days">第<span className="date_coll">16</span>天</div>
								<div className="timeline">
									<img src={'/imgs/com/wx_g.svg'} />	
									开始短信通知还款人的部分手机联系人
								</div>
								{versionNumber>=10?null:<div className="timeline ok">
									<img src={'/imgs/com/cl.svg'} />
									产生特殊逾期管理费(逾期本息+罚息+基础逾期管理费)*5%
								</div>}
							</div>
						}
					{/* 第30天 */}
					{this.state.days > 30 ?
						<div>
							<div className="days ok">第<span className="date_coll">30</span>天</div>
							<div className="timeline ok">
								<img src={'/imgs/com/wx.svg'} />
								继续短信通知还款人的更多手机联系人
							</div>
							{versionNumber>=10?null:<div className="timeline ok">
								<img src={'/imgs/com/cl.svg'} />
								调整特殊逾期管理费率至10%
							</div>}
							<div className="timeline ok">
								<img src={'/imgs/com/mn.svg'} />
								开放黑名单接口给第三方机构
							</div>
							<div className="timeline ok">
								<img src={'/imgs/com/hm.svg'} />
								可以申请法律支持
							</div>
						</div>:
						<div>
							<div className="days">第<span className="date_coll">30</span>天</div>
							<div className="timeline">
								<img src={'/imgs/com/wx_g.svg'} />	
								继续短信通知还款人的更多手机联系人
							</div>
							{versionNumber>=10?null:<div className="timeline">
								<img src={'/imgs/com/cl_g.svg'} />
								调整特殊逾期管理费率至10%
							</div>}
							<div className="timeline">
								<img src={'/imgs/com/mn_g.svg'} />
								开放黑名单接口给第三方机构
							</div>
							<div className="timeline">
								<img src={'/imgs/com/hm_g.svg'} />
								可以申请法律支持
							</div>
						</div>
					}
					</div>
				</div>

				 {/* 底部按钮 */}
				<div className="bottom">
					<WingBlank>
						<div className="g_flex">
							{this.state.showbtn?<Link to={"/after/urge_log?id=" + this.state.id}>
							{/*{true?<Link to={"/after/urge_log?id=" + this.state.id}>*/}
								{/* 加上active 变灰色 */}
								<div className="fir-btn active border_r">
								<Button type="ghost" inline size="small" style={{ }}>查看催记</Button>
								</div>
							</Link>:null}
							<Link to={"/after/urge_borrow?id=" + this.state.id}>
								<div className={this.state.showbtn ? "fir-btn border_r" : "fir-btn"}>
								{/*<div className={true ? "fir-btn border_r" : "fir-btn"}>*/}
									<Button type="ghost" inline size="small" style={{ }}>反馈信息</Button>
								</div>
							</Link>
							<Link to={"/after/urge_download?id=" + this.state.id+"&onlineStatus="+this.state.onlineStatus}>
								<div className="fir-btn" id={this.state.showbtn ? "three_style" : "two_style"}>
								{/*<div className="fir-btn" id={true ? "three_style" : "two_style"}>*/}
									<Button type="ghost" inline size="small" style={{ }}>下载证据</Button>
								</div>
							</Link>
						</div>
					</WingBlank>
				</div>
			</div>
		)
	}
}
