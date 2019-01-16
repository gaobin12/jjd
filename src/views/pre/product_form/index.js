//首页 => 我要借款
import '../form.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { List, Picker, Flex, Checkbox, TextareaItem } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Loading, Modal, util, rules, math } from 'SERVICE'
import { Tap, InputValid, Button } from 'COMPONENT'

//借款金额
const c_amtList=[
	{label:'300-1000元',value: '300-1000'},
	{label:'1000-3000元',value: '1000-3000'},
	{label:'3000-10000元',value: '3000-10000'},
	{label:'10000-50000元',value: '10000-50000'},
	{label:'50000-200000元',value: '50000-200000'}
];

//信用证明
const c_creditList = [
	{label:'京东',value:'requireJdInfo'},
	{label:'学信',value:'requireXuexinInfo'},
	{label:'征信',value:'requireZhengxinInfo'},
	{label:'车产证明',value:'requireCarInfo'},
	{label:'房产证明',value:'requireHouseInfo'},
	{label:'工作信息',value:'requireJobInfo'},
	{label:'收入证明',value:'requireIncomeInfo'},
	{label:'社保',value:'requireSbInfo'},
	{label:'公积金',value:'requireGjjInfo'}
];

//利率
const c_rate = []

//时间单位0.日1.月2.年
const c_times1 = ['3期','6期','12期'];
const c_times2 = ['2天','3天','7天','15天','21天','1个月','3个月','6个月','12个月','24个月','36个月'];


@withRouter
@inject('userStore','preProductStore')
@observer
class Page extends Component {
	constructor (props, context) {
		document.title = "添加出借";
		super(props, context)

		for(let i=0;i<=24;i++){
			c_rate.push({
				label:i+"%",
				value:i
			})
		}

		let t1 = [],t2 = [];
		c_times1.forEach((item,i)=>{
			t1.push({
				label:item,
				value:i
			})
		})

		c_times2.forEach((item,i)=>{
			t2.push({
				label:item,
				value:i
			})
		})
        
		this.state = {
			pop1:false,
			popPwd:false,
			pop11:false,
			pop12:false,
			pop21:false,
			pop22:false,
			time11:t1,
			time12:[],

			time21:t2,
			time22:[],
		};
	}

	componentDidMount(){
        // this.handleCheckCredit();
		// this.getBorrowAmt();
	}

	onSelect=(op)=>{
		if(op){
			this.setState({
				pop11:true
			})
		}else{
			this.setState({
				pop21:true
			})
		}
	}

	onTxtChange=(v)=>{
		this.props.preProductStore.setForm({
            memo:v
        });
	}
	
	//是否统一借款协议
	onAgreementChange=(v)=>{
		this.props.preProductStore.setForm({
            checked:v.target.checked
        });
	}

	//获取密码
	onPwdConfirm=(pwd)=>{
		debugger;
		this.setState({	
			popPwd:false
		});
		const { preProductStore,preProductStore:{form} } = this.props;
		let minTm,minTimeUnit,maxTm,maxTimeUnit;
		let amount1 = parseInt(form.amount.split('-')[0]);
		let amount2 = parseInt(form.amount.split('-')[1]);
		if(form.repayType){
			let time1 = c_times1[form.time11].replace('期','_1');
			let time2 = c_times1[form.time12].replace('期','_1');
			minTm = time1.split('_')[0];
			minTimeUnit = time1.split('_')[1];
			maxTm = time2.split('_')[0];
			maxTimeUnit = time2.split('_')[1];
		}else{
			let date1 = c_times2[form.time21].replace('天','_0').replace('个月','_1');
			let date2 = c_times2[form.time22].replace('天','_0').replace('个月','_1');
			minTm = date1.split('_')[0];
			minTimeUnit = date1.split('_')[1];
			maxTm = date2.split('_')[0];
			maxTimeUnit = date2.split('_')[1];
		}
		let postData = {
			//Integer 贷款下限
			minAmount: $.toFen(amount1),
			//Integer 贷款上限
			maxAmount: $.toFen(amount2),
			//Byte 还款方式0.到期还本付息1.等额本息
			repayType: form.repayType,
			//Byte 借款时间下限
			minTm,
			//Byte 借款时间上限
			maxTm,
			//Byte 借款下限时间单位0.日1.月2.年
			minTimeUnit,
			//Byte 借款上限时间单位0.日1.月2.年
			maxTimeUnit,
			//Byte 年化利率,范围为0~24%，这里以1%为单位，存储0~24之间的整数
			interestRate: form.rate,
			//String 补充说明
			memo: form.memo,
			//Byte 产品来源 0:正常渠道 1:新手引导
			productSource:0,
			//String 支付密码
			payPassword:pwd
		};		
		postData = Object.assign(postData,form.creditInfo);
		//////debugger;
		Loading.show();
		$.ajaxE({
			type: 'POST',
			url: '/loanpre/product/addProduct',
			data:postData
		}).then((data)=>{
			this.props.history.push({
                pathname: '/pre/product_list'
            });
		}).catch((msg)=>{   
			Modal.infoX(msg);
		}).finally(()=>{
            Loading.hide();
        })    
	}

