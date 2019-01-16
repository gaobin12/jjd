//首页 => 补借条
import '../../pre/form.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Flex, List, DatePicker, Picker, Checkbox } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Loading, Modal, util, math } from 'SERVICE'
import { Tap, InputComt, InputMoney, Button, Side } from 'COMPONENT'

const c_rate = [];
const c_current = new Date(Date.now());

@withRouter
@inject('userStore','preIouStore')
@observer
class Page extends Component {
	constructor (props, context) {
		document.title = "补借条";
		super(props, context)		
		for(let i=0;i<=24;i++){
			c_rate.push({
				label:i+"%",
				value:i
			})
        }
        //不在提示
        let pop1 = props.userStore.userLocal.iouFormNoAgain;
		this.state = {
            //坚持补借条
            pop1:!pop1,
            pop2:false
        };
	}
	componentDidMount(){
        //获取用户可借额度
        this.props.userStore.getUserBorrowAmt();
        //检查用户信用认证
        this.props.userStore.checkUserCredit();
    }

    onTab=(ob)=>{
        this.props.preIouStore.setIouForm({tab:ob});
    }

    onTabUse=(ob)=>{
        this.props.preIouStore.setIouForm({use:ob});
    }

    //试试去出借
    onTaploan=(type)=>{
        if(type){
            this.props.history.push({
                pathname: '/pre/loan_mine'
            });
        }else{
            this.props.history.push({
                pathname: '/pre/borrow_form'
            });
        }
    }

	//修改日期
	dateChange=(value,type)=>{
		let { preIouStore } = this.props;
		if(type=='borrow'){
            preIouStore.setIouForm({
                start:value
            },()=>{
                this.moneyChange();
            })
		}else{
            preIouStore.setIouForm({
                end:value
            },()=>{
                this.moneyChange();
            })
		}
    }
    
	//修改利率
	pickerChange=(v)=>{
        let { preIouStore } = this.props;
        preIouStore.setIouForm({
			rate:v[0]
		},()=>{
			this.moneyChange();
		});
	}
	//修改本金
	amtChange=(v)=>{
        let { preIouStore } = this.props;
        preIouStore.setIouForm({
			amount:v
		},()=>{
			this.moneyChange();
		});
    }
    
	moneyChange=()=>{
        let { start,end,rate,amount,interest,totalAmt } = this.props.preIouStore.form;
		let datas = util.iouComputedDays(end,start);
		interest = util.iouComputedInterest(amount,rate,datas);
        totalAmt = util.iouComputedAmount(amount,interest);
        this.props.preIouStore.setIouForm({
            interest:$.to2(interest),
            totalAmt
		})
    }
    
    //修改借款人或出借人
    onNameChange=(e)=>{        
        this.props.preIouStore.setIouForm({
            pname:e
        });
    }

    //点击提交按钮
    onBtn=(ob)=>{
        let _this = this;
        const { form } = this.props.preIouStore;
        let dates = util.iouComputedDays(form.end,c_current);
        if(dates < 1){
            Modal.alertX('提醒', '该借条的还款日期早于当前时间，借条生效后马上就会产生逾期，请您再次确认还款日期无误', [
                {
                    text: '返回修改', onPress: () => null
                },
                { text: '确认无误', onPress: _this.onCheckSubmit },
            ]) 
        }else if(dates < 3){
            Modal.alertX('提醒', '距离该借条还款日不足3天，借条生效后很快就会产生逾期，请您再次确认还款日期无误', [
                {
                    text: '返回修改', onPress: () => null
                },
                { text: '确认无误', onPress: _this.onCheckSubmit },
            ])
        }else{
            _this.onCheckSubmit();
        }
    }

    //检查用户状态信息
    onCheckSubmit=()=>{
        let _this = this;
        let { userStore,preIouStore } = this.props;
        //检查用户举报状态
        if(userStore.checkUserReport()){
            Loading.show();
            //更新用户认证信息
            userStore.getUserCreditInfo(()=>{                
                //检查运营商认证
                if(userStore.checkUserMobileCredit(preIouStore.form.tab)){
                    //检查学信认证
                    if(userStore.checkUserXueXin()){
                        Loading.hide();
                        _this.setState({
                            pop2:true,
                        });
                    }
                }else{
                    Loading.hide();
                }
            });
        }
    }
    
