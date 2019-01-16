
//信用报告
import '../../credit/credit.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { Button, Picker, List, InputItem,Flex } from 'antd-mobile'
import { Loading, Modal } from 'SERVICE'
import { createForm } from 'rc-form'
import { Tap } from 'COMPONENT'

const selectData = [
	{ value: "1", label: "专科及以上" },
	{ value: "0", label: "专科以下" },
];

@withRouter
@inject('userStore','creditStore')
@observer
class Page extends Component {
	constructor(props, context) {
		document.title = "学信信息";
		super(props, context);
		this.state = {
			isPopupShow:false,//等待弹窗
            selectTest:'',//选择的值
		}
	}

	componentDidMount() {
		
	}

	changeBachelorTypeData=(v)=>{
		this.setState({
			selectTest: v[0]
		});
	}

	// 提交表单
	submitCaptcha=()=>{
		let that = this
		let {selectTest}=that.state;
		if (selectTest =='0'){
			that.props.form.validateFields((error, values) => {
				if (!error) {
                    Loading.show();
                    $.ajaxE({
						type: 'POST',
						url: "/credit/accredit/submitLoginParams",
						data: {
							"content_type": "xuexin",
							"loginXueXinParams": {
								"underSpecial":'true'
							}
						}
					}).then((data) => {
                        that.props.history.push({
							pathname: "/credit",
						})
					}).catch((msg) => {
                        Modal.infoX(msg);
					}).finally(()=>{
                        Loading.hide();
                    }) 
				}
			})
		}else{
			that.props.form.validateFields((error, values) => {
				if (!error) {
                    // 专科以上提交
                    Loading.show();
                    $.ajaxE({
						type: 'POST',
						url: "/credit/accredit/submitLoginParams",
						data: {
							"content_type": "xuexin",
                            "loginXueXinParams": {
                                "underSpecial":'false',
                                "username": values.username,
                                "password": values.password,
                            }
						}
					}).then((data) => {
						that.setState({
                            isPopupShow: true,//等待弹窗显示
                        });
                        setTimeout(that.queryMobileInterval, 6000);
					}).catch((msg) => {
                        Modal.infoX(msg);
					}).finally(()=>{
                        Loading.hide();
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
							pathname: "/credit",
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
                    //获取验证码
					case 2504: {
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: "/credit/xuexin_first",
                            query: {
                                codeBase64: json.data,
                            }
						})
                        break;
                    }
                    //用户名密码错误
                    case 2604: {
                        _this.setState({
							isPopupShow: false
						});
                        Modal.alertX('提醒', "图片验证码错误", [
                            {
                                text: '知道了', onPress: () => {
                                    history.go(0) 
                                }
                            }              
                        ]);  
                        break;
                    }
                    //图片验证码错误
                    case 9999: {
                        _this.setState({
							isPopupShow: false
						});
                        Modal.alertX('提醒', "图片验证码错误", [
                            {
                                text: '知道了', onPress: () => {
                                    history.go(0) 
                                }
                            }              
                        ]);  
                        break;
                    }
				}

			}).catch((msg) => {
               
			});
		}

		queryGrabStatus();


    }
    onlink1=()=>{
        window.location.href = 'https://account.chsi.com.cn/account/preregister.action?from=chsi-home'
    }
    onlink2=()=>{
        window.location.href = 'https://account.chsi.com.cn/account/password!retrive'
    }

	render() {
		const { getFieldProps, getFieldError } = this.props.form;
		return (
			<div id="initXuexin" className="view-xuexin view-credit-all">
                <div style={{height:'100%',overflow:'auto',paddingBottom: '0.2rem'}}>
                    <Flex justify="center" className="step_bar">
                        <img src={'/imgs/credit/sel-xuexin.svg'} />
                    </Flex>
                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">最高学历</span>
                        <span className="form-text">请提供真实信息,否则不能通过审核</span>
                    </Flex>
                    <List  className="form-list">
                        <Picker
                            extra="请选择"
                            cols={1}
                            data={selectData}
                            {...getFieldProps('selectTest', {
                                rules: [{ required: true, message: '请选择最高学历' }],
                            })}
                            value={[this.state.selectTest]}
                            onOk={(v) => { this.changeBachelorTypeData(v, 'selectTest') }}
                        >
                            <List.Item arrow="horizontal"></List.Item>
                        </Picker>
                        <div className='common-jc-error'>{getFieldError('selectTest') && getFieldError('selectTest').join(',')}</div>
                    </List>
                    {this.state.selectTest == '1'?<div>
                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">学信账号</span>
                    </Flex>
                    <List  className="form-list">
                        <InputItem
                            {...getFieldProps('username', {
                                rules: [{ required: true, message: '请输入您的身份证号/注册手机号/邮箱' }],
                                validateTrigger:'onBlur'
                            })}
                            type="text"
                            placeholder="请输入您的身份证号/注册手机号/邮箱"
                            clear
                        ></InputItem>
                        <div className='common-jc-error'>{getFieldError('username') && getFieldError('username').join(',')}</div>
                    </List>
                    
                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">学信密码</span>
                    </Flex>
                    <List  className="form-list">
                        <InputItem
                            {...getFieldProps('password', {
                                initialValue: this.state.password,
                                rules: [{ required: true, message: '请输入您的学信网密码' }],
                                validateTrigger:'onBlur'
                            })}
                            type="password"
                            placeholder="请输入您的学信网密码"
                            clear
                        ></InputItem>
                        <div className='common-jc-error'>{getFieldError('password') && getFieldError('password').join(',')}</div>
                    </List>
                    </div>:null}

                    <div className="link_div">
                        <Tap onTap={this.onlink1}>没有学信网账号？</Tap><span className="link_line"></span>
                        <Tap onTap={this.onlink2}>忘记学信网账号密码？</Tap>
                    </div>
                    <div className="com-tipe-div active">
                        <div className="com-tipe">
                            <p>您可能于在校期间,或报考执业考试、研究生考试时注册过学信网,所以,建议您先试一试"忘记学信网账号密码?</p>
                        </div>
                    </div>
                </div>
                <div className='common-btn_box'>
                    <Tap className='c-black span font16' onTap={this.submitCaptcha}>同意授权</Tap>
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
export default createForm()(Page);

















