
// 运营商认证2 => 运营商认证3 => 运营商认证4
import '../credit.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { List, InputItem,Flex } from 'antd-mobile'
import { inject, observer } from 'mobx-react'
import { Loading, Modal } from 'SERVICE'
import { createForm } from 'rc-form'
import { Tap } from 'COMPONENT'


@withRouter
@inject('userStore')
@observer
class Page extends Component {
    constructor(props, context) {
        document.title = "社保信息";
        super(props, context)
        let { query } = this.props.location;
        this.state = {
            captcha1: '',
            captcha2: '',
            // codeBase64: query.codeBase64,
            codeBase64: 'dddd',
            isPopupShow:false
        }
    };


    componentDidMount() {
        
    }

    //提交事件
    submitMobileCaptcha=()=>{
        let that=this;
        that.props.form.validateFields((error, values) => {
            if (!error) {
                Loading.show();
                $.ajaxE({
                    type: 'POST',
                    url:'/credit/accredit/submitCaptcha',
                    data: {
                        content_type:"sb",
                        captcha1:'',
                        captcha2:values.contact_name2,
                    }
                }).then((data) => {
                    that.setState({
                        isPopupShow:true,
                    });
                    setTimeout(that.queryMobileInterval, 3000);
                }).catch((msg) => {
                    Modal.infoX(msg);
                }).finally(()=>{
                    Loading.hide();
                })  
            }
        });
    }
    

    //循环获取状态
    queryMobileInterval=()=>{
        let _this = this;
        
        // 200;//验证成功，正在抓取
        //201; //操作失败  
        // 2501;// 继续查询
        // 2502;// 通道不支持
        // 2503; //等待输入短信验证码
        // 2504;//等待输入图片验证码
        // 2505;//等待输入短信验证码和图片验证码
        let queryGrabStatus = ()=>{
            $.ajaxEX({
                type: 'POST',
                url: '/credit/accredit/queryGrabStatus',
                data: {
                    content_type: "sb",
                }
            }).then((json) => {    
                switch (json.status) {
                    case 200:{
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: "/credit",
                        })
                        break;
                    }
                    case 201:{
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
                    case 2501:{
                        setTimeout(_this.queryMobileInterval, 3000);
                        break;
                    }
                    //通道不支持
                    case 2502:{
                        _this.setState({
                            isPopupShow: false
                        });
                        Modal.alertX('提醒', "社保网站正在维护，暂时不支持社保认证", [
                            {
                                text: '知道了', onPress: () => {
                                }
                            }              
                        ]);                        
                        break;
                    }
                    //等待输入短信验证码                
                    case 2503:{
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: '/credit/social_security_second',
                            query: {
                                creditPhoneNo: _this.props.userStore.userInfo.telephone
                            }
                        });
                        break;
                    }
                    //等待输入图片验证码
                    case 2504:{
                        _this.setState({
                            isPopupShow: false
                        });
                        Modal.alertX('提醒', json.msg, [
                            {
                                text: '再试试', onPress: () => {
                                    _this.props.history.push({
                                        pathname: '/credit/social_security_third',
                                        query: {
                                            creditPhoneNo: _this.props.userStore.userInfo.telephone,
                                            codeBase64: json.data,
                                        }
                                    });
                                }
                            }]
                        )
                        break;
                    }
                    //等待输入短信验证码和图片验证码
                    case 2505:{
                        _this.setState({
                            isPopupShow: false
                        });
                        Modal.alertX('提醒', json.msg, [
                            {
                                text: '知道了', onPress: () => {
                                    
                                }
                            }    
                        ]);
                        break;
                    } 
                }
    
            }).catch((msg) => {
                Modal.infoX(msg);
            });
        }

        queryGrabStatus();
        
    }

    

    render() {
        const { getFieldProps, getFieldError } = this.props.form;

        return (
            <div className='view-credit-all'>
                <Flex justify="center" className="step_bar">
                    <img src={'/imgs/credit/sel-shebao.svg'} />
                </Flex>

                <Flex className="single">
                    <span className="form-line"></span>
                    <span className="form-font">图形验证码</span>
                </Flex>

                <List className="form-list">
                    <div className="img-yzm">
                        <InputItem
                            type="text"
                            {...getFieldProps('contact_name2', {
                                rules: [{ required: true, message: '请输入图片验证码' }],
                            })}
                            clear
                            placeholder="请输入图片验证码"
                        ></InputItem>
                        <Tap className="img-xuexin">
                            <img src={this.state.codeBase64} alt="加载中" />
                        </Tap>
                        <div className='common-jc-error'>{getFieldError('contact_name2') && getFieldError('contact_name2').join(',')}</div>
                    </div>
                </List>

                <div className='common-btn_box'>
                    <Tap className='c-black span font16 active' onTap={this.submitMobileCaptcha}>同意授权</Tap>
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
