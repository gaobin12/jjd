import React, { Component } from "react";
import { List, Switch, Picker } from 'antd-mobile';
import { Tap,Tips,Pay,InputCode } from 'COMPONENT';
import { Loading, Modal } from 'SERVICE/popup';
import { Link } from 'react-router-dom';
// 引入组件
import Card from "../../../components/card";

// 引入样式
import "./index.less";
const Moneys = [
    {
      label:(<div>
        <span style={{marginRight:50}}>70次</span>
        <span>￥56</span>
      </div>),
      value: 56,
    },{
        label:(<div>
          <span style={{marginRight:50}}>500次</span>
          <span>￥350</span>
        </div>),
        value: 350,
    },{
        label:(<div>
          <span style={{marginRight:50}}>1000次</span>
          <span>￥650</span>
        </div>),
        value: 650,
    },{
        label:(<div>
          <span style={{marginRight:50}}>2000次</span>
          <span>￥1200</span>
        </div>),
        value: 1200,
    },
];

// 提醒时长
const remindTimes = [
    {
      label:(<div>
        <span>7天</span>
      </div>),
      value: 7,
    },{
        label:(<div>
          <span>14天</span>
        </div>),
        value: 14,
    },{
        label:(<div>
          <span>30天</span>
        </div>),
        value: 30,
    },{
        label:(<div>
          <span>60天</span>
        </div>),
        value: 60
    },{
        label:(<div>
          <span>90天</span>
        </div>),
        value: 90
    },{
        label:(<div>
          <span>180天</span>
        </div>),
        value: 180
    },{
        label:(<div>
          <span>360天</span>
        </div>),
        value: 360
    },{
        label:(<div>
          <span>无期限</span>
        </div>),
        value: 720
    }
    
];

// 关闭时长
const autoClose = [
    {
      label:(<div>
        <span>3天</span>
      </div>),
      value: 3,
    },{
        label:(<div>
          <span>7天</span>
        </div>),
        value: 7,
    },{
        label:(<div>
          <span>14天</span>
        </div>),
        value: 14,
    },{
        label:(<div>
          <span>30天</span>
        </div>),
        value: 30
    },{
        label:(<div>
          <span>60天</span>
        </div>),
        value: 60
    },{
        label:(<div>
          <span>90天</span>
        </div>),
        value: 90
    },{
        label:(<div>
          <span>180天</span>
        </div>),
        value: 180
    },{
        label:(<div>
          <span>360天</span>
        </div>),
        value: 360
    },{
        label:(<div>
          <span>无期限</span>
        </div>),
        value: 720
    }
    
];
export default class Remind extends Component {
	constructor(props) {
		document.title = "还款提醒";
		super(props);
		// 定义状态数据
		this.state = {
            data: [],         // 最新提醒数据
			pop1:false,
            pop2:false,
            pop3:false,
            selectValue:56,
			checked: false,
			collectionStatus:0, //催收状态 0.未开启 1.已开启 2.剩余次数不足 不能开启
			collectionUsedCount: 0, // 已用次数
			collectionRestCount:0, //催收剩余次数
            collectionRate:0, //催回率 还款率+展期率+销账率
            collectionTotalCount:0, //催收总借条数
            collectionDetails:[], //催收详情
            days:0,
            hours:0,
            minutes:0,
            // 控制提醒时长
            remind_time_show: false,
            // 自动关闭
            auto_close_show: false,
            selectValue2: [7],
            selectValue3: [720],
            // 
			add_remind_text: "请选择",
			remind_time: 7,
			close_time: 7,
			// 
			remind_today: 0,
			a_dial: 0,
			msg: 0,
			connect: 0,
			lock: false,
            isRemindData: false     // 是否有提醒数据
		}
	}
	componentDidMount() {
		this.getPageInfo();
	}
	componentDidUpdate() {
	}
	//获取催收信息
	getPageInfo=() =>{
		Loading.show();
		$.ajaxE({
			type: 'GET',
			url: "/loanlater/collection/getUserCollectionInfo",
			data: {},
			// async: false
		}).then((data) =>{
            let mis = 0;
            if(data.collectionDetails && data.collectionDetails.length){
                data.collectionDetails.forEach((item) =>{
                    mis += item.collectionCount*10;
                    item.days = parseInt(item.collectionCount*10/60/24,10);
                    item.hours = parseInt(item.collectionCount*10/60%24,10);
                    item.minutes = parseInt(item.collectionCount*10%60, 10);//计算剩余的分钟

                    item.datef = item.date.substr(0,4)+'-'+item.date.substr(4,2)+'-'+item.date.substr(6,2)
                })

                this.state.days = parseInt(mis/60/24,10);
                this.state.hours = parseInt(mis/60%24,10);
                this.state.minutes = parseInt(mis%60, 10);
            }
            this.setState({
                checked:data.collectionStatus==1?true:false,
                collectionStatus:data.collectionStatus,
                collectionUsedCount:data.collectionUsedCount,
                collectionRestCount:data.collectionRestCount,
                collectionRate:data.collectionRate,
                collectionDetails:data.collectionDetails || [],
                days:this.state.days,
                hours:this.state.hours,
                minutes:this.state.minutes
            })
		}).catch((msg) =>{
			Modal.infoX(msg);
		}).finally(() =>{
			Loading.hide();
		})  
    }

