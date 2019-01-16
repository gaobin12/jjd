
//信用报告
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Button, Picker, List, InputItem } from 'antd-mobile'
import { Loading, Modal } from 'SERVICE'
import { createForm } from 'rc-form'
import { Tap } from 'COMPONENT'

const c_bachelorTypeData = [
	{ value: "1", label: "专科及以上" },
	{ value: "0", label: "专科以下" },
];

@withRouter
@inject('userStore')
@observer
const page = class App extends Component {
	constructor(props, context) {
		document.title = "学信认证";
		super(props, context);
		this.state = {
            getedUserInfo: $.getUserInfo(), //用户信息
			imgrcCodeUrl:'',//图片验证码url
			imgIsShow:false,//图片验证码显示隐藏
			isPopupShow:false,//等待弹窗

			username: '',//学信登录名
			password: '',//学信登录密码
			captcha1:'',//验证码1
			captcha2:'',//验证码2

			iptIsShow:false,//输入框显示隐藏
			b_xueli_up_zhuanke_text:'',//选择的值

		}
	}

	componentDidMount() {
		
	}

	changeBachelorTypeData=(v)=>{
		let { b_xueli_up_zhuanke_text } = this.state
		this.setState({
			b_xueli_up_zhuanke_text: v[0]
        });
        
		this.ajaxGetImg(v);
	}

	ajaxGetImg=(v)=>{
		let that = this
		let { iptIsShow, imgrcCodeUrl } = this.state
		if(v == "1"){
			this.setState({
				iptIsShow: true
			});
			// 登录验证
			$.ajaxE({
				type: 'POST',
				url: "/credit/accredit/submitLoginParams",
				data: {
					"content_type": "xuexin",
					"loginXueXinParams": {
						"underSpecial": v == "0" ? 'true' : 'false'
                    },
                    "fromStatus":1
				}
			}).then((data) => {
					let imgUrl = data
					for (let key in imgUrl) {
						this.setState({
							imgrcCodeUrl: key + imgUrl[key]
						})
					}
					this.setState({
						imgIsShow: true
					})
			
			}).catch((msg) => {
				console.log(msg);
			})
		}else{
			this.setState({
				iptIsShow: false
			});
		}
		
	}
	// 获取图片验证码
	getImgCode = () => {
		let { imgrcCodeUrl } = this.state
            $.ajaxEX({
				type: 'GET',
				url: "/credit/accredit/getStudentCaptcha",
				data: {}
			}).then((json) => {
                switch (json.status) {
                    case 200: {
                        let imgUrl = json.data
                        for (let key in imgUrl) {
                            this.setState({
                                imgrcCodeUrl: key + imgUrl[key]
                            })
                        }
                        break;
                    }
                    case 201: {
                        Modal.alertX('提醒', json.msg, [
                            {
                                text: '再试试', onPress: () => {
                                }
                            }]
                        )
                        break;
                    }
                    //图片验证码错误
                    case 9999: {
                        window.location.reload();
                        break;
                    }
                }

            }).catch((msg) => {
            
            });
	
	}



	// 提交表单
	submitCaptcha=()=>{
		let that = this
		let { b_xueli_up_zhuanke_text,username, password, captcha1, captcha2 } = this.state

		if (b_xueli_up_zhuanke_text =='0'){
			this.props.form.validateFields((error, values) => {
				if (!error) {
					// 专科以下提交
					$.ajaxE({
						type: 'POST',
						url: "/credit/accredit/submitLoginParams",
						data: {
							"content_type": "xuexin",
							"loginXueXinParams": {
								"underSpecial":'true'
                            },
                            "fromStatus":1
						}
					}).then((data) => {
						that.props.history.push({
							pathname: "/fast/form",
						})
					}).catch((msg) => {
						Modal.infoX(msg);
					})
				}
			})

		}else{
			// 专科以上提交
			this.props.form.validateFields((error, values) => {
				if (!error) {
					// 自定义弹窗显示
					that.setState({
						isPopupShow: true,//等待弹窗显示
					});
					$.ajaxE({
						type: 'POST',
						url: "/credit/accredit/submitCaptcha",
						data: {
							"content_type": "xuexin",
							username: values.username,
							password: values.password,
                            captcha1: values.captcha1,
                            fromStatus:1
						}
					}).then((data) => {
                        setTimeout(that.queryMobileInterval, 6000);
					}).catch((msg) => {
						that.setState({
							isPopupShow:false
						})
						Modal.alertX('提醒', msg, [
							{
								text: '再试试', onPress: () => {
								}
							}]
						)

					})
				}
			});
		}
		
    }
    
	// 3秒轮询
	queryMobileInterval = () => {
		let _this = this;

		// 200;//验证成功，正在抓取
		//201; //操作失败  
		// 2501;// 继续查询
		// 2502;// 通道不支持
		// 2503; //等待输入短信验证码
		// 2504;//等待输入图片验证码
		// 2505;//等待输入短信验证码和图片验证码
		let queryGrabStatus = () => {
			$.ajaxEX({
				type: 'POST',
				url: '/credit/accredit/queryGrabStatus',
				data: {
					"content_type": "xuexin",
				}
			}).then((json) => {
				switch (json.status) {
					case 200: {
						_this.setState({
							isPopupShow: false
                        })
                        _this.props.userStore.getUserCreditInfo();
						_this.props.history.push({
							pathname: "/fast/form",
						})
						break;
					}
					case 201: {
						_this.setState({
							isPopupShow: false
						});
						Modal.alertX('提醒', json.msg, [
							{
								text: '再试试', onPress: () => {
								}
							}]
						)
						break;
					}

					//继续轮询
					case 2501: {
                        setTimeout(_this.queryMobileInterval, 3000);
						break;
					}
					//通道不支持
					case 2502: {
						_this.setState({
							isPopupShow: false
						});
						Modal.alertX('提醒', "学信网站正在维护，请稍后重试", [
                            {
                                text: '知道了', onPress: () => {
                                }
                            }              
                        ]);                        
                        break;
                    }
                    //用户名密码错误
                    case 2604: {
                        window.location.reload();
                        break;
                    }
                    //图片验证码错误
                    case 9999: {
                        window.location.reload();
                        break;
                    }
				}

			}).catch((msg) => {

			});
		}

		queryGrabStatus();


	}

	render() {
		const { getFieldProps, getFieldError } = this.props.form;
		return (
			<div id="initXuexin" className="view-xuexin">
				<div className="step_bar">
					<div className="step_bar_img">
						<img src={'/imgs/credit/rev-revxuexin.png'} />
					</div>

				</div>
				<div className="tip_top">
					<div>请提供真实信息,否则不能通过审核</div>
				</div>
				<List>
					<Picker
						extra="请选择"
						cols={1}
						data={c_bachelorTypeData}

						{...getFieldProps('b_xueli_up_zhuanke_text', {
							initialValue: this.state.b_xueli_up_zhuanke_text,
							rules: [{ required: true, message: '请选择最高学历' }],
						})}

						value={[this.state.b_xueli_up_zhuanke_text]}
						onOk={(v) => { this.changeBachelorTypeData(v, 'b_xueli_up_zhuanke_text') }}
					>
						<List.Item arrow="horizontal">最高学历</List.Item>
					</Picker>

					<div className='common-jc-error'>{getFieldError('b_xueli_up_zhuanke_text') && getFieldError('b_xueli_up_zhuanke_text').join(',')}</div>


				</List>

				{this.state.b_xueli_up_zhuanke_text == '1'?<List>
					<InputItem
						{...getFieldProps('username', {
							initialValue: this.state.username,
                            rules: [{ required: true, message: '请输入您的身份证号/注册手机号/邮箱' }],
                            validateTrigger:'onBlur'
						})}
                        onFocus = {$.clearErrors.bind(this,'username')}
						type="text"
						placeholder="请输入您的身份证号/注册手机号/邮箱"
						clear
					>学信账号</InputItem>
					<div className='common-jc-error'>{getFieldError('username') && getFieldError('username').join(',')}</div>

					<InputItem
						{...getFieldProps('password', {
							initialValue: this.state.password,
                            rules: [{ required: true, message: '请输入您的学信网密码' }],
                            validateTrigger:'onBlur'
                        })}
                        onFocus = {$.clearErrors.bind(this,'password')}
						type="password"
						placeholder="请输入您的学信网密码"
						clear
					>学信密码</InputItem>
					<div className='common-jc-error'>{getFieldError('password') && getFieldError('password').join(',')}</div>



					{/* 图形验证码 */}
					<div className="img-yzm" hidden={!this.state.imgIsShow}>
						<InputItem
							{...getFieldProps('captcha1', {
								initialValue: this.state.captcha1,
                                rules: [{ required: true, message: '请输入您的学信网密码' }],
                                validateTrigger:'onBlur'
                            })}
                            onFocus = {$.clearErrors.bind(this,'captcha1')}
							placeholder="请输入图中验证码"
							className="codeimg-box"
						>
							<Tap onTap={() => { this.getImgCode() }}>
								<img
									src={this.state.imgrcCodeUrl}
									alt="加载中"
									onClick={()=>{}}
								/>
							</Tap>
						</InputItem>
						<div className='common-jc-error'>{getFieldError('captcha1') && getFieldError('captcha1').join(',')}</div>
					</div>

				</List>:null}
				<div className="tip" hidden={!this.state.isShow}>
					<div className="row_noline">
						<Tap onTap={this.onlink1} className="mainColor">没有学信网账号？</Tap>
						<Tap onTap={this.onlink2} className="mainColor">忘记学信网账号密码？</Tap>
					</div>
				</div>
				<div className="tip">
					<div className="row_noline">您可能于在校期间,或报考执业考试、研究生考试时注册过学信网,所以,建议您先试一试"忘记学信网账号密码?"</div>
				</div>
				<div className="tips">
					提示：点击【下一步】则视为同意授权
			</div>
				<div className="bottom bottom_fixed">
					<Button className="bottom_button" onClick={this.submitCaptcha} >同意授权</Button>
				</div>

                <div className="backdrop" hidden={!this.state.isPopupShow}>
                    <div className="waiting slide-bottom-transition">
                        <img src={'/imgs/pay/wait.svg'} />
                        <div className="title_op">正在验证，请不要离开</div>
                        <div className="box_op">今借到平台自身不放款，只提供信息服务<br />您需要把自己的借款信息分享给他人知道</div>
                    </div>
                </div>  
			</div>
		)
	}
}
export default createForm()(page);

















