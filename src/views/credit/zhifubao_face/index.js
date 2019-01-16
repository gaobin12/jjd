
import './index.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { InputItem, List, Button, Grid } from 'antd-mobile';
import { createForm } from 'rc-form';
import { Loading, Modal } from 'SERVICE'
import { Tap } from 'COMPONENT'


var that
/** poll次数统计  */
var pollCount = 0;

/** 人脸认证时, 结束发帧图片标志位 */
var stopSendFrame = true;

/** 人脸认证重试次数 */
var retryTimes = 0;

/** 发送帧数统计 */
var frameCount = 0;

/** 前往提交登录点击限流 */
var loginTimer = null;

/** 人像视频 */
var video = null;

/** 1帧 */
var frameImage = null;

/*** 绘图画布 */
var canvas = null;
var width  = 0  
var height = 0
/** canvas上下文 */
var ctx = null;

/** 视频流 */
var track = null;

/** 取帧定时器Id */
var requestAnimationId = null;

/** webSocket句柄, KPL为index.html中的变量 */
let KPL = {}
KPL.kplWs = null;
KPL.normalCloseWebSocket = false;


@withRouter
class Page extends Component {
    constructor(props, context) {
        document.title = "刷脸增强验证";
        super(props, context)
        let query = JSON.parse(sessionStorage.getItem('zhifubao'))
        this.state = {
            title:'刷脸增强验证',
            remoteId:query.remoteId,
            businessNo:query.businessNo,
            slaveId: query.slaveId.slaveId
        }
    }

    componentDidMount() {  
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        width = video.width;
        height = video.height;
        canvas.width = width;
        canvas.height = height; 
        // this.startH5FaceAuth()
        this.requestCamera()
        this.startWebSocket()
        this.queryMobileInterval()
    }

/***
 * 请求用户打开摄像头
 */
requestCamera() {
    that = this
    var video = document.getElementById("video");
    if (
        (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ||
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia
    ) {
        // 调用用户媒体设备，访问摄像头
        that.getUserMedia(
            {
                audio: false,
                video: true
            },
            that.success,
            that.error
        );
    } else {
        // alert("你的浏览器不支持访问用户媒体设备, 不支持 MediaStream");
        alert("暂不支持人脸验证，请重试授权登录。")
    }
}

/***
 * 打开摄像头, 麦克风等设置
 */
getUserMedia(constrains, success, error) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
            .getUserMedia(constrains)
            .then(success)
            .catch(error);
    } else if (navigator.webkitGetUserMedia) {
        navigator
            .webkitGetUserMedia(constrains)
            .then(success)
            .catch(error);
    } else if (navigator.mozGetUserMedia) {
        navagator
            .mozGetUserMedia(constrains)
            .then(success)
            .catch(error);
    } else if (navigator.getUserMedia) {
        navigator
            .getUserMedia(constrains)
            .then(success)
            .catch(error);
    }
}
/***
 * 用户成功打开摄像头
 */
 success(stream) {
    if (typeof video === undefined) {
        video = document.getElementById("video");
    }
    var CompatibleURL = window.URL || window.webkitURL;
    video.srcObject = stream;
    video.play();
    track = stream.getTracks()[0];
    console.info(
        "%%%%%%%%%%%%%%%%%%%%% 用户打开了摄像头 %%%%%%%%%%%%%%%%%%%%%%%%%%"
    );
    setTimeout(() => {
        console.log(
            "%%%%%%%%%%%%%%%%%%%%% 准备开始数据传输 %%%%%%%%%%%%%%%%%%%%%%%%%%"
        );
        that.startGetFrames(30);
    }, 1000);
}

/***
 * 打开摄像头失败
 */
 error(error) {
    console.info(
        "%%%%%%%%%%%%%%%%%%%%% 摄像头打开失败: %%%%%%%%%%%%%%%%%%%%%%%%%%"
    );
    console.log(error);
}
startH5FaceAuth(){
    let that =this
    function liveVideo() {
        var URL = window.URL || window.webkitURL;   // 获取到window.URL对象
        navigator.getUserMedia({
            video: true
        }, function (stream) {
            video.src = URL.createObjectURL(stream);   // 将获取到的视频流对象转换为地址
            video.play();   // 播放
            that.startGetFrames(30)
            //点击截图     
        }, function (error) {
            console.log(error.name || error);
        });
    }
    liveVideo();
}

startWebSocket() {
    let that = this
    if (!KPL.kplWs || KPL.kplWs.readyState !== 1) {
        KPL.kplWs = new WebSocket('wss://www.auzdata.com:8443/master_face/websocket');
    }
    // 断开重连接
    setTimeout(() => {
        if (KPL.kplWs && KPL.kplWs.readyState !== 1) {
            if (retryTimes >= KPL.webSocketRetryTimes) {
                alert("websocket连接失败!");
                // cancelH5FaceAuthWhenError();
                return;
            }
            retryTimes++;
            setTimeout(startWebSocket, 1000);
        }
    }, 2000);
    // webSocket连接成功, 连接成功就可以开始发送帧了()
    KPL.kplWs.onopen = () => {
        // 重置主动关闭
        KPL.normalCloseWebSocket = false;
        var data1 = JSON.stringify({
            slaveId: that.state.slaveId
        });
        KPL.kplWs && KPL.kplWs.send(data1);
        stopSendFrame = false;
        console.log(">>>> [websocket打开] 发送帧 :" + data1);
    };

    // webSocket收到消息
    KPL.kplWs.onmessage = function (data) {
        console.log("websocket收到消息", data);
    };

    // webSocket遇到错误
    KPL.kplWs.onerror = function (e) {
        showAlert("长连接错误: " + e.toString());
    };

    // webSocket关闭事件
    KPL.kplWs.onclose = () => {
        // 主动关闭的ws, 关闭后重置这个变量, 否则需要重试几次
        if (KPL.normalCloseWebSocket) {
            KPL.normalCloseWebSocket = false;
        }
        console.log("websocket已关闭!");
    };
}
/***
 * 结束 webSocket, 向服务器发数据
 */