    onPress=()=>{
        let { userStore } = this.props; 
        this.setState({
            pop2:false
        });
        userStore.setBox({
            pwd:true,
            onPwdEnd:this.onPwdConfirm
        });
        // if(form.tab){
        //     //出借人极速补借条  输入密码提交表单
        //     userStore.setBox({
        //         pwd:true,
        //         onPwdEnd:this.onPwdConfirm
        //     });
        // }else{
        //     //借款人极速补借条  提交表单 支付8元
        //     userStore.setBox({
        //         pay:true,
        //         money:8,
        //         onPayEnd:this.onPayApply
        //     });
        // }        
    }

    //确认密码
	onPwdConfirm=(pwd)=>{
        const { userStore,preIouStore:{form} } = this.props;
        userStore.setBox({
            pwd:false
        });
        this.submitData(pwd,()=>{
            debugger;
            if(form.tab){
                //出借人极速补借条
                this.props.history.push({
                    pathname: '/user/share'
                });	
            }else{
                //借款人极速补借条
                userStore.setBox({
                    pay:true,
                    money:8,
                    onPayEnd:this.onPayApply
                });
            }
        });
    }

    //提交表单数据
    submitData=(pwd,callBack)=>{
        const { userStore,preIouStore,preIouStore:{form} } = this.props;        
		let postData = {
			// 支付密码
			payPassword:pwd,
			// 金额
			amt:$.toFen(form.amount),
			// 借钱日期
			borrowDate:Math.floor(form.start/1000),
			// 预期还钱日期
			repayDate:Math.floor(form.end/1000),
			// 年化利率
			interestRate:form.rate,
			// 借钱用途
			purpose:form.use.value,
			// 用户补充说明
			memo:'',
			// 出借人姓名
			lenderName:'', 
			// 借款人姓名
			borrowerName:'',
			// 创建的类型，0为作为借款人，1为出借人
			creatorType:form.tab,
			// 图片列表
			picList:[]
        };
        if(form.tab){
            postData.borrowerName = form.pname;
        }else{
            postData.lenderName = form.pname;
        }
        debugger;
		Loading.show();
		$.ajaxE({
			type: 'POST',
			url: '/loanpre/loanFast/add',
			data: postData
		}).then((data)=>{
            //微信分享设置
            $.setItem('wx_share',{
                id:data,
                path:'/pre/iou_detail',
                amt:postData.amt/100,
                rate:postData.interestRate,
                purpose:postData.purpose,
                param: {
                    loanType: 3,
                    loanTypeStr: '急速借条',
                    creatorType: postData.creatorType?'出借人':'借款人',
                    rate:postData.interestRate,
                    creatorName: userStore.userInfo.userName,
                    repayDate: (new Date(postData.repayDate * 1000)).Format('yyyy-MM-dd'),
                }
            });
            preIouStore.setIouForm({
                id:data
            });
            callBack && callBack();
		}).catch((msg)=>{
			Modal.infoX(msg);
		}).finally(()=>{
            Loading.hide();
        })
    }	

