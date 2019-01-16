//首页 => 借条详情（补借条）自己看的
import '../detail.less'
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Flex, List } from 'antd-mobile'
import { Tap } from 'COMPONENT'
import { Loading, Modal, util, math } from 'SERVICE'

@withRouter
@inject('userStore','preIouStore')
@observer
export default class Page extends Component {

	constructor (props, context) {
		document.title = "借条详情"; 
		super(props, context)
		let query = util.getUrlParams(this.props.location.search);
		this.state = {
            id:query.id,
		};
	}
	
	componentDidMount(){
		this.getPageInfo();
	}

	//获取借条详情
	getPageInfo=()=>{
		const { userStore:{userInfo},preIouStore } = this.props;
		Loading.show();
		$.ajaxE({
			type: 'GET',
			url: '/loanpre/loanOffline/getLoanOffline',
			data:{
				loanId:this.state.id,
				openid:userInfo.userId,
			}
		}).then((data)=>{
			data.borrowTime = (new Date(data.borrowDate*1000)).Format('yyyy-MM-dd');
			data.repayTime = (new Date(data.repayDate*1000)).Format('yyyy-MM-dd');
			data.createDate = (new Date(data.createTime)).Format('yyyy-MM-dd');
			data.amount = $.toYuan(data.amt);
			data.purposeTxt = $.purpose(data.purpose);
			data.picList = data.picList?data.picList:[];

			//判断用户角色
			let role = 'borrower';
			if(userInfo.userId == data.borrowerId){
				role = 'borrower';
			}
			if(userInfo.userId == data.lenderId){
				role = 'lender';
			}
			data.role = role;

			preIouStore.setIouDetail(data);
			
			//微信分享
			$.setItem('wx_share',{
				id:this.state.id,
				path:'/pre/iou_detail',
				amt:data.amt/100,
				rate:data.interestRate,
				purpose:data.purpose,
				param: {
					loanType: data.loanType?3:0,
					loanTypeStr: data.loanType?'极速借条':'补借条',
					creatorType: data.borrowerId?'借款人':'出借人',
					rate: data.interestRate,
					creatorName: data.borrowerId?data.borrowerName:data.lenderName,
					repayDate: (new Date(data.repayDate * 1000)).Format('yyyy-MM-dd'),
					repayType: data.repayType!=undefined&&$.repayType(data.repayType),
				}
			});
		}).catch((msg)=>{
            Modal.infoX(msg);
		}).finally(()=>{
			Loading.hide();
		})
	}
	
	//关闭
	onDelete=()=>{
		const { userStore,preIouStore:{detail} } = this.props;

		//判断是否 限制补借条
		if(!userStore.checkUserReport()){
			return;
		}
		
		Modal.confirmX('删除借条后，相关记录也将一并删除，对方不能确认，借条不会生效。确认删除该借条吗？',
		()=>{
			if(detail.loanType){
				Loading.show();
				$.ajaxE({
					type: 'GET',
					url: '/loanpre/loanFast/delete',
					data:{
						id:this.state.id
					}
				}).then((data)=>{
					Modal.infoX('操作成功',()=>{
						history.back();
					})
				}).catch((msg)=>{
					Modal.infoX(msg);
				}).finally(()=>{
					//Loading.show();
					Loading.hide();
				})
			}else{
				Loading.show();
				$.ajaxE({
					type: 'GET',
					url: '/loanpre/loanOffline/deleteLoanOffline',
					data:{
						loanId:this.state.id
					}
				}).then((data)=>{
					Modal.infoX('操作成功',()=>{
						history.back();
					})	
				}).catch((msg)=>{
					Modal.infoX(msg);
				}).finally(()=>{
					Loading.hide();
				})
			}
		},()=>{
		})
	}

	//发送给对方
	onSend=()=>{	
		this.props.history.push({
			pathname: '/user/share'
		});
	}

	//极速借条去支付
	onLoanPay=()=>{
		const { userStore,preIouStore:{detail} } = this.props;
		//判断是否 限制补借条
		if(!userStore.checkUserReport()){
			return;
		}
		userStore.setBox({
			pay:true,
			money:8,
			poundage:true,
			onPayEnd:this.onPay
		});
	}

