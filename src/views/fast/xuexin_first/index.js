
// 运营商认证2 => 运营商认证3 => 运营商认证4
import '../../credit/credit.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { List, InputItem,Flex } from 'antd-mobile'
import { Loading, Modal } from 'SERVICE'
import { createForm } from 'rc-form'
import { Tap } from 'COMPONENT'

@withRouter
@inject('userStore')
@observer
class Page extends Component {
    constructor(props, context) {
        document.title = "学信信息";
        super(props, context)
        this.state = {
            captcha2: '',
			codeBase64: '111',
            isPopupShow:false
        }
    };


    componentDidMount() {
        
    }

    // 获取图片验证码
	getImgCode = () => {
        Loading.show();
        $.ajaxEX({
            type: 'GET',
            url: "/credit/accredit/getStudentCaptcha",
            data: {
            }
        }).then((json) => {
            switch (json.status) {
                case 2504: {
                    this.setState({
                        codeBase64: json.data
                    })
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
            }

        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        }) 
	
	}

    //提交事件
    submitMobileCaptcha=()=>{
        let that=this;
        that.props.form.validateFields((error, values) => {
            if (!error) {
                Loading.show();
                // 专科以上提交
                Loading.show();
                $.ajaxE({
                    type: 'POST',
                    url: "/credit/accredit/submitCaptcha",
                    data: {
                        "content_type": "xuexin",
                        captcha2: values.captcha2,
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
                                    _this.props.history.push({
                                        pathname: "/credit/xuexin",
                                    })
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
                    //通道不支持
					case 2504: {
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: '/credit/xuexin_first',
                            query: {
                                codeBase64: json.data,
                            }
                        });
                        break;
                    }
                    //图片验证码错误
                    case 9999: {
                        _this.setState({
							isPopupShow: false
						});
                        Modal.alertX('提醒', json.msg, [
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
    

    render() {
        const { getFieldProps, getFieldError } = this.props.form;

        return (
            <div className='view-credit-all view-xuexin'>
                <div style={{height: '100%',overflow:'auto'}}>
                    <Flex justify="center" className="step_bar">
                        <img src={'/imgs/credit/sel-xuexin.svg'} />
                    </Flex>                    
                    <Flex className="single" >
                        <span className="form-line"></span>
                        <span className="form-font">验证码</span>
                    </Flex>
                    <List  className="form-list">
                        <div className="img-yzm">
                            <InputItem
                                {...getFieldProps('captcha2', {
                                    rules: [{ required: true, message: '请输入图片验证码' }],
                                    validateTrigger:'onBlur'
                                })}
                                placeholder="请输入图片验证码"
                                className="codeimg-box"
                            >
                            </InputItem>
                            <Tap onTap={() => { this.getImgCode() }} className="img-xuexin">
                                <img src={this.state.codeBase64} alt="加载中"  />
                            </Tap>
                            <div className='common-jc-error'>{getFieldError('captcha2') && getFieldError('captcha2').join(',')}</div>
                        </div>
                    </List>
                </div>

                <div className='common-btn_box'>
                    <Tap className='c-black span font16' onTap={this.submitMobileCaptcha}>同意授权</Tap>
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
