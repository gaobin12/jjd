// 支付宝增强验证-验证码
import './index.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { Tap } from 'COMPONENT'
import { Modal, Loading } from 'SERVICE'
import { InputItem, List, Button } from 'antd-mobile';
import { createForm } from 'rc-form';

@withRouter
export default createForm()(class InputValid extends React.Component {
    static defaultProps = {
        length: 6,
    }
    constructor(props) {
        document.title = '验证码'
        super(props);
        this.state = {
            values: '',//存储值
            isPopupShow:false,
        };
    }

    componentDidMount() { 
        this.hiddenInput.focus()
    }

     //支付宝轮询获取状态
     queryMobileInterval=()=>{
        let _this = this;
        let queryGrabStatus = ()=>{
            $.ajaxEX({
                type: 'POST',
                url: '/credit/accredit/alipay/poll',
                data: {
                }
            }).then((json) => {    
                switch (json.status) {
                     // 认证流程失败退出 
                    case 201:{
                        _this.setState({
                            isPopupShow: false
                        });
                        Modal.alertX('提醒', json.msg, [
                            {
                                text: '确定', onPress: () => {
                                    history.back()
                                }
                            }]
                        )
                        break;
                    }
                    //继续轮询
                    case 2501:{
                        setTimeout(_this.queryMobileInterval, 1000);
                        break;
                    }
                    //通道不可用 
                    case 2502:{
                        _this.setState({
                            isPopupShow: false
                        });
                        Modal.alertX('提醒', json.msg, [
                            {
                                text: '确定', onPress: () => {
                                    history.back()
                                }
                            }               
                        ])                  
                        break;
                    }
                    // 开始支付宝授权采集任务  
                    case 2700:{
                        _this.setState({
                            isPopupShow: false
                        });
                        break;
                    }
                    //等待业务侧消息传入          
                    case 2701:{
                        _this.setState({
                            isPopupShow: false
                        });
                        break;
                    }
                    //发送短信验证码请求指令 
                    case 2702:{
                        _this.setState({
                            isPopupShow: false
                        });
                        break;
                    }
                    //短信码已发送到用户手机, 短信验证码登录指令 
                    case 2703:{
                        _this.setState({
                            isPopupShow: false
                        });
                        break;
                    }
                    // 发送账密登录指令 
                    case 2704:{
                        _this.setState({
                            isPopupShow: false
                        });
                        break;
                    }
                    // 姓名增强验证阶段 
                    case 2710:{
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: "/credit/zhifubao_verify2",
                        })
                        break;
                    }
                    // 身份证号增强验证阶段  
                    case 2711:{
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: "/credit/zhifubao_verify3",
                        })
                        break;
                    }
                    // 短信授权码增强验证阶段  
                    case 2712:{
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: "/credit/zhifubao_verify1",
                        })
                        break;
                    }
                    // 银行卡列表增强验证阶段 
                    case 2713:{
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: "/credit/zhifubao_verify5",
                            query: {
                                data: json.data,
                            }
                        })
                        break;
                    }
                    //  银行卡信息增强验证阶段   
                    case 2714:{
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: "/credit/zhifubao_verify4",
                        })
                        break;
                    }
                    //  列表类问题增强验证阶段
                    case 2715:{
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: "/credit/zhifubao_verify6",
                            query: {
                                data: json.data,
                            }
                        })
                        break;
                    }
                    //  九宫格类问题增强验证阶段  
                    case 2716:{
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: "/credit/zhifubao_verify7",
                            query: {
                                data: json.data,
                            }
                        })
                        break;
                    }
                    //  刷脸增强验证阶段   
                    case 2717:{
                        _this.setState({
                            isPopupShow: false
                        });
                        break;
                    }
                    // 采集成功, 通知前端跳转   
                    case 2721:{
                        _this.setState({
                            isPopupShow: false
                        });
                        Modal.alertX('提醒', json.msg, [
                            {
                                text: '确定', onPress: () => {
                                    _this.props.history.push({
                                        pathname: "/credit",
                                    })
                                }
                            }               
                        ])  
                        break;
                    }
                    // 上送消息校验错误, 等待重新提交(此时需要重新poll来获取验证方式)  
                    case 2730:{
                        // setTimeout(_this.queryMobileInterval, 1000);
                        _this.setState({
                            isPopupShow: false
                        });
                        Modal.alertX('提醒', json.msg, [
                            {
                                text: '确定', onPress: () => {
                                }
                            }
                        ])   
                        break;
                    }
                    // 任务执行失败 
                    case 2731:{
                        _this.setState({
                            isPopupShow: false
                        });
                        Modal.alertX('提醒', json.msg, [
                            {
                                text: '确定', onPress: () => {
                                    _this.props.history.push({
                                        pathname: "/credit",
                                    })
                                }
                            }               
                        ])    
                        break;
                    }
                    // 任务执行超时 
                    case 2732:{
                        _this.setState({
                            isPopupShow: false
                        });
                        Modal.alertX('提醒', json.msg, [
                            {
                                text: '确定', onPress: () => {
                                    _this.props.history.push({
                                        pathname: "/credit/zhifubao_pwd",
                                    })
                                }
                            }               
                        ])     
                        break;
                    }
                    
                }
    
            }).catch((msg) => {
            });
        }

        queryGrabStatus();
        
    }

    
    //输入验证码并提交
    onSetVal = (e) => {
        let _this = this,value = e.target.value;
        let { values } = this.state;
        let { length } = this.props;
        values = value;
        this.setState({
            values
        })
        if (values.length == length) {
            setTimeout(() => {
                // 校验验证码是否正确
                _this.vCode(values);
            }, 200)
        }
    }

    //验证提交
    vCode = (value)=>{
        let _this = this;
        _this.setState({
            isPopupShow:true
        })
        $.ajaxEX({
            type: 'POST',
            url: '/credit/accredit/alipay/publish',
            data: {
                process_code:'2712', // 指令码|Integer|必填 
                process_content:value
            }
        }).then((json) => {
            if(json.status==2501){
                setTimeout(_this.queryMobileInterval, 1000);
            }
        }).catch((msg) => {
            _this.setState({
                isPopupShow:false
            })
            _this.clearValues()
            Modal.infoX(msg);
        })
    }

    clearValues=()=>{
        this.setState({
            values: ''
        })
    }
    
    render() {
        const { getFieldProps, getFieldError, getFieldValue } = this.props.form;
        let { values } = this.state,{length } = this.props,
        inputs = [];
        for (let i = 0; i < length; i++) {
            inputs.push(i)
        }
        return (
            <div className='view-wy-code'>
                <div className='view-next-code'>
                    <div className="hello">请填写您收到的验证码</div>
                    <h4 className="al-send pt57">已发送验证码到绑定手机</h4>
                    <h4 className="al-send num-font"></h4>
                    <div className='common-inputvalid'>
                        {inputs.map((ele, index) => {
                            return<input key={'valid' + index} className='num-font' onFocus={()=>{this.hiddenInput.focus()}} 
                            className={values.length>index?"active":values.length==index?"active caret":null}
                            type="number" value={values[index] || ''}/>
                        })}                        
                    </div>
                    <input type="number" onChange={(e) => { this.onSetVal(e) }} ref={el=>this.hiddenInput=el} 
                    className='hidden-input' value={values}/>
                </div>
                <div className="popup-box" hidden={!this.state.isPopupShow}>
                    <div className="fade-transition"></div>
                    <div className="mui-slider waiting slide-bottom-transition">
                        <div className="mui-slider-group ">
                            <div className="mui-slider-item hide">
                                <div className="wait_tip">
                                    <div className="title_op">正在验证中 </div>
                                    <div className="time-tip">大概需要 60 秒，请稍作等待</div>
                                </div>
                                <div className="more_op">
                                    <span className="dot_1"></span>
                                    <span className="dot_2"></span>
                                    <span className="dot_3"></span>
                                </div>
                                <div className="tips_op">
                                    <div className="pay_tips_op">
                                        <div>小提示</div>
                                        <div className="box_op">
                                            <div>今借到平台自身不放款，只提供信息服务，您需要把自己的借贷信息分享给他人看到。</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>        
            </div>
        );
    }
})