	//切换标签
	onTab=(ob,type)=>{		
		const { preProductStore,preProductStore:{form} } = this.props;
		if(type=='creditInfo'){
			form.creditInfo[ob.value] = !form.creditInfo[ob.value];
			preProductStore.setForm({
				creditInfo:form.creditInfo
			});
		}
		if(type=='repayType'){
			preProductStore.setForm({
				repayType:ob
			});
		}
	}

	getTimeList=(ob)=>{
		const { preProductStore:{form} } = this.props;
		let arr = [];
		if(form.repayType){
			c_times1.forEach((item,i)=>{
				if(ob <= i){
					arr.push({
						label:item,
						value:i
					});
				}
			})
		}else{
			c_times2.forEach((item,i)=>{
				if(ob <= i){
					arr.push({
						label:item,
						value:i
					});
				}
			})
		}
		return arr;
	}

	//选择框改变
	pickerChange=(v,type)=>{
		const { preProductStore,preProductStore:{form} } = this.props;
		if(type=='rate'){
			//利率
			preProductStore.setForm({
				rate:v[0]
			});
		}

		if(type=='amount'){
			//利率
			preProductStore.setForm({
				amount:v[0]
			});
		}
	} 

	pickerOk=(v,type)=>{
		const { preProductStore,preProductStore:{form} } = this.props;
		if(type=='time11'){
			let arr = this.getTimeList(v[0]);
			preProductStore.setForm({
				time11:v[0],
				time12:v[0]
			});
			this.setState({
				pop11:false,
				pop12:true,
				time12:arr
			});
		}

		if(type=='time12'){
			preProductStore.setForm({
				time12:v[0]
			});
			this.setState({
				pop12:false
			});
		}

		if(type=='time21'){
			let arr = this.getTimeList(v[0]);
			preProductStore.setForm({
				time21:v[0],
				time22:v[0]
			});
			this.setState({
				pop21:false,
				pop22:true,
				time22:arr
			});
		}

		if(type=='time22'){
			preProductStore.setForm({
				time22:v[0]
			});
			this.setState({
				pop22:false
			});
		}
	}	

