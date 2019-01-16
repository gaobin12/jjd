
//首页 => 出借产品列表详情（别人看）
import '../detail.less'
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Flex, List } from 'antd-mobile'
import { Loading, Modal, util, math } from 'SERVICE'
import { Tap } from 'COMPONENT'

@withRouter
@inject('userStore','preLoanStore')
@observer
export default class Page extends Component {

	constructor (props, context) {
		document.title = "借条详情";
		super(props, context)
		let query = util.getUrlParams(props.location.search);
		this.state = {
            id:query.id,
		};
	}
	
	componentDidMount(){
        this.getPageInfo();
        //this.props.preLoanStore.clearInfo();
	}

	//获取借条详情
	getPageInfo=()=>{
        Loading.show();
        const { userStore,preLoanStore } = this.props;
		$.ajaxE({
			type: 'GET',
			url: '/loanpre/product/getProductBid',
			data:{
				id:this.state.id,
			}
		}).then((data)=>{
			data.amount = $.toYuan(data.amount);
			data.repayTypeText = $.repayType(data.repayType);
			data.purpose = $.purpose(data.purpose);
			data.createDate = (new Date(data.createDate*1000)).Format('yyyy-MM-dd hh:mm');
			if(data.repayType){
                data.formatTime = data.period + "期";
            }else{
                data.formatTime = data.period + (data.tmUnit?'个月':'天');
            }
			data.picStr = data.picStr?data.picStr:[];  
            preLoanStore.setDetail(data);
            //微信分享
            userStore.setShareInfo({
                id:this.state.id,
				path:'/pre/loan_detail'
            });
		}).catch((msg)=>{
            Modal.infoX(msg);
		}).finally(()=>{
            Loading.hide();
        })
	}

	//驳回
	onReject=()=>{        
        const { userStore } = this.props;

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
		///////
		Modal.confirmX('您确认要驳回这次申请吗？',()=>{
			Loading.show();
            $.ajaxE({
                type: 'GET',
                url: '/loanpre/product/closeProductBid',
                data:{
                    id:this.state.id
                }
            }).then((data)=>{
                Modal.infoX('驳回成功！',()=>{
                    this.props.history.push('/home');
                })
            }).catch((msg)=>{
                Modal.infoX(msg);
            }).finally(()=>{
				Loading.hide();
			})
        },()=>{
            //取消
        })
	}

	//借给他
	onConfirm=()=>{
        debugger;
		const { userStore,preLoanStore:{detail} } = this.props;

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

        userStore.setBox({
            pay:true,
            money:detail.amount,
            onPayEnd:this.onPay
        })
    }
    
