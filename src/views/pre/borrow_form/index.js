//首页 => 我要借款
import '../form.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { List, DatePicker, Picker, Flex, Checkbox } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Loading, Modal, util, rules, math } from 'SERVICE'
import { Tap, InputComt, InputMoney, Button } from 'COMPONENT'

//定义常量
//分期次数
const c_times=[
	{label:'3期',value: 3},
	{label:'6期',value: 6},
	{label:'12期',value: 12},
];
//是否需要担保
const c_guarantors = [
	{label:'不需要',value:0},
	{label:'需要',value:1}
]
//是否公开借款
const c_isPublic = [
	{label:'不公开',value:0},
	{label:'公开',value:1}
]

//利率
const c_rate = []
//担保利率
const c_guarantorRate = []

const c_currentDate = new Date(Date.now());

@withRouter
@inject('userStore','preBorrowStore')
@observer
class Page extends Component {
	constructor (props, context) {
		document.title = "我要借款";
		super(props, context)

		for(let i=0;i<=24;i++){
			c_rate.push({
				label:i+"%",
				value:i
			})
		}
		for(let i=0;i<=10;i++){
			c_guarantorRate.push({
				label:i+"%",
				value:i
			})
        }
        
		this.state = {
			pop1:false
		};
	}

	componentDidMount(){
        //获取用户可借额度
        this.props.userStore.getUserBorrowAmt();
        //检查用户信用认证
        this.props.userStore.checkUserCredit();
    }

	//修改本金
	amtChange=(v)=>{
		const { isGuarantor, guarantorRate} = this.props.preBorrowStore.form;
		//手续费
		let fee = v*0.01;
		//当保费
		let guarantorFee = 0;
		if(isGuarantor){
			guarantorFee = $.to2(v*guarantorRate/100);
		}
		this.props.preBorrowStore.setForm({
			amount:v,
			fee,
			guarantorFee,
		},()=>{
			this.getMoney();
		});
	}

	//修改还款日期
	dateChange=(v)=>{
		this.props.preBorrowStore.setForm({
			end:v
		},()=>{
			this.getMoney();
		})
	}

	//获取计算后的金额列表
	getMoney=()=>{
		const { amount,repayType,period,end,rate } = this.props.preBorrowStore.form;
		let dates = util.iouComputedDays(end,c_currentDate);
		if(repayType){
			let ob = util.iouInstallment(amount,rate/100/12,period);
			this.props.preBorrowStore.setForm({
				interest:ob.total_i,
				//amount:ob.total,
				timeList:ob.list
			});
		}else{
			let total_i = $.to2(amount*rate*dates/36500);
			let total = amount + total_i;
			let timeList = [{
				date:c_currentDate.DateAdd('m',dates).Format('yyyy-MM-dd'),
				fee:total
			}];
			this.props.preBorrowStore.setForm({
				interest:total_i,
				//amount:total,
				timeList
			});
		}	
	}

	//获取分期列表
	getTimeList=(times,amount) =>{
		let list = [];
		let fee = (amount/times).toFixed(2);
		for(let i=1;i<=times;i++){
			list.push({
				date:c_currentDate.DateAdd('m',i).Format('yyyy-MM-dd'),
				fee
			})
		}
		return list;
	}

	//是否统一借款协议
	onAgreementChange=(v) =>{
		this.props.preBorrowStore.setForm({
            checked:v.target.checked
        });
	}
	//查看协议
	onAgreement=() =>{
		let values = this.props.form.getFieldsValue();
        let _state = this.state;
		_state.date_repayment = _state.date_repayment.getTime();
		sessionStorage.setItem('pre_borrow_form',JSON.stringify(Object.assign(_state,values)));
		// this.props.history.push({
		this.props.history.push({
			pathname: '/agree/iou'
		});
	}
	//切换还款方式
	onRepayType=(ob) =>{
		this.props.preBorrowStore.setForm({
			repayType:ob
		});
	}

	//切换标签
	onTab=(ob,type) =>{
		const { preBorrowStore } = this.props;
		if(type=='use'){
			preBorrowStore.setForm({
				use:ob
			});
		}else if(type=='repayType'){
			preBorrowStore.setForm({
				period:ob.value
			},() =>{
				this.getMoney();
			});
		}else if(type=='guarantor'){
			preBorrowStore.setForm({
				isGuarantor:ob.value
			});
		}else if(type=='public'){
			preBorrowStore.setForm({
				isPublic:ob.value
			});
		}else{

		}
	}

	//选择框改变
	pickerChange=(v,type) =>{
		const { preBorrowStore,preBorrowStore:{form} } = this.props;
		if(type=='rate'){
			//利率
			let timeList = this.getTimeList(v[0],form.amount);
			preBorrowStore.setForm({
				rate:v[0],
				timeList
			},()=>{
				this.getMoney();
			});
		}else if(type=='guarantorRate'){
			//担保费率
			let guarantorFee = $.to2(form.amount*v[0]/100);
			preBorrowStore.setForm({
				guarantorRate:v[0],
				guarantorFee
			});
		}else{

		}
	} 