	//支付
	onPay=(data)=>{
		const _this = this;
		const { userStore,preIouStore:{detail} } = this.props;
        let postData = {
            bindBankId:data.bindBankId, // 绑卡id(银行卡绑定表ID)
			loanOfflineId:_this.state.id, // 加密后的极速借条id
			amount:800, // 极速借条手续费
			payPassword:data.payPassword, // 密码
			payMethod:data.payMethod, // 支付方式 ：0.余额 1.银行卡 2.线下 3.银联(收银台类) 4.微信(app类)
		}
		if($.isWeiXin && data.payMethod==0){
			_this.state.payData = postData;
			userStore.setBox({
				pay:false
			});
			_this.onComfirmPay();
        }else{
			Loading.show();
			$.ajaxE({
				type: 'POST',
				url: '/loanpre/loanFast/payFast',
				data:postData
			}).then((res)=>{
				if(data.payMethod==2){
                    //不需要确认
					userStore.setBox({
						pay:false
					});
					Modal.infoX('已提交，支付结果请关注消息推送!',()=>{
						_this.props.history.push({
							pathname: '/user/share'
						});
					}) 
                }else if(data.payMethod==3){
                    //银联支付
                    $.payYinLian(res.payToken);
                }else if(data.payMethod==4){//微信支付
                    let payToken = JSON.parse(res.payToken)
                    $.payWeiXin(payToken);
                }else{
					//确认支付   余额和银行卡需要
					 //orderNo:22,payChannelType:1,payOrderNo:22,payToken:22 
					 let payData = {
						loanOfflineId:_this.state.id, //Long 求借款id
						amount:$.toFen(data.amount),
						orderNo:res.orderNo,//Long 商户订单号（交易id）
						payOrderNo:res.payOrderNo, //支付订单号或协议支付绑卡流水号(第三方支付公司返回)
						payMethod:data.payMethod,//Byte 支付方式 ：0.余额  1.银行卡  2-线下 3.银联(收银台类) 4.微信(app类)
						payChannelType:res.payChannelType, //银行卡支付通道：0-掌上汇通P2P通道；1-掌上汇通快捷通道；2-余额支付通道；4-易联插件通道；5-易联代收代付通道；7-合利宝支付通道；8-易宝支付通道；17-富友-协议支付(代收)；18-银联WAP支付(代收)；19-联拓
						payToken:res.payToken,//支付令牌(第三方支付公司返回)
						//authCode:'1234', //短信验证码
						protocolBind:res.protocolBind,//Boolean 是否协议绑卡
					};
					_this.state.payData = payData;
					userStore.setBox({
						pay:false,
						code:true,
						onCodeEnd:_this.onComfirmPay
					});
				}
			}).catch((msg)=>{
				userStore.setBox({
					pay:false
				});
				Modal.infoX(msg);
			}).finally(()=>{
				//Loading.show();
				Loading.hide();
			})
		}
	}

	//验证码确认支付
    onComfirmPay=(valus)=>{
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
            url: '/loanpre/loanFast/payFastConfirm',
            data: payData,
        }).then((data)=>{
            userStore.setBox({
				pay:false,
				code:false
			});
			Modal.infoX('支付成功！',()=>{
                _this.props.history.push({
					pathname: '/user/share'
				});
            })
        }).catch((msg)=>{
			userStore.setBox({
				pay:false,
				code:false
			});
            Modal.infoX(msg);
        }).finally(()=>{
			//Loading.show();
			Loading.hide();
		})
    }

	render () {
		const { userStore, preIouStore:{detail} } = this.props;
        //若借条被驳回或者借条拥有借款人和出借人，则不显示按钮
		let bottomBtn = null;
		if(detail.rejected || (detail.lenderId && detail.borrowerId)){
			bottomBtn = null;
		}else{
			if(detail.loanType && detail.role=='borrower' && !detail.paid){
				bottomBtn = (
					<div className='common-btn_box'>
						<Tap className='span font16 active' onTap={this.onDelete}>关闭</Tap>
						<Tap className='c-black span font16 active' onTap={this.onLoanPay}>去支付</Tap>
					</div>
				)
			}else{
				bottomBtn = (
					<div className='common-btn_box'>
						<Tap className='span font16 active' onTap={this.onDelete}>关闭</Tap>
						<Tap className='c-black span font16 active' onTap={this.onSend}>发送给对方</Tap>
					</div>
				)
			}
		}

		return (
			<div className="view-pre-detail" style={bottomBtn?null:{paddingBottom:0}}>
				<div style={{height: '100%',overflow:'auto'}}>	
                    <Flex justify='start' className='list-title'>
                        <span className='title'>借款内容</span>
                    </Flex>
                    <List className="detail_list">
                        <List.Item>
                            <img className='time-img' src='/imgs/iou/time.svg'/>
                            <span className='time-text num-font'>{detail.createDate}</span>
                        </List.Item>
                        <List.Item extra={detail.borrowerName}>借款人</List.Item>
                        <List.Item extra={detail.lenderName}>出借人</List.Item>
                        <List.Item extra={detail.amount}>借款金额</List.Item>
                        <List.Item extra={detail.borrowTime}>借款时间</List.Item>
                        <List.Item extra={detail.repayTime}>还款时间</List.Item>
                        <List.Item extra={detail.interestRate+'%'}>借款利率</List.Item>
                        <List.Item extra={detail.purposeTxt}>借款用途</List.Item>
                        <List.Item extra={detail.originalId}>借条ID</List.Item>
                        <List.Item extra={detail.createDate}>创建时间</List.Item>
                        <List.Item extra={<Link to="/agree/iou" className="link">点击查看/下载</Link>}>
                        借款协议</List.Item>
                    </List>
                </div>
				{bottomBtn}
			</div>
		)
	}
}