//首页 => 我要借款
import '../form.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { List, Picker, Flex, Checkbox } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Loading, Modal, util, math } from 'SERVICE'
import { Tap, InputMoney, Button } from 'COMPONENT'

const c_currentDate = new Date(Date.now());

@withRouter
@inject('userStore','preProductStore','preLoanStore')
@observer
class Page extends Component {
	constructor (props, context) {
		document.title = "马上申请";
		super(props, context)
		this.state = {
			pop1:false
		};
	}

	componentDidMount(){
	}
	
	//修改本金
	amtChange=(v)=>{
		const { preProductStore:{detailOther},preLoanStore } = this.props;
		//本金
		let amt = parseInt(v);
		//手续费
		let fee = $.to2(amt*0.01);
		preLoanStore.setForm({
			amount:amt,
			fee:fee
		},()=>{
			if(preLoanStore.form.times){
				this.moneyChange();
			}
		})
	}

	moneyChange=()=>{
        const { preProductStore:{detailOther},preLoanStore,preLoanStore:{form} } = this.props;        

		const t1 = parseInt(form.times.value.split('_')[0]),t2 = parseInt(form.times.value.split('_')[1]);
		if(detailOther.repayType){
			let ob = util.iouInstallment(form.amount,detailOther.interestRate/100/12,t1);
			preLoanStore.setForm({
				interest:ob.total_i,
				totalAmt:ob.total,
				timeList:ob.list
			})
		}else{
			let repayData;
			if(t2){
				repayData = c_currentDate.DateAdd('m',t1);
			}else{
				repayData = c_currentDate.DateAdd('d',t1);
			}
			let dates = util.iouComputedDays(repayData,c_currentDate);

			let total_i = $.to2(form.amount*detailOther.interestRate*dates/36500);
			let total = $.to2(form.amount + total_i);
			let timeList = [{
				date:c_currentDate.DateAdd('d',dates).Format('yyyy-MM-dd'),
				fee:total
			}];
			preLoanStore.setForm({
				interest:total_i,
				totalAmt:total,
				timeList
			})
		}
	}

	//选择框改变
	pickerChange=(v,type)=>{
		const { preProductStore:{detailOther},preLoanStore } = this.props;
		if(type=='times'){
			let ob = null;
			detailOther.timesArea.forEach((item)=>{
				if(item.value==v[0]){
					ob = item;
				}
			});
			preLoanStore.setForm({
				times:ob
			});
		}
	}

	//切换标签
	onTab=(ob,type)=>{
		if(type=='use'){
			this.props.preLoanStore.setForm({
				use:ob
			});
		}
	}

	//是否统一借款协议
	onAgreementChange=(v)=>{
		this.props.preLoanStore.setForm({
            checked:v.target.checked
        });
	}

	//验证提示
	onValid=()=>{
		const { preLoanStore:{form} } = this.props;

		debugger;
		if(form.times==null){
			Modal.tip('请选择借款时长');
			return;
        }

        if(form.use==null){
			Modal.tip('请选择借款用途');
			return;
        }

        if(!form.checked){
			Modal.tip('请同意借款协议');
			return;
        }
	}

	//获取表单数据
	onBtn=(ob)=>{
		this.setState({
			pop1:true
		})
	}

	//确认提示提交表单
	onCloseDialog=()=>{
		this.setState({
			pop1:false
		},()=>{
			this.props.userStore.setBox({
				pwd:true,
				onPwdEnd:this.onPwdConfirm
			})
		})
	}

	onPwdConfirm=(pwd)=>{
		const _this = this;
		this.props.userStore.setBox({
			pwd:false
		})
		const { preProductStore:{detailOther},preLoanStore:{form} } = this.props;
		let postData = {
			productId:detailOther.id, //String 加密后的产品id
			amount:$.toFen(form.amount), //Integer 借款金额
			period:form.times.value.split('_')[0], //Byte 借款期数/借款时长
			tmUnit:form.times.value.split('_')[1], // Byte 时间单位0.日1.月2.年
			purpose:form.use.value, //Byte 借款用途
			memo:'', //String 补充说明
			picList:[], //List APP:图片地址;微信：图片list
			payPassword:pwd, //String 支付密码	
		};
		Loading.show();
        $.ajaxE({
			flag: 1,
            type: 'POST',
			url: '/loanpre/product/addProductBid',
			data:postData
        }).then((json) => {
            switch (json.status) {
                case 200: {
                    Modal.alertX('提醒', '申请成功', [
                        {
                            text: '知道了', onPress: () => {
								_this.props.history.push({
                                    pathname: '/pre/loan_success'
                                })
                            }
                        }]
                    )
                    break;
                }
                case 201: {
                    Modal.infoX(json.msg);
                    break;
                }
                case 205: {
                    Modal.alertX('提醒', json.msg, [
                        {
                            text: '知道了', onPress: () => {
								_this.props.history.push({
                                    pathname: '/credit'
                                })
                            }
                        }]
                    )
                    break;
                }
            }
        }).catch((msg) => {
			Modal.infoX(msg);
        }).finally(()=>{
			Loading.hide();
		})
	}
  