	//验证提示
	onValid=()=>{
		const { preProductStore:{form} } = this.props;
        if(form.amount == null){
			Modal.tip('请选择借款金额');
			return;
		}
		
		if(form.repayType){
			if(form.time11==null || form.time12==null){
				Modal.tip('请选择分期还款时间');
				return;
			}			
        }else{
			if(form.time21==null || form.time22==null){
				Modal.tip('请选择到期还款时间');
				return;
			}
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
			pop1:false,
			popPwd:true
		})
	}
  
	render() {
		const { getFieldProps,getFieldError } = this.props.form;
		const { pop1,popPwd,pop11,pop12,pop21,pop22,time11,time12,time21,time22 } = this.state;
		const { userStore,preProductStore:{form} } = this.props;
		let btnEditable = form.checked;
		if(form.repayType){
			if(form.time11==null || form.time12==null){
				btnEditable = false;
			}			
        }else{
			if(form.time21==null || form.time22==null){
				btnEditable = false;
			}
		}

		return (
            <div className="view-iou-form">
                <List className='content'>                    
                    <Flex justify='start' className='list-title'>
                        <span className='title'>借款金额</span>
                    </Flex>

                    <Flex justify='center'>
						<span className='date-picker prod-line'>
                            <Picker
                                data={c_amtList}
                                cols={1}
                                title="借款金额区间"
                                value={[form.amount]}
                                onOk={(v)=>{this.pickerChange(v,'amount')}}>
                                <List.Item>
                                    {form.amount==null?<span className='rate'>请选择金额区间</span>
                                    :<span className='interest'>
                                        <span className='text1'>{form.amount}</span></span>}
                                </List.Item>
                            </Picker>
                        </span>
                    </Flex>

					<Flex justify='start' className='list-title'>
                        <span className='title'>还款方式</span>
                    </Flex>

					<Flex justify='center' className='tab tab-1'>
                        <Tap onTap={()=>{this.onTab(1,'repayType')}}>
                            <span className={form.repayType==1?'selected':''}>等额本息</span>
                        </Tap>
                        <Tap onTap={()=>{this.onTab(0,'repayType')}}>
                            <span className={form.repayType==0?'selected':''}>到期还本付息</span>
                        </Tap>
                    </Flex>

					{form.repayType?<Flex justify='start' className="way-con">
						<Tap onTap={()=>{this.onSelect(1)}}>
							<div className="way">							
								{form.time11!= null?<span className="way-span">{c_times1[form.time11]}</span>
								:<span className="way-span">至少分期</span>}
								<span className="way-line">-</span>
								{form.time12!= null?<span className="way-span">{c_times1[form.time12]}</span>
								:<span className="way-span">最多分期</span>}
							</div>
						</Tap>				
                    </Flex>
                    :<Flex justify='start' className="way-con">
						<Tap onTap={()=>{this.onSelect(0)}}>
							<div className="way">
								{form.time21?<span className="way-span">{c_times2[form.time21]}</span>
								:<span className="way-span">最短时长</span>}
								<span className="way-line">-</span>
								{form.time22?<span className="way-span">{c_times2[form.time22]}</span>
								:<span className="way-span">最长时长</span>}
							</div>	
						</Tap>                        					
					</Flex>}

                    <Flex justify='start' className='list-title'>
                        <span className='title'>年化利率</span>
                    </Flex>
                    <Flex justify='center'>
                        <span className='date-picker prod-line'>
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
                                        <span className='bf'>%</span></span>}
                                </List.Item>
                            </Picker>
                        </span>
                    </Flex>

					<Flex justify='start' className='list-title'>
                        <span className='title'>必备信用资料</span>
                    </Flex>
                    <Flex justify='start'>
                        <div className='use-content'>
							{c_creditList.map((item)=>{
								return <Tap onTap={()=>{this.onTab(item,'creditInfo')}} key={Math.random()}>
										<span className={form.creditInfo[item.value]?'use-item selected':'use-item'}>
											<span>{item.label}</span>
										</span>
									</Tap>
							})}
                        </div>
                    </Flex>

					<Flex justify='start' className='list-title'>
                        <span className='title'>补充说明</span>
                    </Flex>
					<Flex justify='start' className='text-area'>
						<List.Item className="border_bott">
							<TextareaItem ref='textArea'
								autoHeight
								rows={2}
								defaultValue={form.memo}
								onChange={this.onTxtChange}
								placeholder="不超过40字,例如需要面谈等"
								count={40}
								labelNumber={5} />
						</List.Item>
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
                        editable={btnEditable}
                        form={this.props.form}
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
				<Picker
					title="至少分期"
					visible={pop11}
					data={time11}
					value={form.time11}
					cols={1}
					//onChange={v => this.pickerChange(v,'time11')}
					onOk={(v) => this.pickerOk(v,'time11')}
					onDismiss={() => this.setState({ pop11: false })}>
				</Picker>
				<Picker
					title="最多分期"
					visible={pop12}
					data={time12}
					value={form.time12}
					cols={1}
					//onChange={v => this.pickerChange(v,'time12')}
					onOk={(v) => this.pickerOk(v,'time12')}
					onDismiss={() => this.setState({ pop12: false })}>
				</Picker>
				<Picker
					title="最短时长"
					visible={pop21}
					data={time21}
					value={form.time21}
					cols={1}
					//onChange={v => this.pickerChange(v,'time21')}
					onOk={(v) => this.pickerOk(v,'time21')}
					onDismiss={() => this.setState({ pop21: false })}>
				</Picker>
				<Picker
					title="最长时长"
					visible={pop22}
					data={time22}
					value={form.time22}
					cols={1}
					//onChange={v => this.pickerChange(v,'time22')}
					onOk={(v) => this.pickerOk(v,'time22')}
					onDismiss={() => this.setState({ pop22: false })}>
				</Picker>

				<InputValid visible={popPwd} onEnd={this.onPwdConfirm} onClose={() => { this.setState({ popPwd:false})}} />
            </div>
		);
	}
}

export default createForm()(Page)
