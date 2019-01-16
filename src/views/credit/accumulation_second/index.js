
//信用报告=>公积金认证（验证码）
import '../credit.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { List, InputItem,Flex } from 'antd-mobile'
import { inject, observer } from 'mobx-react'
import { createForm } from 'rc-form'
import { Loading, Modal } from 'SERVICE'
import { Tap,Side } from 'COMPONENT'

@withRouter
@inject('userStore')
@observer
class Page extends Component {
    constructor(props, context) {
        document.title = "公积金信息";
        super(props, context)
        let {query}=this.props.location;
        this.state = {
            // creditPhoneNo: query.creditPhoneNo,
            creditPhoneNo:'111111111',
            captcha1: '',
            captcha2: '',
            isPopupShow: false,
        };
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
                        content_type:"gjj",
                        captcha1:values.contact_name1,
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
                    content_type: "gjj",
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
                        Modal.alertX('提醒', json.msg, [
                            {
                                text: '再试试', onPress: () => {
                                    _this.props.history.push({
                                        pathname: '/credit/accumulation_second',
                                        query: {
                                            creditPhoneNo: _this.props.userStore.userInfo.telephone
                                        }
                                    });
                                }
                            }]
                        )
                        break;
                    }
                    //等待输入图片验证码
                    case 2504:{
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: '/credit/accumulation_third',
                            query: {
                                creditPhoneNo: _this.props.userStore.userInfo.telephone,
                                codeBase64: json.data,
                            }
                        });
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
    
            });
        }

        queryGrabStatus();
        
    }
    render() {
        const { getFieldProps } = this.props.form;
        return (
            <div className='view-credit-all'>
                <div style={{height: '100%',overflow:'auto',paddingBottom: '0.2rem'}}>
                    <Flex justify="center" className="step_bar">
                        <img src={'/imgs/credit/sel-gjj.svg'} />
                    </Flex>

                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">验证码</span>
                        <span className="form-text">已向{this.state.creditPhoneNo?this.state.creditPhoneNo.slice(7,11):null}的手机发送验证码</span>
                    </Flex>

                    <List className="form-list">
                        <InputItem
                            type="text"
                            {...getFieldProps('contact_name1', {
                                rules: [{ required: true, message: '请输入短信验证码' }],
                            })}
                            clear
                            placeholder="请输入短信验证码"
                        ></InputItem>
                    </List>
                </div>

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