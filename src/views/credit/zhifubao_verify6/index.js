//支付宝增强验证-可能认识的人（列表）
import '../zhifubao_pwd/index.less'
import './index.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { InputItem, List, Button, Menu, NavBar, ActivityIndicator } from 'antd-mobile';
import { createForm } from 'rc-form';
import { Loading, Modal } from 'SERVICE/popup'
import { Tap } from 'COMPONENT'
const data = [
    {
      value: '1',
      label: '张三',
    }
  ];

@withRouter
class Page extends Component {
    constructor(props, context) {
        document.title = "支付宝增强验证";
        super(props, context)
        let query = JSON.parse(sessionStorage.getItem('zhifubao'))
        
        this.state = {
            isPopupShow:false,
            initData: query ? query.random_list.map((e, i) => {
                return { value: i+1, label: e }
            }):data,
            random_lable: query ? query.random_lable:'',
            selData:'',
        };
    }

    componentDidMount() {   
    }

    onChange = (v) => {
        this.state.initData.forEach((dataItem)=>{
            if(dataItem.value==v[0]){
                this.setState({
                    selData:dataItem.label
                })
            }
        })
    }

    //提交表单
    submit = () => {
        let that = this
        if(that.state.selData){
            that.setState({
                isPopupShow: true
            });
            $.ajaxEX({
                type: 'POST',
                url: '/credit/accredit/alipay/publish',
                data: {
                    process_code:'2715', 
                    process_content:this.state.selData, 
                }
            }).then((json) => {
                if(json.status==2501){
                    setTimeout(that.queryMobileInterval, 1000);
                }
                
            }).catch((msg) => { 
                Modal.infoX(msg);
            })
        }else{
            Modal.infoX('请选择');
        }
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
                            isPopupShow: false,
                            initData: json.data.random_list.map((e, i) => {
                                return { value: i + 1, label: e }
                            }),
                            random_lable: json.data.random_lable
                        });
                        _this.props.history.push({
                            pathname: "/credit/zhifubao_verify6",
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
    


    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        const {initData}=this.state;
        const menuEl = (
            <Menu
              className="single-foo-menu"
              data={initData}
              level={1} 
              onChange={(v)=>{this.onChange(v)}}
              height='auto'
            />
          );
        return (
            <div className="view-login" ref={ref=>this.scrollBox = ref}>
                <div className="view-con">
                    <div className="hello size22">请选择一个您可能认识的人</div>
                    {menuEl}
                    <Tap onTap={() => { this.submit() }} >
                        <Button className="bottom-btn" type="primary">下一步</Button>
                    </Tap>
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
        )
    }
}

export default createForm()(Page);