finishWebSocket() {
    let that = this
    // 主动关闭标志
    KPL.normalCloseWebSocket = true;
    var data = {
      slaveId: that.state.slaveId,
      opera: 1
    };
    console.log("[关闭websocket], data = ", data);
    KPL.kplWs && KPL.readyState === 1 && KPL.kplWs.send(JSON.stringify(data));
  }
/***
 * 取帧, 帧率限制
 */
startGetFrames(FPS) {
    console.log(2)
    let that = this
    FPS = KPL.fps || FPS || 10;
    let step = (timestamp, elapsed) => {
        if (elapsed > 1000 / FPS) {
            that.getFrames(that.sendFrame);
            elapsed = 0;
        }
        requestAnimationId = window.requestAnimationFrame(_timestamp =>
            step(_timestamp, elapsed + _timestamp - timestamp)
        );
    };
    requestAnimationId = window.requestAnimationFrame(timestamp =>
        step(timestamp, 0)
    );
}
/***
 * 从人脸视频上取帧
 */
getFrames(fn) {
    // context.drawImage(video, 0, 0, canvas.width, canvas.height);
    // var base64 = canvas.toDataURL("image/jpeg", .7);
    // frameImage.src = base64;
    ctx.drawImage(video, 0, 0, width, height);
    var url = canvas.toDataURL('image/jpeg',.7);
    // console.log(url)
    fn && fn(url);
}
/***
 * 向服务器发送 帧图片
 */
sendFrame(base64) {
    if (stopSendFrame) {
        return;
    }
    KPL.kplWs && KPL.kplWs.readyState === 1 && KPL.kplWs.send(base64);
    KPL.kplWs && KPL.kplWs.readyState === 1 && KPL.kplWs.send("image_end");
    frameCount++;
}
    queryMobileInterval = () => {
        let _this = this;
        let queryGrabStatus = () => {
            $.ajaxEX({
                type: 'POST',
                url: '/credit/accredit/alipay/poll',
                data: {
                    remoteId: this.state.remoteId
                }
            }).then((json) => {
                switch (json.status) {
                    // 认证流程失败退出 
                    case 201: {
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
                    case 2501: {
                        setTimeout(_this.queryMobileInterval, 1000);
                        break;
                    }
                    //通道不可用 
                    case 2502: {
                        _this.finishWebSocket()
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
                    case 2700: {
                        _this.setState({
                            isPopupShow: false
                        });
                        break;
                    }
                    //等待业务侧消息传入          
                    case 2701: {
                        _this.setState({
                            isPopupShow: false
                        });
                        break;
                    }
                    //发送短信验证码请求指令 
                    case 2702: {
                        _this.setState({
                            isPopupShow: false
                        });
                        break;
                    }
                    //短信码已发送到用户手机, 短信验证码登录指令 
                    case 2703: {
                        _this.setState({
                            isPopupShow: false
                        });
                        break;
                    }
                    // 发送账密登录指令 
                    case 2704: {
                        _this.setState({
                            isPopupShow: false
                        });
                        break;
                    }
                    // 姓名增强验证阶段 
                    case 2710: {
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: "/credit/zhifubao_verify2",
                        })
                        break;
                    }
                    // 身份证号增强验证阶段  
                    case 2711: {
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: "/credit/zhifubao_verify3",
                        })
                        break;
                    }
                    // 短信授权码增强验证阶段  
                    case 2712: {
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: "/credit/zhifubao_verify1",
                        })
                        break;
                    }
                    // 银行卡列表增强验证阶段 
                    case 2713: {
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
                    case 2714: {
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: "/credit/zhifubao_verify4",
                        })
                        break;
                    }
                    //  列表类问题增强验证阶段
                    case 2715: {
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
                    case 2716: {
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
                    case 2717: {
                        _this.setState({
                            isPopupShow: false,
                            action_msg: '验证开始'
                        });
                        setTimeout(_this.queryMobileInterval, 1000);
                        break;
                    }
                    case 2718:
                        _this.setState({
                            isPopupShow: false,
                            action_msg: '眨眨眼'
                        })
                        setTimeout(_this.queryMobileInterval, 1000);
                        break;
                    case 2719:
                        _this.setState({
                            isPopupShow: false,
                            action_msg: '验证结束'
                        })
                        _this.finishWebSocket()
                        setTimeout(_this.queryMobileInterval, 1000);
                        break;
                    // 采集成功, 通知前端跳转   
                    case 2721: {
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
                    case 2730: {
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
                    case 2731: {
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
                    case 2732: {
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
        return (
            <div className="face-auth-wrap">
                <div className="title">{this.state.action_msg}</div>
                <div className="box">
                    <video id="video" width="400" height="300"></video>
                    <canvas id="canvas"></canvas>
                </div>
            </div>
        )
    }
}

export default createForm()(Page);