    //支付
	onPayApply=(data)=>{
        debugger;
        const _this = this;
        const { userStore,preIouStore:{form} } = this.props;
        let postData = {
            bindBankId:data.bindBankId, // 绑卡id(银行卡绑定表ID)
			loanOfflineId:form.id, // 加密后的极速借条id
			amount:800, // 极速借条手续费
			payPassword:data.payPassword, // 密码
			payMethod:data.payMethod, // 支付方式 ：0.余额 1.银行卡 2.线下 3.银联(收银台类) 4.微信(app类)
		}
		if($.isWeiXin && data.payMethod==0){
            _this.state.payData = postData;
            userStore.setBox({
                pay:false,
                code:false
            });
            _this.onPayComfirm();
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
							pathname: '/user/share'
						});
					})        
                }else if(data.payMethod==3){
                    //银联支付
                    //localStorage.setItem('fast-supply_back',JSON.stringify(shareData));
                    //银联支付
                    $.payYinLian(res.payToken);
                }else if(data.payMethod==4){
                    //微信支付
                    //localStorage.setItem('fast-supply_back',JSON.stringify(shareData));
                    let payToken = JSON.parse(res.payToken)
                    $.payWeiXin(payToken);					
                }else{
					//确认支付   余额和银行卡需要
					 //orderNo:22,payChannelType:1,payOrderNo:22,payToken:22 
					 let payData = {
						loanOfflineId: form.id, //Long 求借款id
						amount:$.toFen(data.amount),
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
                        onCodeEnd:function(){
                            _this.props.history.push({
                                pathname: '/user/share'
                            });
                        }
                    });
				}
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
	}

	//验证码确认支付 onPayComfirm
    onPayComfirm=(valus)=>{
		//debugger;
        const _this = this;
        const { userStore,preIouStore:{form} } = this.props;
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
    
    //底部按钮点击认证
    onValid=()=>{
        const { preIouStore:{form} } = this.props;
        if(!form.use){
            Modal.tip('请选择借款用途');
            return;
        }

        if(!form.pname){
            Modal.tip('请输入对方姓名');
            return;
        }

        if(!form.checked){
            Modal.tip('请同意借款协议');
            return;
        }
    }

    //是否同意借款协议
	onAgreementChange=(v)=>{
        this.props.preIouStore.setIouForm({
            checked:v.target.checked
        });
    }

    //不在提示
    onNoAgain=(e)=>{
        this.props.userStore.setUserLocal({
            iouFormNoAgain:e.target.checked?1:0
        });
    }

	render() {
        const { getFieldProps,getFieldError } = this.props.form;
        const { userStore,preIouStore:{form} } = this.props;
		return (
            <div className="view-iou-form">
                <List className='content'>
                    <Flex justify='center' className='tab'>
                        <Tap onTap={()=>{this.onTab(0)}}>
                            <span className={form.tab==0?'selected':''}>我是借款人</span>
                        </Tap>
                        <Tap onTap={()=>{this.onTab(1)}}>
                            <span className={form.tab==1?'selected':''}>我是出借人</span>
                        </Tap>
                    </Flex>
                    <Flex justify='start' className='list-title'>
                        <span className='title'>借款金额</span>
                        <span className="text">您当前可借款额度{this.props.userStore.borrowAmt}元</span>
                    </Flex>

                    <Flex justify='center' className="mart20">
                        <span>
                            <List.Item>
                                <InputMoney
                                    type="digit" 
                                    className="login_input num-font"
                                    max={userStore.borrowAmt}
                                    errorText={getFieldError('amount')}
                                    {...getFieldProps('amount', {
                                        initialValue:form.amount,
                                        onChange:this.amtChange,
                                        rules: [
                                            { required: true, message: '请输入借款金额' }
                                        ]
                                    })}>                         
                                </InputMoney>
                            </List.Item>
                        </span>
                    </Flex>
                    
                    <Flex justify='start' className='list-title'>
                        <span className='title'>选择日期</span>
                    </Flex>
                    <Flex justify='center' className="mart20">
                        <span className='date-picker'>
                            <DatePicker
                                mode="date"
                                title="借款日期"
                                maxDate={form.end}
                                value={form.start}
                                onChange={(v)=>{this.dateChange(v,"repayment")}}>
                                <List.Item arrow="horizontal">
                                    {form.start.Format('yyyy年MM月dd日')}
                                    <List.Item.Brief>借款日期</List.Item.Brief>
                                </List.Item>
                            </DatePicker>
                        </span>
                        <span className='date-picker'>
                            <DatePicker
                                mode="date"
                                title="还款日期"
                                minDate={form.start}
                                value={form.end}
                                onChange={(v)=>{this.dateChange(v,"repayment")}}>
                                <List.Item arrow="horizontal">
                                    {form.end.Format('yyyy年MM月dd日')}
                                    <List.Item.Brief>还款日期</List.Item.Brief>
                                </List.Item>
                            </DatePicker>
                        </span>
                    </Flex>

                    <Flex justify='start' className='list-title'>
                        <span className='title'>年化利率</span>
                    </Flex>
                    <Flex justify='center'>
                        <span className='date-picker line'>
                            <Picker
                                data={c_rate}
                                cols={1}
                                title="年化利率"
                                value={[form.rate]}
                                onOk={(v)=>{this.pickerChange(v,'guarantorRate')}}>
                                <List.Item>
                                    {form.rate==null?<span className='rate'>0~24之间%</span>
                                    :<span className='interest'>
                                        <span className='text1'>{form.rate}</span>
                                        <span className='bf'>%</span>
                                        <span className='yuan'> 利息:{$.to2(form.interest)}元</span></span>}
                                </List.Item>
                            </Picker>
                        </span>
                    </Flex>

                    <Flex justify='center' className="rate-div active">
                        <span>本金{$.to2(form.amount).toFixed(2)}+利息{$.to2(form.interest).toFixed(2)}=到期本息{$.to2(form.totalAmt).toFixed(2)}</span>
                    </Flex>

                    <Flex justify='start' className='list-title'>
                        <span className='title'>借款用途</span>
                    </Flex>

                    <Flex justify='start'>
                        <div className='use-content'>
                        {$.purpose().map((item)=>{
                            return <Tap onTap={()=>{this.onTabUse(item)}} key={Math.random()}>
                                    <span className={form.use && form.use.value==item.value?'use-item selected':'use-item'}>
                                        <span>{item.label}</span>
                                    </span>
                                </Tap>
                        })}
                        </div>
                    </Flex>

                    <Flex justify='start' className='list-title'>
                        {form.tab?<span className='title'>对方姓名(借款人)</span>:<span className='title'>对方姓名(出借人)</span>}
                    </Flex>

                    <Flex justify='center' className="mart8">
                        <span>
                            <List.Item className="border_bott">
                                <InputComt
                                    type="text" 
                                    className="login_input"                                    
                                    placeholder="填写正确才能生效哦"
                                    errorText={getFieldError('pname')}
                                    {...getFieldProps('pname', {
                                        initialValue:form.pname,
                                        onChange:this.onNameChange,
                                        rules: [
                                            { required: true, message: '请输入姓名' }
                                        ]
                                    })}>                         
                                </InputComt>
                            </List.Item>
                        </span>
                    </Flex>

                    <Side>
                        <p>提示</p>
                        <p>补借条，不能线上走账，不支持逾期催收，存在较大的风险，如果不是非常亲密的关系，不建议您使用此功能</p>
                        <p>如果您是现金交易请不要补借条，一旦发生争议，因为双方无法提供交易证据，平台会将借条置为有争议状态</p>
                        <p>补借条的待确认有效期为3天，到期自动关闭</p>
                        <p>补借条不支持线上出借，请确保你们已经线下交易完毕</p>
                    </Side>

                    <Flex justify='center' className="mart15 mab8">
                        <Checkbox.AgreeItem checked={form.checked}  onChange={this.onAgreementChange}>
                            已阅读并同意
                            <span className="mainC1" onClick={(e) => { e.preventDefault();}}>《今借到借款协议》</span>
                        </Checkbox.AgreeItem>
                    </Flex>
                </List>
                <div className='common-btn_box'>
                    <Button onBtn={this.onBtn}
                        onValid={this.onValid}
                        editable={form.use && form.checked}
                        form={this.props.form}
                        fields={['pname']}
                    >确定</Button>
                </div>

                {form.tab?<Modal visible={this.state.pop1}
                        transparent
                        maskClosable={false}
                        footer={[
                            { text: '坚持补借条', onPress: () => {this.setState({pop1:false})}},
                            { text: '试试去出借', onPress: () => {this.onTaploan(1)}}]}>
                            <div className="model_common">
                                <img src={'/imgs/iou/model-error.svg'} className="model_img" />
                                <div className="model_tit">补借条有风险，推荐去出借</div>
                                <div className="model_font mart16 marb0">
                                补借条不享受服务费和逾期管理费奖励政策，不能线上走账，不支持逾期催收，存在较大风险，如果不是非常亲密的关系，
                                建议您使用<span>去出借</span>功能
                                </div>
                                <Checkbox.AgreeItem onChange={this.onNoAgain} className="checkbox_comm_div">
                                    不在提示
                                </Checkbox.AgreeItem>
                            </div>
                    </Modal>:<Modal visible={this.state.pop1}
                        transparent
                        maskClosable={false}
                        footer={[
                            { text: '坚持补借条', onPress: () => {this.setState({pop1:false})}},
                            { text: '试试求借款', onPress: () => {this.onTaploan(0)}}]}>
                            <div className="model_common">
                                <img src={'/imgs/iou/model-error.svg'} className="model_img" />
                                <div className="model_tit">补借条有风险，推荐求借款</div>
                                <div className="model_font mart16 marb0">
                                补借条不能通过平台走账，存在较大的欺诈风险，请确保已经收到钱再来补借条，如果不是非常亲密的关系，
                                建议您使用<span>求借款</span></div>
                                <Checkbox.AgreeItem onChange={this.onNoAgain} className="checkbox_comm_div">
                                    不在提示
                                </Checkbox.AgreeItem>
                            </div>
                    </Modal>}
                    <Modal visible={this.state.pop2}
                        transparent
                        maskClosable={false}
                        footer={[
                        { text: '知道啦', onPress: this.onPress}]}>
                        <div className="model_common">
                            <img src={'/imgs/iou/model-error.svg'} className="model_img" />
                            <div className="model_tit">任何要求私下还款的都是诈骗</div>
                            <div className="model_font mart16">请您<span>务必通过今借到线上还款</span>,否则该借条不能自动完结,还会产生逾期记录。今借到到不承认任何私下还款方式(支付宝/微信/银行卡等),请谨慎操作严防诈骗。</div>
                        </div>
                    </Modal>
            </div>
		);
	}
}

export default createForm()(Page)