    getNewRemindList=() =>{
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: "/loanlater/collection/getNearestLoanRecordList",
            data: {
                pageNum: '',
                pageSize: ''
            },
        }).then((data) =>{
            
            this.setState({
                data: data.list
            })
        }).catch((msg) =>{
            Modal.infoX(msg);
        }).finally(() =>{
            Loading.hide();
        })  
    }
    //确认支付
	onPay=(data) =>{
        let _this = this;
        let postData = {
            bindBankId:data.bindBankId,
			amount:Math.round(_this.state.selectValue*100),
            payPassword:data.payPassword,
            payMethod:data.payMethod
        }
        if($.isWeixin && data.payMethod==0){
            this.setState({
                pop2:false,
                pop3: false,
                payData: postData
            },() =>{
                this.onComfirmPay();
            })
        }else{
			Loading.show();
			$.ajaxE({
				type: 'POST',
				url: '/loanlater/collection/collectionApply',
				data:postData
			}).then((res) =>{
				if(data.payMethod==2){
                    //不需要确认
					_this.setState({
						pop2: false,
					})
					Modal.infoX('支付成功！',() =>{
						//history.back();
                        // _this.context.router.push({
                        //     pathname:'/'
                        // })
					})   
                }else if(data.payMethod==3){
                    //银联支付
                    $.payYinLian(res.payToken);
                }else if(data.payMethod==4){//微信支付
                    //history.pushState(null, null, '/');
                    localStorage.setItem('urge_help_back','/')
                    let payToken = JSON.parse(res.payToken)
                    $.payWeiXin(payToken);
                }else{
					//确认支付   余额和银行卡需要
					 //orderNo:22,payChannelType:1,payOrderNo:22,payToken:22 
					 let payData = {
						amount:Math.round(_this.state.selectValue*100),
						orderNo:res.orderNo,//Long 商户订单号（交易id）
						payOrderNo:res.payOrderNo, //支付订单号或协议支付绑卡流水号(第三方支付公司返回)
						payMethod:data.payMethod,//Byte 支付方式 ：0.余额  1.银行卡  2-线下 3.银联(收银台类) 4.微信(app类)
						payChannelType:res.payChannelType, //银行卡支付通道：0-掌上汇通P2P通道；1-掌上汇通快捷通道；2-余额支付通道；4-易联插件通道；5-易联代收代付通道；7-合利宝支付通道；8-易宝支付通道；17-富友-协议支付(代收)；18-银联WAP支付(代收)；19-联拓
						payToken:res.payToken,//支付令牌(第三方支付公司返回)
						protocolBind:res.protocolBind,//Boolean 是否协议绑卡
					};
					 _this.setState({
						pop2:false,
						pop3: true,
						payData: payData
					})
				}
			}).catch((msg) =>{
				Modal.infoX(msg);
			}).finally(() =>{
				//Loading.show();
				Loading.hide();
			})  
		}
	}
	pickerOk=(v) =>{
        this.setState({
            pop1:false,
            pop2:true,
            selectValue:v[0]
        })
        console.log(v);
    }
    // 设置还款时长的函数
    pickerOk2=(v) =>{ 
        this.setState({
            remind_time_show: false,
            // pop2:true,
            selectValue2:v[0],
            remind_time: v[0]
        })
        console.log(v, 123);
    }
    pickerOk3=(v) =>{ 
        this.setState({
            auto_close_show: false,
            // pop2:true,
            selectValue3:v[0],
            close_time: v[0]
        })
        console.log(v, 123);
    }
    onSwitch=() =>{        
        let { collectionStatus,checked } = this.state;
    	this.setState({
    		lock: !this.state.lock
    	})
        if(collectionStatus == 0){
            checked = true;
            collectionStatus = 1;
        }else if(collectionStatus==1){
            checked = false;
            collectionStatus = 0;
        }else{
            Modal.infoX('可用次数不足，请先充值',() =>{
                this.setState({
                    pop1:true
                });
            });
            return;
        }
        Loading.show();
		$.ajaxE({
			type: 'GET',
			url: "/loanlater/collection/setCollectionStatus",
			data: {
                collectionStatus:checked
            }
		}).then((data) =>{            
            this.setState({
                checked,
                collectionStatus
            })
		}).catch((msg) =>{
			Modal.infoX(msg);
		}).finally(() =>{
			Loading.hide();
		})  
    }
	//验证码确认支付
    onComfirmPay=(valus) =>{
        //debugger;
		const _this = this;
        let payData = _this.state.payData;
        if($.isWeixin && payData.payMethod==0){
            //微信环境 余额支付直接走确认
            payData.payChannelType = 2;//这个值本来应该从申请支付后台返回，现在直接走确认，所以写死
        }else{
            //接收验证码
            payData.authCode = valus;
            delete payData.payPassword;
		}
		Loading.show();
        $.ajaxE({
            type: 'POST',
            url: '/loanlater/collection/collectionConfirm',
            data: payData,
        }).then((data) =>{
            this.setState({
                pop2: false,
                pop3: false
			});
			Modal.infoX('支付成功！',() =>{
                //history.back();
                this.context.router.push({
                    pathname:'/'
                })
            })
        }).catch((msg) =>{
            Modal.infoX(msg,() =>{
                _this.setState({
                    pop2: true,
                    pop3: false
                })
            });
        }).finally(() =>{
			//Loading.show();
			Loading.hide();
		})  
    }
    // /loanlater/collection/setCollectionStatus
    createProcessList() {
        return this.props.data.map(item => {
            return (
                <div className="process_list">
                    <div className="time">09:04:09</div>
                    <div className="addpadding">
                        <div className="padding">
                            <div className="top">
                                <div className="left">
                                    <div className="left_top">
                                        <span className="name">{ item.name }<i>（代换元）</i></span>
                                        <span className="price">{ item.price }</span>
                                    </div>
                                    <div className="left_bottom">
                                        <span>{ item.max_time }</span>
                                        <span>-</span>
                                        <span>{ item.min_time}</span>
                                    </div>
                                </div>
                                <div className="right">逾期<span>5</span>数</div>
                            </div>
                            <div className="bottom">
                                <span>电话催收-</span>
                                <span>拨打本机-</span>
                                <span>关机-</span>
                                <span>关机</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    }
	render() {
		// 解构数据
		let { add_remind_text, remind_time, close_time, remind_today, a_dial, msg, connect } = this.state;
		return (
			<div className="g-remind">
				<div className="remind-header">
					<div className="top">
						<div className="remind-list">
							<p className="remind-num">{ this.state.collectionUsedCount }</p>
							<Link to="/collection/statistics">
								<div onClick={() => { console.log("点击已用次数了") }}>
									<span>已用次数</span>
									<img className="arrow" src="imgs/pay/arrow-r.svg" alt=""/>
								</div>
							</Link>
						</div>
						<div className="remind-list">
							<p className="remind-num">{ this.state.collectionRestCount }</p>
							<div>剩余次数</div>
						</div>
						<div className="remind-list">
							<p className="remind-num">{ this.state.collectionRate }</p>
							<div>催回率</div>
						</div>
					</div>
					<div className="bottom">
						<div className="bordertop" onClick={() => {this.setState({pop1:true})}}>
							<span>充值催收助手，提升催回率</span>
							<img className="arrow" src="imgs/pay/arrow-r.svg" alt=""/>
						</div>
					</div>
				</div>
				<div className="choose-part">
					<List>
	                    <List.Item
				          extra={<Switch
				            checked={ this.state.checked }
				            onChange={this.onSwitch}
				            color= '#FF8862'
				            onClick={this.tap_open}
				          />}
				        >	
							<div className="g-title">
								<span>开启还款提醒</span>
								<img className="mark" src="imgs/iou/Artboard 3.svg" alt=""/>
								<span className="tip">
		                            <Tips>
		                                <span>1.还款提醒是今借到平台提供的电话提醒服务，针对平台所有类型的借条，可有效提升还款率。</span><br/>
		                                <span>2.出借人购买提醒次数并开启提醒服务后，平台将对逾期7天内的借条进行电话（每天最多3通）和短信（1条）还款提醒。</span><br/>
		                                <span>3.平台仅对借款人本人在法定时间内进行还款提醒，提醒记录可在借条详情--催收进度中查看。</span><br/>
		                                <span>4.提醒费用按天收费，每张借条0.8元/天（3通电话+1条短信，优惠期间购买有优惠）。</span>
		                            </Tips>
		                        </span>
							</div>
				        </List.Item>
	                </List>
					<div className="item-list">
						<div className="pull-left">
							<span>添加需要提醒的借条</span>
						</div>
						{ this.state.checked ? <Link to="/collection/admin">
							<div className="pull-right">
								<span>{ add_remind_text }</span>
								<img className="arrow" src="imgs/pay/arrow-r.svg" alt=""/>
							</div>
						</Link> : <div className="pull-right">
							<span>{ add_remind_text }</span>
							<img className="arrow" src="imgs/pay/arrow-r.svg" alt=""/>
						</div>}
					</div>
					<div className="item-list">
						<div className="pull-left">
							<span>开启后提醒时长</span>
							<img className="mark" src="imgs/iou/Artboard 3.svg" alt=""/>
							<span className="tip">
	                            <Tips>
	                                <span>1.借条逾期后自动开启还款提醒</span><br/>
	                                <span>2.提醒天数到达设置天数后，此借条提醒自动关闭</span><br/>
	                                <span>3.您可以可手动再次开启还款提醒</span>
	                            </Tips>
	                        </span>
						</div>
						<div className="pull-right" onClick={ () => this.setState({remind_time_show: true}) }>
							<span>{ remind_time == 720 ? "无期限" : remind_time + "天" }</span>
							<img className="arrow" src="imgs/pay/arrow-r.svg" alt=""/>
						</div>
					</div>
					<div className="item-list">
						<div className="pull-left">
							<span>连续未接通自动关闭</span>
							<img className="mark" src="imgs/iou/Artboard 3.svg" alt=""/>
							<span className="tip">
	                            <Tips>
	                                <span>当借款人连续未接通天数，超过设置天数后，催收自动关闭。未接通情况包括“停机”“不在服务区”“空号”</span><br/>
	                            </Tips>
	                        </span>
						</div>
						<div className="pull-right" onClick={ () => { this.setState({auto_close_show: true}) }}>
							<span>{ close_time == 720 ? "无期限" : close_time + "天" }</span>
							<img className="arrow" src="imgs/pay/arrow-r.svg" alt=""/>
						</div>
					</div>
				</div>
				{/*提醒进度*/}
				<div className="remind-process">
					<div className="g-title">最新提醒进度</div>
					<div className="remind-msg">
						<span className="remind-today">今日需提醒<i>{ remind_today }</i>张</span>
						<span>已拨打<i>{ a_dial }</i>次，</span>
						<span>短信<i>{ msg }</i>条，</span>
						<span>接通<i>{ connect }</i>次</span>
					</div>
				</div>
				<div className="content">
                    { this.state.isRemindData ? <div>
                            { this.createProcessList() }
                        </div> : <div className="nulldata">
                        <img src="imgs/iou/loan-null.svg" alt=""/>
                        <p>您还没有开启提醒哦~</p>
                    </div>}
                </div>
				<Picker
					title="充值梯度"
					visible={this.state.pop1}
					data={Moneys}
					value={this.state.selectValue}
					cols={1}
					onOk={this.pickerOk}
					onDismiss={() => this.setState({ pop1: false })}>
				</Picker>
				{ this.state.checked ? <Picker
					title="提醒时长"
					visible={this.state.remind_time_show}
					data={remindTimes}
					value={this.state.selectValue2}
					cols={1}
					onOk={this.pickerOk2}
					onDismiss={() => this.setState({ remind_time_show: false })}>
				</Picker> : null}
				{ this.state.checked ? <Picker
					title="自动关闭"
					visible={this.state.auto_close_show}
					data={autoClose}
					value={this.state.selectValue3}
					cols={1}
					onOk={this.pickerOk3 }
					onDismiss={() => this.setState({ auto_close_show: false })}>
				</Picker> : null}
                {/*<Pay telephone={$.getUserInfo().telephoneM}*/}
                <Pay
                    money={this.state.selectValue}
                    moneyL={this.state.selectValue}
                    onEnd={this.onPay}
                    input={false}
                    noPoundage={true}
                    onClose={() =>{this.setState({pop2:false})}}
                    payVisible={this.state.pop2}>	
                </Pay>
                <InputCode onClose={() =>{this.setState({pop3: false})}} visible={this.state.pop3} onEnd={this.onComfirmPay} />
			</div>
		)
	}
}

Remind.defaultProps = {
    data: [
        {
            id: 123,
            name: "张三",
            isRemind: false,
            price: "4000",
            max_time: "19/05/02",
            min_time: "18/03/01",
            day: 10
        },{
            id: 128,
            name: "王七",
            price: "1000",
            isRemind: true,
            max_time: "19/05/02",
            min_time: "18/03/01",
            day: 5
        }
    ]
}