    //确认支付
	onPay=(data)=>{
        //debugger;
        let _this = this;
        const { userStore,preLoanStore:{detail} } = this.props;		
        let postData = {
			productBidId:_this.state.id, //Long 产品申请id
			bindBankId:data.bindBankId, //Long 绑卡id(银行卡绑定表ID)
			amount:$.toFen(data.amount), //Integer 金额
			payPassword:data.payPassword, //String 支付密码
			payMethod:data.payMethod, //Byte 支付方式 ：0.余额 1.银行卡 2-线下 3.银联(收银台类) 4.微信(app类)
		}
		//微信环境 余额支付直接走确认
        if($.isWeiXin && data.payMethod==0){
            _this.state.payData = postData;
            userStore.setBox({
                pay:false
            },()=>{
                _this.onComfirmPay();
            })
        }else{
			Loading.show();
			$.ajaxE({
				type: 'POST',
				url: '/loanpre/payProduct/payProductBid',
				data:postData
			}).then((res)=>{
				if(data.payMethod==2){
                    //不需要确认
                    userStore.setBox({
                        pay:false
                    })
					Modal.infoX('已提交，支付结果请关注消息推送!',()=>{
                        _this.props.history.push("/home");
					});     
                }else if(data.payMethod==3){
                    //银联支付
                    $.payYinLian(res.payToken);
                }else if(data.payMethod==4){//微信支付
                    //history.pushState(null, null, '/');
                    let payToken = JSON.parse(res.payToken)
                    $.payWeiXin(payToken);
                }else{
					//确认支付   余额和银行卡需要
					//orderNo:22,payChannelType:1,payOrderNo:22,payToken:22 
					let payData = {
						productBidId:_this.state.id, //Long 求借款id
						amount:$.toFen(data.amount),
						guaranteeUid:"", //Long担保人id
						orderNo:res.orderNo,//Long 商户订单号（交易id）
						payOrderNo:res.payOrderNo, //支付订单号或协议支付绑卡流水号(第三方支付公司返回)
						payMethod:data.payMethod,//Byte 支付方式 ：0.余额  1.银行卡  2-线下 3.银联(收银台类) 4.微信(app类)
						payChannelType:res.payChannelType, //银行卡支付通道：0-掌上汇通P2P通道；1-掌上汇通快捷通道；2-余额支付通道；4-易联插件通道；5-易联代收代付通道；7-合利宝支付通道；8-易宝支付通道；17-富友-协议支付(代收)；18-银联WAP支付(代收)；19-联拓
						payToken:res.payToken,//支付令牌(第三方支付公司返回)
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
				Loading.hide();
			})
		}        
	}

	//验证码确认支付
    onComfirmPay=(valus)=>{
        const _this = this;
        const { userStore,preLoanStore:{detail} } = this.props;
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
            url: '/loanpre/payProduct/payProductBidConfirm',
            data: payData,
        }).then((data)=>{
            userStore.setBox({
                pay:false,
                code:false
            });
			Modal.infoX('已提交，支付结果请关注消息推送!',()=>{
				_this.props.history.push({
					pathname: '/'
				}); 
			});
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
		const { userStore, preLoanStore:{detail} } = this.props;
		return (
			<div className="view-pre-detail" style={{paddingBottom:'50px'}}>
                <div style={{height: '100%',overflow:'auto',paddingBottom:'0.2rem'}}>					
                <Flex justify='start' direction='column' className='list-top'>
                        <div className='top'></div>
                        <div className='bottom'></div>
                        <div className='user-box' style={{width:document.body.offsetWidth-40}}>
                            <Flex justify='start' direction='row' className='user-msg'>
								<span className='img'>
									<img src={detail.avatarUrl?detail.avatarUrl:'/imgs/iou/user.svg'} />
                                </span>
                                <span className='text'>
                                    <span className='name'>{detail.fullName}</span>
                                    <span className='tel num-font'>{detail.telephone}</span>
                                </span>
                                <span className='btn'>
                                    信用报告
                                </span>
                            </Flex>
                            <Flex justify='start' direction='row' className='user-money'>
                                <div className='money-1'>
                                    <span className='money num-font'>
                                        {detail.toReceiveAmount}<span>元</span>
                                    </span>
                                    <span className='text'>
                                        待收金额
                                    </span>
                                </div>
                                <div className='money-2'>
                                    <span className='money num-font'>
                                        {detail.toRepayAmount}<span>元</span>
                                    </span>
                                    <span className='text'>
                                        待还金额
                                    </span>
                                </div>
                                <div className='money-3'>
                                    <span className='money num-font'>
                                        {detail.currentGuaranteeAmount}<span>元</span>
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
                            <span className='time-text num-font'>{detail.createDate}</span>
                        </List.Item>
                        <List.Item extra={detail.borrowerName}>借款人</List.Item>
                        <List.Item extra={detail.lenderName}>出借人</List.Item>
                        <List.Item extra={detail.amount+'元'}>借款金额</List.Item>
                        <List.Item extra={detail.formatTime}>借款时长</List.Item>
                        <List.Item extra={detail.interestRate+'%'}>借款利率</List.Item>
                        <List.Item extra={detail.purpose}>借款用途</List.Item>
                        <List.Item extra={detail.originalId}>借条ID</List.Item>
                        <List.Item extra={detail.createDate}>创建时间</List.Item>
                        <List.Item extra={<Link to="/agree/iou" className="link">点击查看/下载</Link>}>
                        借款协议</List.Item>
                    </List>   
                </div>             
                <div className="common-btn_box">
                    <Tap onTap={this.onReject} className='span font16'>
                        驳回
                    </Tap>	
                    <Tap onTap={this.onConfirm} className='c-black span font16 active'>
                        借给TA
                    </Tap>
                </div>
            </div>
		)
	}
}