
//信用报告-京东
import '../credit.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { List, InputItem, Flex } from 'antd-mobile'
import { Loading, Modal } from 'SERVICE'
import { createForm } from 'rc-form'
import { inject, observer } from 'mobx-react'
import { Tap } from 'COMPONENT'

@withRouter
@inject('creditStore', 'userStore')
@observer
class Page extends Component {
    constructor(props, context) {
        document.title = "京东信息";
        super(props, context)
        const { userStore, creditStore } = this.props;
        this.state = {
            telephone: userStore.userInfo.telephone,//手机号
            codeBase64: '',//
            isPopupShow: false,  //验证中弹窗
        };
    }
    componentDidMount() {
        
    }

    //调接口
    grabJingDongInfo = () => {
        let that = this
        that.props.form.validateFields((error, values) => {
            if (!error) {
                Loading.show();
                $.ajaxE({
                    type: 'POST',
                    url: "/credit/accredit/submitLoginParams",
                    contentType: 'application/json',
                    data: {
                        "content_type": 'jd',//类型
                        "loginJdParams": {
                            username: values.username, // 京东用户名
                            password: values.password, // 京东登录密码
                            telephone: that.state.telephone, // 手机号
                        }
                    }
                }).then((data) => {
                    that.setState({
                        isPopupShow: true,//等待弹窗显示
                    });
                    setTimeout(that.queryMobileInterval, 3000);
                }).catch((msg) => {
                    Modal.infoX(msg);
                }).finally(()=>{
                    Loading.hide();
                })
            }
        })

    }

    //3秒轮询（查询抓取移动运营商数据的结果）
    queryMobileInterval=()=>{
        let _this = this;
        // 201 失败 用户重试   2502 通道不支持（第三方服务异常） 2501 继续查询（请求第三方正在处理中） 2503 等待输入短信验证码
        let queryGrabStatus = ()=>{
            $.ajaxEX({
                type: 'POST',
                url: '/credit/accredit/queryGrabStatus',
                data: {
                    content_type: "jd",
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
                        Modal.alertX('提醒', "京东网站正在维护，请稍后重试", [
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
                            pathname: '/credit/jingdong_second',
                            query: {
                                creditPhoneNo: _this.props.userStore.userInfo.telephone
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
                <div style={{height: '100%',overflow:'auto'}}>
                    <Flex justify="center" className="step_bar">
                        <img src={'/imgs/credit/sel-jingdong.svg'} />
                    </Flex>

                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">京东账号</span>
                    </Flex>

                    <List className="form-list">
                        <InputItem
                            type="text"
                            {...getFieldProps('username', {
                                initialValue: this.state.username,
                                rules: [{ required: true, message: '请输入您的京东邮箱/手机号' }],
                                validateTrigger:'onBlur'
                            })}
                            placeholder="请输入您的京东邮箱/手机号"
                            clear
                        ></InputItem>
                        <div className='common-jc-error'>{getFieldError('username') && getFieldError('username').join(',')}</div>
                    </List>
                    
                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">登录密码</span>
                    </Flex>
                    <List className="form-list">
                        <InputItem
                            type="password"
                            {...getFieldProps('password', {
                                initialValue: this.state.password,
                                rules: [{ required: true, message: '请输入您的登录密码' }],
                                validateTrigger:'onBlur'
                            })}
                            placeholder="请输入您的登录密码"
                            clear
                        ></InputItem>
                        <div className='common-jc-error'>{getFieldError('password') && getFieldError('password').join(',')}</div>
                    </List>
                </div>
                
                <div className='common-btn_box'>
                    <Tap className='c-black span font16 active' onTap={this.grabJingDongInfo}>同意授权</Tap>
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