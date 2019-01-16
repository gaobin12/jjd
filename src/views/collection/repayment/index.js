//借条生成成功
import './index.less'
import React, { Component, PropTypes } from 'react'
import { Flex, List, Switch, Picker } from 'antd-mobile'
import { Tap,Tips,Pay,InputCode } from 'COMPONENT'
import { Loading, Modal } from 'SERVICE/popup'

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

export default class App extends Component {
    // static contextTypes = {
    //     router: PropTypes.object.isRequired
    // }
    constructor(props, context) {
        document.title = "还款提醒";
        super(props, context)
        this.state = {
            pop1:false,
            pop2:false,
            pop3:false,
            selectValue:56,
            checked:false,
            collectionStatus:0, //催收状态 0.未开启 1.已开启 2.剩余次数不足 不能开启
            collectionUsedCount:0, //催收已用次数
            collectionRestCount:0, //催收剩余次数
            collectionRate:0, //催回率 还款率+展期率+销账率
            collectionTotalCount:0, //催收总借条数
            collectionDetails:[], //催收详情

            days:0,
            hours:0,
            minutes:0
        };
    }

    componentDidMount() {
		this.getPageInfo();
	}

    //获取催收信息
	getPageInfo=() =>{
		Loading.show();
		$.ajaxE({
			type: 'GET',
			url: "/loanlater/collection/getUserCollectionInfo",
			data: {}
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
    
    onSwitch=() =>{        
        let { collectionStatus,checked } = this.state;
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


    pickerOk=(v) =>{
        this.setState({
            pop1:false,
            pop2:true,
            selectValue:v[0]
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
        if($.isWeiXin && data.payMethod==0){
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
                        // _this.props.history.push({
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

	//验证码确认支付
    onComfirmPay=(valus) =>{
        //debugger;
		const _this = this;
        let payData = _this.state.payData;
        if($.isWeiXin && payData.payMethod==0){
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
                this.props.history.push({
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

    render() {
        return (
            <div className='view-urge-helper'>
                <List>
                    <List.Item
                        extra={<span>{this.state.checked?null:'暂未开启'}<Switch
                        color="#FF9900"
                        checked={this.state.checked}
                        onChange={this.onSwitch}/></span>}>
                        还款提醒
                        <span className="tip">
                            <Tips>
                                <span>1.还款提醒是今借到平台提供的电话提醒服务，针对平台所有类型的借条，可有效提升还款率。</span><br/>
                                <span>2.出借人购买提醒次数并开启提醒服务后，平台将对逾期7天内的借条进行电话（每天最多3通）和短信（1条）还款提醒。</span><br/>
                                <span>3.平台仅对借款人本人在法定时间内进行还款提醒，提醒记录可在借条详情--催收进度中查看。</span><br/>
                                <span>4.提醒费用按天收费，每张借条0.8元/天（3通电话+1条短信，优惠期间购买有优惠）。</span>
                            </Tips>
                        </span>
                    </List.Item>
                </List>
                <div className="showbox">
                    <Flex justify="around" className='item1'>
                        <div className='item'>
                            <span>已用次数</span>
                            <span>{this.state.collectionUsedCount}</span>
                        </div>
                        <div className='item'>
                            <span>可用次数</span>
                            <span>{this.state.collectionRestCount}</span>
                        </div>
                        <div className='item'>
                            <span>
                                成功率
                                <span className="tip">
                                    <Tips>
                                        <span>成功率：表示平台还款提醒的平均成功率。</span><br/>
                                        <span>计算方式：还款率+展期率+销账率</span><br/>
                                    </Tips>
                                </span>
                            </span>
                            <span>{this.state.collectionRate}</span>
                        </div>
                    </Flex>
                    <Flex align="end" className='item2'>
                        <Tap onTap={() =>{this.setState({pop1:true})}}><span>充值还款提醒，提升成功率 >></span></Tap>
                    </Flex>
                </div>
                <Flex align="start" className='item3'>
                    <span>还款统计</span>
                </Flex>
                <Flex align="start" className='item4'>
                    <span>已累计为您节省{this.state.days}天{this.state.hours}小时{this.state.minutes}分钟</span>
                </Flex>
                {this.state.collectionDetails.length?<div className='item5'>
                    {this.state.collectionDetails.map((item) =>{
                        return <Flex align="start" className='item'>
                            <span>{item.datef}</span>
                            <span>节省时间{item.days}天{item.hours}小时{item.minutes}分钟</span>
                        </Flex>
                    })}
                </div>:null}
                <Picker
					title="充值梯度"
					visible={this.state.pop1}
					data={Moneys}
					value={this.state.selectValue}
					cols={1}
					onOk={this.pickerOk}
					onDismiss={() => this.setState({ pop1: false })}>
				</Picker>

                {/*<Pay {telephone={$.getUserInfo().telephoneM}}*/}
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


