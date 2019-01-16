
// 运营商认证2 => 运营商认证3 => 运营商认证4
import '../credit.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
        document.title = "运营商信息";
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
                        content_type:"yys",
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
                    content_type: "yys",
                }
            }).then((json) => {    
                switch (json.status) {
                    case 200:{
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.userStore.getUserCreditInfo();
                        //处理跳转
                        let pathname_back=localStorage.getItem('credit_back_pathname');
                        localStorage.removeItem('credit_back_pathname');
                        //表单页面跳转处理
                        let pathname_back_from=sessionStorage.getItem('mobile_back_pathname');
                        sessionStorage.setItem('mobile_back_pathname',"");
                        if(pathname_back){
                            _this.props.history.push({
                                pathname: pathname_back,
                            })
                        }else if(pathname_back_from){
                            _this.props.history.push({
                                pathname: pathname_back_from,
                            })
                        }else{
                            _this.props.history.push({
                                pathname: "/credit",
                            })
                        }
                        break;
                    }
                    case 201:{
                        _this.setState({
                            isPopupShow: false
                        });
                        Modal.alertX('提醒', json.msg, [
                            {
                                text: '再试试', onPress: () => {
                                    _this.props.history.push({
                                        pathname: "/credit/operator_first",
                                    });
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
                        Modal.alertX('提醒', "由于您所在地区的运营商临时下线 ，您可以跳过运营商认证，还可以通过认证其他信息，获得更多权益。", [
                            {
                                text: '再试试', onPress: () => {
                                }
                            },
                            { 
                                text: '跳过运营商认证', onPress: () => {
                                    $.ajaxE( {
                                        type: 'POST',
                                        url: '/user/creditFee/skipMobileAuth',
                                        data: {
                                            telephone: _this.props.userStore.userInfo.telephone
                                        },
                                    }).then((json) => {
                                            _this.props.history.push({
                                                pathname: "/credit",
                                            });
                                    }).catch((msg) => {
                                        Modal.infoX(msg);
                                    });                                
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
                            pathname: '/credit/operator_second',
                            query: {
                                creditPhoneNo: _this.props.userStore.userInfo.telephone,
                                typeCode: 0,
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
                                        pathname: '/credit/operator_third',
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
                        _this.props.history.push({
                            pathname: '/credit/operator_four',
                            query: {
                                creditPhoneNo: _this.props.userStore.userInfo.telephone,
                                codeBase64: json.data,
                            }
                        });
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
            <div className='view-credit-all'>
                <div style={{height: '100%',overflow:'auto',paddingBottom: '0.2rem'}}>
                    <Flex justify="center" className="step_bar">
                        <img src={'/imgs/credit/sel-operator.svg'} />
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
                                    validateTrigger:'onBlur'
                                })}
                                clear
                                placeholder="请输入图片验证码"
                            ></InputItem>
                            <Tap className="img-xuexin">
                                <img src={this.state.codeBase64} alt="加载中" />
                            </Tap>
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