	//验证提示
	onValid=()=>{
		const { preBorrowStore:{form} } = this.props;
        if(form.use==null){
			Modal.tip('请选择借款用途');
			return;
        }

        if(!form.checked){
			Modal.tip('请同意借款协议');
			return;
        }
	}

	//检查用户状态信息
    onCheckSubmit=()=>{
        let _this = this;
		let { userStore } = this.props;
		//判断是否有正在求借款
        // if(sessionStorage.getItem('pre_borrow_form_state')){
        //     Modal.infoX('同一时间只能有一个求借款！');
        //     return
        // }       
		//检查用户举报状态
		Loading.show();
        if(userStore.checkUserReport()){            
            //更新用户认证信息
            userStore.getUserCreditInfo(()=>{
                //检查运营商认证
                if(userStore.checkUserMobileCredit(0)){
                    //检查学信认证
                    if(userStore.checkUserXueXin()){
                        _this.setState({
                            pop1:true,
                        });
                    }
                }
            });
        }
    }

	//获取表单数据
	onBtn=(ob)=>{		
		this.onCheckSubmit();
	}

	//确认提示提交表单
	onCloseDialog=()=>{
		this.setState({
			pop1:false
		});

		this.props.userStore.setBox({
			pwd:true,
			onPwdEnd:this.onPwdConfirm
		});
	}

	//获取密码
	onPwdConfirm=(pwd)=>{
		const { userStore,preBorrowStore,preBorrowStore:{form} } = this.props;
		userStore.setBox({
			pwd:false
		});
		let repayTime = Math.round(form.end.getTime()/1000);
		if(this.state.repayWay){
			repayTime = Math.round(c_currentDate.DateAdd('m',form.period).getTime()/1000);
		}
		let postData = {
			//支付密码
			payPassword:pwd,
			//借钱金额
			amount:$.toFen(form.amount),
			//还款方式(int)0.到期还本付息1.等额本息（按月还款，最后一次性付清所有本息）
			repayType:form.repayType,
			//等额本息的期次，一期代表一个月
			period:form.repayType?form.period:1,
			//预期还款日期
			repayTime,  //如果选择日期为XX天，则实际结束时间为XX天23时59分59秒,所以需要加时间	
			//年化利率
			interestRate:form.rate,
			//借款用途
			purposeType:form.use.value,
			//补充说明
			memo:'',	
			//是否需要担保人(int)0.否 1.是
			guaranteeStatus:form.isGuarantor,
			//担保人费用比例，一旦交易达成立刻支付，范围为0~24%，这里以1%为单位，存储0~24之间的整数
			guaranteeRate:form.guarantorRate,	
			//是否公开
			publicStatus:form.isPublic,
			//图片列表
			picList:[],
			//标的来源 0:正常渠道 1:新手引导
			bidSource:0
		};
		Loading.show();
		//创建借款
		$.ajaxE({
			type: 'POST',
			url: '/loanpre/bid/addBid',
			data:postData
		}).then((data)=>{
			preBorrowStore.setForm({
				id:data
			});
			this.props.history.push({
				pathname: '/pre/borrow_success'				
            });
		}).catch((msg)=>{
			Modal.infoX(msg);
		}).finally(()=>{
			Loading.hide();
		}) 
	}
  
