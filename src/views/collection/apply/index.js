//借条详情 => 申请催收
import React, { Component, PropTypes } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { List, Button, Picker, Checkbox } from 'antd-mobile'
import { Loading, Modal } from 'SERVICE/popup'
import {Tips,Pay,InputCode } from 'COMPONENT'

const AgreeItem = Checkbox.AgreeItem;
import './index.less'

// 佣金比例数据
//利率
const c_rate = [];

export default class Page extends Component {
	// static contextTypes = {
	// 	router: PropTypes.object.isRequired
	// }
	constructor(props, context) {
		document.title = "申请催收";
		super(props, context)
		const { query } = this.props.location;
		
		this.state = {
			// id:query.id,
			payVisible:false,
			//确认付款验证码
			cPayVisible:false,
			payData:null,
			info:{
				maxDueDays:'',	//最大逾期天数
				borrowName:'',	//待催对象
				dueTotalAmt:0,	//待催金额
				deputeMessage:'', //委托期限
				commissionPartyRate:0, //佣金比例
				accountId:'', //第三方公司账号				
				commissionPartyAmt:0, //佣金金额
			},
			modal1:false,//提示弹窗显示隐藏
            //是否同意借款协议
			agreement:-1
		};
	}

	componentDidMount() {
        this.getPageInfo();
    }

	//获取催收信息
    getPageInfo = () => {
		Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/loanlater/collection/getCollectionInfo',
            data: {
                loanId: this.state.id
            }
        }).then((data) => {
			data.commissionPartyAmt = data.dueTotalAmt * data.commissionPartyRate/100;
			data.rateList.forEach((i) =>{
				c_rate.push({
					label:i+"%",
					value:i
				})
			});
            this.setState({
                info: data
            });
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(() =>{
            //Loading.show();
            Loading.hide();
        })    
	}
	
	onPickerChange=(v) =>{
		let {info} = this.state;
		info.commissionPartyAmt = info.dueTotalAmt * v[0]/100;
		info.commissionPartyRate = v[0];
		this.setState({
			info
		});
	}

	// 点击事件
    submit=() =>{
		//判断是否 限制补借条
		if(Modal.report()){
			return false;
		}
		let valite = true
		// if(this.state.rate==-1){
		// 	this.state.rate =  null;
		// 	valite = false;
		// }
		if(this.state.agreement==-1){
			this.state.agreement =  null;
			valite = false;
		}
		if(valite){
			this.setState({
				payVisible:true
			});
		}else{
			this.setState({
				payVisible:false
			});
		}
	}

	//确认支付
	onPay=(data) =>{
		let _this = this;
        let postData = {
            loanId:_this.state.id,
            bindBankId:data.bindBankId,
			amount:$.toFen(100),
			commissionAmount:_this.state.info.commissionPartyAmt, //第三方最终的佣金金额
			commissionPartyRate:_this.state.info.commissionPartyRate, //第三方佣金比例
            payPassword:data.payPassword,
            payMethod:data.payMethod
        }
        if($.isWeiXin && data.payMethod==0){
            this.setState({
                payVisible:false,
                cPayVisible: false,
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
						payVisible: false,
					})
					Modal.infoX('支付成功！',() =>{
						//history.back();
                        _this.props.history.push({
                            pathname:'/'
                        })
					})   
                }else if(data.payMethod==3){
                    //银联支付
                    $.payYinLian(res.payToken);
                }else if(data.payMethod==4){//微信支付
                    //history.pushState(null, null, '/');
                    localStorage.setItem('urge_apply_back','/')
                    let payToken = JSON.parse(res.payToken)
                    $.payWeiXin(payToken);
                }else{
					//确认支付   余额和银行卡需要
					 //orderNo:22,payChannelType:1,payOrderNo:22,payToken:22 
					 let payData = {
						loanId:_this.state.id, //Long 求借款id
						commissionAmount:_this.state.info.commissionPartyAmt, //第三方最终的佣金金额
						commissionPartyRate:_this.state.info.commissionPartyRate, //第三方佣金比例
						amount:$.toFen(100),
						orderNo:res.orderNo,//Long 商户订单号（交易id）
						payOrderNo:res.payOrderNo, //支付订单号或协议支付绑卡流水号(第三方支付公司返回)
						payMethod:data.payMethod,//Byte 支付方式 ：0.余额  1.银行卡  2-线下 3.银联(收银台类) 4.微信(app类)
						payChannelType:res.payChannelType, //银行卡支付通道：0-掌上汇通P2P通道；1-掌上汇通快捷通道；2-余额支付通道；4-易联插件通道；5-易联代收代付通道；7-合利宝支付通道；8-易宝支付通道；17-富友-协议支付(代收)；18-银联WAP支付(代收)；19-联拓
						payToken:res.payToken,//支付令牌(第三方支付公司返回)
						//authCode:'1234', //短信验证码
						protocolBind:res.protocolBind,//Boolean 是否协议绑卡
					};
					 _this.setState({
						payVisible:false,
						cPayVisible: true,
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
        ////debugger;
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
                payVisible: false,
                cPayVisible: false
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
                    payVisible: true,
                    cPayVisible: false
                })
            });
        }).finally(() =>{
			//Loading.show();
			Loading.hide();
		})  
    }

	
    //是否统一借款协议
	onAgreementChange=(v) =>{
		this.setState({
			agreement:v.target.checked
		});
    }

	render() {
		const { info } = this.state;
		return (
			<div className="view-apply-collect">
				{/* 列表内容 */}
				<List>
					<List.Item extra={info.borrowName}>待催对象</List.Item>

					<List.Item extra={info.dueTotalAmt/100+'元'}>待催金额</List.Item>

					<List.Item extra={info.maxDueDays+'天'}>逾期天数</List.Item>

					<Picker	data={c_rate}
						cols={1}
						extra='请选择佣金比例'
						value={[this.state.info.commissionPartyRate]}
                        onChange={this.onPickerChange}>
						<List.Item arrow="horizontal">佣金比例</List.Item>
					</Picker>
					
					<List.Item extra={(info.commissionPartyAmt/100).toFixed(2)}>预计佣金金额</List.Item>

					<div className="tip pddri10">
						催收费将在收到还款时自动按比例扣除
					</div>

					<List.Item extra={'3个月'}>委托期限</List.Item>

					<List.Item extra={100+'元'}>
						保证金
						<Tips>
							<p>为保证该借条的合规合法性，平台将收取100元保证金，在委托结束后全额退还。如该借条被借款人举报并确认存在违规，平台将终止委托催收服务，且不退还保证金。</p>
						</Tips>
					</List.Item>
				</List>
				{/* 协议 */}
				<AgreeItem  onChange={this.onAgreementChange}>
					已阅读并同意 
					<Link to='/agreement/collection_agreement'>
					<a>《催收协议》</a>
					</Link>
				</AgreeItem>
                <div className='common-jc-error'>{this.state.agreement==null?'请同意今借到催收协议':null}</div>

				{/* 按钮 */}
				<List className="bottom-btn">
					<Button type="primary" onClick={this.submit}>申请催收</Button>
				</List> 
				{/*<Pay telephone={$.getUserInfo().telephoneM}*/}
				<Pay
							money={100}
                            moneyL={100}
                            input={true}
                            onEnd={this.onPay}
                            onClose={() =>{this.setState({payVisible:false})}}
                            payVisible={this.state.payVisible}>	
                </Pay>
				<InputCode onClose={() =>{this.setState({cPayVisible: false})}} visible={this.state.cPayVisible} onEnd={this.onComfirmPay} />

			</div>
		)
	}
}