	render() {
		const { getFieldProps,getFieldError } = this.props.form;
		const { userStore,preProductStore:{detailOther},preLoanStore:{form} } = this.props;
		let minAmt = $.toYuan(detailOther.minAmount),maxAmt = $.toYuan(detailOther.maxAmount);
		let pop2 = false;
		if(userStore.borrowAmt < minAmt){
			pop2 = true;
		}
		if(userStore.borrowAmt < maxAmt){
			maxAmt = userStore.borrowAmt;
		}
		return (
            <div className="view-iou-form">
                <List className='content'>   
                    <Flex justify='start' className='list-title'>
                        <span className='title'>借款金额</span>
                    </Flex>

                    <Flex justify='center' className="mart20">
                        <span>
                            <List.Item>
                                <InputMoney
                                    type="digit" 
									className="login_input num-font"
									min={minAmt}
                                    max={maxAmt}
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
                        <span className='title'>借款时长</span>
                    </Flex>
                    <Flex justify='center'>
                        <span className='date-picker line'>
                            <Picker
                                data={detailOther.timesArea}
                                cols={1}
                                title="借款时长"
                                value={[form.times?form.times.value:null]}
                                onOk={(v)=>{this.pickerChange(v,'times')}}>
                                <List.Item>
                                    {form.times==null?<span className='rate'>{detailOther.minTm+detailOther.minTxt+'至'+detailOther.maxTm+detailOther.maxTxt}</span>
                                    :<span className='interest'>
                                        <span className='text1'>{form.times.label}</span></span>}
                                </List.Item>
                            </Picker>
                        </span>
                    </Flex>

					{form.amount?<div className="money-div">
						<Flex justify='start' direction='column'>
							<div className='div-1'>
								<span>实际到账金额</span>
								<span>{$.to2(form.amount-form.guarantorFee-form.fee)}</span>
							</div>
							<span className='span-1'>
								借款金额{form.amount} - 担保费{form.guarantorFee} - 手续费{form.fee}
							</span>
						</Flex>

						<Flex justify='start' direction='column'>
							<div className='div-1'>
								<span>预期到期本息</span>
								<span>{$.to2(form.amount + form.interest)}</span>
							</div>							
							<span className='span-1'>
								本金{form.amount} + 利息{form.interest}(假设是今天借到款)
							</span>
						</Flex>
						<Flex justify='center'>
							<span>还款详情</span>
						</Flex>
						{form.timeList.map((node)=>{
							return <Flex justify='between'>
								<span>{node.date}</span>
								<span>{node.fee}</span>
							</Flex>
						})}
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

                    <Flex justify='center' className="mart15 mab8">
                        <Checkbox.AgreeItem checked={form.checked} onChange={this.onAgreementChange}>
                            已阅读并同意
                            <span className="mainC1" onClick={(e) => { e.preventDefault(); alert('agree it'); }}>《今借到借款协议》</span>
                        </Checkbox.AgreeItem>
                    </Flex>
                </List>
                <div className='common-btn_box'>
                    <Button onBtn={this.onBtn}
                        onValid={this.onValid}
                        editable={form.times!=null && form.use!=null && form.checked}
						form={this.props.form}
						fields={['amount']}
                    >确定</Button>
                </div>

				<Modal visible={this.state.pop1}
					transparent
					maskClosable={false}
					footer={[
					{ text: '知道啦', onPress: () => {this.onCloseDialog()}}]}>
					<div className="model_common">
						<img src={'/imgs/iou/model-error.svg'} className="model_img" />
						<div className="model_tit">任何要求私下还款的都是诈骗</div>
						<div className="model_font mart16">请您<span>务必通过今借到线上还款</span>,否则该借条不能自动完结,还会产生逾期记录。今借到到不承认任何私下还款方式(支付宝/微信/银行卡等),请谨慎操作严防诈骗。</div>
					</div>
				</Modal>

				<Modal visible={pop2}
					transparent
					maskClosable={false}
					footer={[
					{ text: '知道啦', onPress: () => {}}]}>
					<div className="model_common">
						<img src={'/imgs/iou/model-error.svg'} className="model_img" />
						<div className="model_font mart16">您的可借金额小于最小金额</div>
					</div>
				</Modal>
            </div>
		);
	}
}

export default createForm()(Page)