	render() {
		const { getFieldProps,getFieldError } = this.props.form;
        const { userStore,preBorrowStore:{form} } = this.props;
		return (
            <div className="view-iou-form">
                <List className='content'>                    
                    <Flex justify='start' className='list-title'>
                        <span className='title'>借款金额</span>
                        <span className="text">您当前可借款额度{userStore.borrowAmt}元</span>
                    </Flex>

                    <Flex justify='center' className="mart20">
                        <span>
                            <List.Item>
                                <InputMoney
                                    type="digit" 
									className="login_input num-font"
									min={300}
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
                        <span className='title'>还款方式</span>
                    </Flex>

					<Flex justify='center' className='tab tab-1'>
                        <Tap onTap={()=>{this.onRepayType(1)}}>
                            <span className={form.repayType==1?'selected':''}>等额本息</span>
                        </Tap>
                        <Tap onTap={()=>{this.onRepayType(0)}}>
                            <span className={form.repayType==0?'selected':''}>到期还本付息</span>
                        </Tap>
                    </Flex>

					{form.repayType?<Flex justify='start'>
                        <div className='use-content'>
                        {c_times.map((item)=>{
                            return <Tap onTap={()=>{this.onTab(item,'repayType')}} key={Math.random()}>
                                    <span className={form.period==item.value?'use-item selected':'use-item'}>
                                        <span>{item.label}</span>
                                    </span>
                                </Tap>
                        })}
                        </div>
                    </Flex>
                    :<Flex justify='center' className="mart20">
                        <span className='date-picker'>
							<List.Item>
								{c_currentDate.Format('yyyy年MM月dd日')}
								<List.Item.Brief>借款日期</List.Item.Brief>
							</List.Item>
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
                    </Flex>}

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
                                onOk={(v)=>{this.pickerChange(v,'rate')}}>
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

                    <Flex justify='start' className='list-title'>
                        <span className='title'>是否需要担保人</span>
                    </Flex>
					<Flex justify='start'>
                        <div className='use-content'>
                        {c_guarantors.map((item)=>{
                            return <Tap onTap={()=>{this.onTab(item,'guarantor')}} key={Math.random()}>
                                    <span className={form.isGuarantor==item.value?'use-item selected':'use-item'}>
                                        <span>{item.label}</span>
                                    </span>
                                </Tap>
                        })}
                        </div>
                    </Flex>

					{form.isGuarantor?<Flex justify='start' className='list-title'>
                        <span className='title'>担保费率</span>
                    </Flex>:null}
                    {form.isGuarantor?<Flex justify='center'>
                        <span className='date-picker line'>
                            <Picker
                                data={c_rate}
                                cols={1}
                                title="担保费率"
                                value={[form.guarantorRate]}
                                onOk={(v)=>{this.pickerChange(v,'guarantorRate')}}>
                                <List.Item>
                                    {form.guarantorRate==null?<span className='rate'>0~24之间%</span>
                                    :<span className='interest'>
                                        <span className='text1'>{form.guarantorRate}</span>
                                        <span className='bf'>%</span>
                                        <span className='yuan'> 费用:{form.guarantorFee}元</span></span>}
                                </List.Item>
                            </Picker>
                        </span>
                    </Flex>:null}

					{form.amount?<div className="money-div">
						<Flex justify='start' direction='column'>
							<div className='div-1'>
								<span>实际到账金额</span>
								<span>{$.to2(form.amount-form.guarantorFee-form.fee)}</span>
							</div>
							<span className='span-1'>
								借款金额{form.amount.toFixed(2)} - 担保费{form.guarantorFee.toFixed(2)} - 手续费{form.fee.toFixed(2)}
							</span>
						</Flex>

						<Flex justify='start' direction='column'>
							<div className='div-1'>
								<span>预期到期本息</span>
								<span>{$.to2(form.amount + form.interest)}</span>
							</div>							
							<span className='span-1'>
								本金{form.amount.toFixed(2)} + 利息{form.interest.toFixed(2)}(假设是今天借到款)
							</span>
						</Flex>
						<Flex justify='center'>
							<span>还款详情</span>
						</Flex>
						{form.repayType?form.timeList.map((node)=>{
							return <Flex justify='between'>
								<span>{node.date}</span>
								<span>{node.fee}</span>
							</Flex>
						}):<Flex justify='between'>
							<span>{form.end.Format('yyyy-MM-dd')}</span>
							<span>{form.amount}</span>
						</Flex>}
                    </div>:null}

					<Flex justify='start' className='list-title'>
                        <span className='title'>借款用途</span>
                    </Flex>
                    <Flex justify='start'>
                        <div className='use-content'>
							{$.purpose().map((item)=>{
								return <Tap onTap={()=>{this.onTab(item,'use')}} key={Math.random()}>
										<span className={form.use!=null && form.use.value==item.value?'use-item selected':'use-item'}>
											<span>{item.label}</span>
										</span>
									</Tap>
							})}
                        </div>
                    </Flex>

					<Flex justify='start' className='list-title'>
                        <span className='title'>是否公开求借款</span>
                    </Flex>
					<Flex justify='start'>
                        <div className='use-content'>
							{c_isPublic.map((item)=>{
								return <Tap onTap={()=>{this.onTab(item,'public')}} key={Math.random()}>
										<span className={form.isPublic==item.value?'use-item selected':'use-item'}>
											<span>{item.label}</span>
										</span>
									</Tap>
							})}
                        </div>
                    </Flex>

                    <Flex justify='center' className="mart15 mab8">
                        <Checkbox.AgreeItem checked={form.checked} onChange={this.onAgreementChange}>
                            已阅读并同意
                            <Tap onTap={this.onAgreement}><a className="mainC1">《今借到借款协议》</a></Tap>
                        </Checkbox.AgreeItem>
                    </Flex>
                </List>
                <div className='common-btn_box'>
                    <Button onBtn={this.onBtn}
                        onValid={this.onValid}
                        editable={form.use!=null && form.checked}
                        form={this.props.form}
                    >确定</Button>
                </div>

				<Modal visible={this.state.pop1}
					transparent
					maskClosable={false}
					footer={[
					{ text: '知道啦', onPress:this.onCloseDialog}]}>
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
