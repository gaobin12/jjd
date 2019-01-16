//首页 => 借条详情（补借条）别人看的
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
		const { userStore,userStore:{userInfo},preIouStore } = this.props;
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
			data.createTime = (new Date(data.createTime)).Format('yyyy-MM-dd');
			data.amount = $.toYuan(data.amt);

			data.toReceiveAmt = $.toYuan(data.toReceiveAmt);
			data.toRepayAmt = $.toYuan(data.toRepayAmt);
			data.guaranteeAmt = $.toYuan(data.guaranteeAmt);

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

			//是否可查看报告
			let viewReport = false;
			if(userInfo.userName == data.borrowerName || userInfo.userName == data.lenderName){
				viewReport = true;
			}
			data.viewReport = viewReport;

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

	
	//驳回
	onReject=()=>{
		const _this = this;
		const { userStore, preIouStore:{detail} } = this.props;

		//检查用户是否关注过今借到
        if(!userStore.checkUserAtten()){
            return;
        }

        //检查用户是否存在 让用户去注册
        if(!userStore.checkUserExist(()=>{
            this.props.history.push('/user/login_pwd');
        })){
            return;
        }

        //检查用户是否被举报
        if(!userStore.checkUserReport()){
            return;
		}
		
		//判断实名认证
        if(!userStore.checkUserCardId(()=>{
            this.props.history.push('/user/login_pwd');
        })){
            return;
		}
		
		//判断交易密码
        if(!userStore.checkUserPwd(()=>{
            this.props.history.push('/user/login_pwd');
        })){
            return;
        }
        
        if(!detail.loanType && detail.role && userStore.creditInfo.lenderCreditStatus!=1){
            Modal.alertX('提示', '请完善您的信用报告', [
				{ text: '取消', onPress: () => {} },
				{ text: '去认证', onPress: () => {

				}},
			])
			return;
		}
		if(!detail.loanType && !detail.role && userStore.creditInfo.creditStatus!=1){
            Modal.alertX('提示', '请完善您的信用报告', [
				{ text: '取消', onPress: () => {} },
				{ text: '去认证', onPress: () => {

				}},
			])
			return;
        }
		
		Modal.alertX('提示', '驳回后，该借条将会被马上删除，不能再操作,确认驳回该借条吗', [
            { text: '不驳回', onPress: ()=>{}, style: 'default' },
            { text: '确认驳回', onPress: ()=>{
				userStore.setBox({
					pwd:true,
					onPwdEnd:_this.onRejectConfirm
				});
			}}]);					
	}

	//确认驳回
	onRejectConfirm=(pwd)=>{
		const _this = this;
		const { userStore, preIouStore:{detail} } = this.props;
		if(detail.loanType){
			//驳回极速借条
			Loading.show();
			$.ajaxE({
				type: 'POST',
				url: '/loanpre/loanFast/refuse',
				data:{
					loanId:_this.state.id,
					cause:'',
					payPassword:pwd
				}
			}).then((data)=>{
				Modal.infoX('驳回成功!',()=>{
					_this.props.history.push({
						pathname: '/home'
					});
				});
			}).catch((msg)=>{
				Modal.infoX(msg);
			}).finally(()=>{
				Loading.hide();
				userStore.setBox({
					pwd:false
				});
			})
		}else{
			//驳回普通借条
			Loading.show();
			$.ajaxE({
				type: 'POST',
				url: '/loanpre/loanOffline/refuseLoanOffline',
				data:{
					loanId:_this.state.id,
					cause:''
				}
			}).then((data)=>{
				Modal.infoX('驳回成功!',()=>{
					_this.props.history.push({
						pathname: '/home'
					}); 
				});
			}).catch((msg)=>{
				Modal.infoX(msg);
			}).finally(()=>{
				Loading.hide();
				userStore.setBox({
					pwd:false
				});
			})
		}
	}

	//确认
	onConfirm=()=>{
		const _this = this;
		const { userStore, preIouStore:{detail} } = this.props;
		//检查用户是否关注过今借到
        if(!userStore.checkUserAtten()){
            return;
        }

        //检查用户是否存在 让用户去注册
        if(!userStore.checkUserExist(()=>{
            this.props.history.push('/user/login_pwd');
        })){
            return;
        }

        //检查用户是否被举报
        if(!userStore.checkUserReport()){
            return;
		}
		
		//判断实名认证
        if(!userStore.checkUserCardId(()=>{
            this.props.history.push('/user/login_pwd');
        })){
            return;
		}
		
		//判断交易密码
        if(!userStore.checkUserPwd(()=>{
            this.props.history.push('/user/login_pwd');
        })){
            return;
        }

		if(!detail.loanType && detail.role && userStore.creditInfo.lenderCreditStatus!=1){
            Modal.alertX('提示', '请完善您的信用报告', [
				{ text: '取消', onPress: () => {} },
				{ text: '去认证', onPress: () => {

				}},
			])
			return;
		}
		if(!detail.loanType && !detail.role && userStore.creditInfo.creditStatus!=1){
            Modal.alertX('提示', '请完善您的信用报告', [
				{ text: '取消', onPress: () => {} },
				{ text: '去认证', onPress: () => {

				}},
			])
			return;
        }

        let shareBtn = ()=>{
            Modal.alertX('',<div className='dialog-supply'>
				<span>
					<img src={'/imgs/iou/rev-warning.png'} alt=""  className="warn_img" />
					<span className='color1'>补借条是为已经完成的借贷行为补一张借条，
					不走账，仅作为电子凭证，请确保你们已经线下交易完毕</span>
				</span>
				<span className='text'>
					确认后，借条即刻生效，要确认该借条吗？
				</span>
			</div>,[
				{ text: '取消', onPress: null},
				{ text: '确认借条', onPress:(e)=>{
					//极速补借条  借款人打开 并且 未支付
					if(detail.loanType && !detail.borrowerId && !detail.paid){
						//极速补借条 && 借款人打开 && 未支付
						//先确认
						Loading.show();
						$.ajaxE({
							type: 'GET',
							url: '/loanpre/loanFast/confirm',
							data:{
								id:this.state.id,
								payPassword:'',
								role:detail.role?'lender':'borrower'
							}
						}).then((data)=>{
							//再支付
							userStore.setBox({
								pay:true,
								money:8,
								poundage:true,
								onPayEnd:_this.onPay
							});
						}).catch((msg)=>{
							Modal.infoX(msg);
						}).finally(()=>{
							Loading.hide();
						})
					}else{
						userStore.setBox({
							pwd:true,
							onPwdEnd:_this.onPwdConfirm
						});
                    }
				}}
			])
        }

        let borrowDate_s=new Date(detail.borrowDate);
        let repayDate_s=new Date(detail.repayDate)
        let dates = util.iouComputedDays(repayDate_s,borrowDate_s);
        if(dates>365){
            Modal.alertX('提醒', '该笔交易借款时长超过1年，提醒您再次确认', [
                {
                    text: '取消', onPress: () => null
                },
                { text: '确认', onPress: shareBtn },
            ])
        }else{
            shareBtn()
        }
	}
	
	onPayAgain=()=>{
		const { userStore, preIouStore:{detail} } = this.props;
		//检查用户是否被举报
        if(!userStore.checkUserReport()){
            return;
		}
		//再支付
		userStore.setBox({
			pay:true,
			money:8,
			poundage:true,
			onPayEnd:_this.onPay
		});
	}

	//密码确认完成
	onPwdConfirm=(pwd)=>{
		const { userStore, preIouStore:{detail} } = this.props;
		if(detail.loanType){
			Loading.show();
			$.ajaxE({
				type: 'GET',
				url: '/loanpre/loanFast/confirm',
				data:{
					id:this.state.id,
					payPassword:pwd,
					role:detail.role?'lender':'borrower'
				}
			}).then((data)=>{
				userStore.setBox({
					pwd:false
				});
				Modal.infoX('借条确认成功!',()=>{
					this.props.history.push({
						pathname: '/'
					});
				});
			}).catch((msg)=>{
				userStore.setBox({
					pwd:false
				});
				Modal.infoX(msg);	
			}).finally(()=>{
				Loading.hide();
			})
		}else{
			Loading.show();
			$.ajaxE({
				type: 'POST',
				url: '/loanpre/loanOffline/confirmLoanOffline',
				data:{
					loanId:this.state.id,
					payPassword:pwd
				}
			}).then((data)=>{
				userStore.setBox({
					pwd:false
				});
				Modal.infoX('借条确认成功!',()=>{
					this.props.history.push({
						pathname: '/'
					}); 
				});
			}).catch((msg)=>{
				userStore.setBox({
					pwd:false
				});
				Modal.infoX(msg);
			}).finally(()=>{
				Loading.hide();
			})
		}
	}

	//支付
	onPay=(data)=>{
		const _this = this;
		const { userStore, preIouStore:{detail} } = this.props;
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
				pwd:false,
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
					Modal.infoX('支付成功！',()=>{
						_this.props.history.push({
                            pathname: '/'
                        });
					})
                }else if(data.payMethod==3){
                    //银联支付
                    $.payYinLian(res.payToken);
                }else if(data.payMethod==4){//微信支付
                    //history.pushState(null, null, '/');
                    let payToken = JSON.parse(res.payToken)
                    $.payWeiXin(payToken);
                }else{
					//确认支付   余额和银行卡需要 
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
					_this.state.payData = postData;
					userStore.setBox({
						pay:false,
						code:true,
						onCodeEnd:_this.onComfirmPay
					});
				}
			}).catch((msg)=>{
				userStore.setBox({
					pay:false,
					code:false
				});
                Modal.infoX(msg);
			}).finally(()=>{
				Loading.hide();
			})
		}
	}

	//验证码确认支付
    onComfirmPay=(valus)=>{
		const _this = this;
		const { userStore, preIouStore:{detail} } = this.props;
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
					pathname: '/'
				}); 
            })
        }).catch((msg)=>{
			userStore.setBox({
				pay:false,
				code:false
			});
            Modal.infoX(msg);
        }).finally(()=>{
			Loading.hide();
		})
	}

	render () {
		const { userStore, preIouStore:{detail} } = this.props;
        //若借条被驳回或者借条拥有借款人和出借人，则不显示按钮
		let bottomBtn = null;
		if(detail.loanType){
			if(detail.rejected){
				bottomBtn = null;
			}else{
				if(detail.lenderId && detail.borrowerId){
					if(!detail.role && !detail.paid){
						bottomBtn = (
							<div className='common-btn_box'>
								<Tap onTap={this.onPayAgain} className='c-black span font16 active'>支付</Tap>
							</div>
						)
					}else{
						bottomBtn = null;
					}
				}else{
					bottomBtn = (
						<div className="common-btn_box">         
							<Tap onTap={this.onReject} className='span font16'>
								驳回
							</Tap>	
							<Tap onTap={this.onConfirm} className='c-black span font16 active'>
								确认
							</Tap>
						</div>
					)
				}					
			}
		}else{
			if(detail.rejected || (detail.lenderId && detail.borrowerId)){
				bottomBtn = null;
			}else{
				bottomBtn = (
					<div className="common-btn_box">         
						<Tap onTap={this.onReject} className='span font16'>
							驳回
						</Tap>	
						<Tap onTap={this.onConfirm} className='c-black span font16 active'>
							确认
						</Tap>
					</div>
				)
			}
		}

		return (
			<div className="view-pre-detail" style={{paddingBottom:'50px'}}>
                <div style={{height: '100%',overflow:'auto'}}>					
                    <Flex justify='start' direction='column' className='list-top'>
                        <div className='top'></div>
                        <div className='bottom'></div>
                        <div className='user-box' style={{width:document.body.offsetWidth-40}}>
                            <Flex justify='start' direction='row' className='user-msg'>
                                <span className='img'>
                                    <img src={detail.createdHead?detail.createdHead:'/imgs/iou/user.svg'} />
                                </span>
                                <span className='text'>
                                    <span className='name'>{detail.creatorName}</span>
                                    <span className='tel num-font'>{detail.creatorTel?detail.creatorTel:detail.telephone}</span>
                                </span>
                                <span className='btn'>
                                    信用报告
                                </span>
                            </Flex>
                            <Flex justify='start' direction='row' className='user-money'>
                                <div className='money-1'>
                                    <span className='money num-font'>
                                        {detail.toReceiveAmt}<span>元</span>
                                    </span>
                                    <span className='text'>
                                        待收金额
                                    </span>
                                </div>
                                <div className='money-2'>
                                    <span className='money num-font'>
                                        {detail.toRepayAmt}<span>元</span>
                                    </span>
                                    <span className='text'>
                                        待还金额
                                    </span>
                                </div>
                                <div className='money-3'>
                                    <span className='money num-font'>
                                        {detail.guaranteeAmt}<span>元</span>
                                    </span>
                                    <span className='text'>
                                        正在担保
                                    </span>
                                </div>
                            </Flex>
                        </div>
                    </Flex>
                    <Flex justify='start' className='list-title'>
                        <span className='title'>借款内容</span>
                    </Flex>
                    <List className="detail_list">
                        <List.Item>
                            <img className='time-img' src='/imgs/iou/time.svg'/>
                            <span className='time-text num-font'>{detail.createTime}</span>
                        </List.Item>
                        <List.Item extra={detail.borrowerName}>借款人</List.Item>
                        <List.Item extra={detail.lenderName}>出借人</List.Item>
                        <List.Item extra={detail.amount}>借款金额</List.Item>
                        <List.Item extra={detail.borrowTime}>借款时间</List.Item>
                        <List.Item extra={detail.repayTime}>还款时间</List.Item>
                        <List.Item extra={detail.interestRate+'%'}>借款利率</List.Item>
                        <List.Item extra={detail.purposeTxt}>借款用途</List.Item>
                        <List.Item extra={detail.originalId}>借条ID</List.Item>
                        <List.Item extra={detail.createTime}>创建时间</List.Item>
                        <List.Item extra={<Link to="/agree/iou" className="link">点击查看/下载</Link>}>
                        借款协议</List.Item>
                    </List>
                </div>             
				{bottomBtn}
			</div>
		)
	}
}