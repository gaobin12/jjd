
//催收进度 => 反馈借款人信息

import './index.less';
import React, { Component,PropTypes } from 'react'
import { Button, Accordion, List, InputItem, TextareaItem } from "antd-mobile";
import { createForm } from 'rc-form'
import { Loading, Modal } from 'SERVICE/popup'

const page = class App extends Component {
	// static contextTypes = {
	// 	router: PropTypes.object.isRequired
	// }
	constructor(props, context) {
		document.title = "反馈借款人信息";
		super(props, context)
		let {query} = this.props.location;
		this.state = {
			//借条编号
			// id:query.id,
			pageInfo:{				
				mobileTel:'', //手机号码
				telephone:'', //座机号码
				homeAddr:'', //家庭地址
				faimilyMember:'', //家庭成员数
				fatherName:'', //父亲姓名
				fatherPhone:'', //父亲手机号
				motherName:'', //母亲姓名
				motherPhone:'', //母亲手机号
				partnerName:'', //配偶姓名
				partnerPhone:'', //配偶电话
				corpName:'', //公司名称
				dep:'', //所属部门
				post:'', //所属职位
				corpAddr:'', //公司地址
				corpPhone:'', //公司电话
				houseInfo:'', //房产信息
				carInfo:'', //车辆信息
				contact1:'', //联系人1
				contact1Relation:'', //联系人1关系
				contact1Phone:'', //联系人1电话
				contact2:'', //联系人2
				contact2Relation:'', //联系人2关系
				contact2Phone:'', //联系人2电话
				contact3:'', //联系人3
				contact3Relation:'', //联系人3关系
				contact3Phone:'', //联系人3电话
				wechatId:'', //微信号
				blogHome:'', //微博主页
				qq:'', //qq号
				blog:'', //微博
				alipay:'', //支付宝号
				otherInfo:'' //其他信息
			}
		};
		//this.renderTree = renderTree.bind(this)
	}

	componentDidMount() {
		this.getPageInfo();
	}

	getPageInfo=() =>{
		Loading.show();
		$.ajaxE({
			type: 'GET',
			url: "/loanlater/collection/getCollectionReturnInfo",
			data: {
				loanId:this.state.id
			} 
		}).then((data) =>{
			////////debugger;
			if(data){
				this.setState({
					pageInfo:data
				});	
			}	
		}).catch((msg) =>{
			Modal.infoX(msg);
		}).finally(() =>{
			//Loading.show();
			Loading.hide();
		})  
	}

	onSubmit = () => {
		//判断是否 限制补借条
		if(Modal.report()){
			return false;
		}
		this.props.form.validateFields((error, values) => {
			if(!error){
				this.ajaxSubmit(values);
			}
		})
	}

	ajaxSubmit=(v) =>{
		//////debugger;
		v.loanIdE = this.state.id;
		Loading.show();
		$.ajaxE({
			type: 'POST',
			url: "/loanlater/collection/addCollectionReturnInfo",
			data: v
		}).then((res) =>{
			Modal.infoX('数据提交成功!',() =>{
				history.back();
			});
		}).catch((msg) =>{
			Modal.infoX(msg);
		}).finally(() =>{
			//Loading.show();
			Loading.hide();
		})  
	}	      

	render() {
		const { getFieldProps, getFieldError } = this.props.form;
		const { pageInfo }=this.state;
		return (
			<div className='view-collection-information'>
				<Accordion defaultActiveKey="" className="my-accordion" onChange={this.onChange} style={{height:'100%',overflow:'auto'}}>
					<Accordion.Panel header="基本信息">
						<List className="my-list">
							<InputItem
								type="text"
								{...getFieldProps('mobileTel', {
									initialValue: pageInfo.mobileTel,
									// rules: [{ required: true, message: '请填写手机号码' }],
								})}
								clear
								placeholder="手机号码"
							>手机号码</InputItem>
							<div className='common-jc-error'>{getFieldError('mobileTel') && getFieldError('mobileTel').join(',')}</div>


							<InputItem
								type="text"
								{...getFieldProps('telephone', {
									initialValue: pageInfo.telephone,
									// rules: [{ required: true, message: '请填写座机号码' }],
								})}
								clear
								placeholder="座机号码"
							>座机号码</InputItem>
							<div className='common-jc-error'>{getFieldError('telephone') && getFieldError('telephone').join(',')}</div>

						</List>
					</Accordion.Panel>

					<Accordion.Panel header="家庭信息">
						<List className="my-list">

							<InputItem
								type="text"
								{...getFieldProps('homeAddr', {
									initialValue: pageInfo.homeAddr,
									// rules: [{ required: true, message: '请填写家庭住址' }],
								})}
								clear
								placeholder="省／市／区／街道门牌信息"
							>家庭住址</InputItem>
							<div className='common-jc-error'>{getFieldError('homeAddr') && getFieldError('homeAddr').join(',')}</div>


							<InputItem
								type="text"
								{...getFieldProps('faimilyMember', {
									initialValue: pageInfo.faimilyMember,
									// rules: [{ required: true, message: '请填写家庭成员数' }],
								})}
								clear
								placeholder="家庭成员数"
							>家庭成员数</InputItem>
							<div className='common-jc-error'>{getFieldError('faimilyMember') && getFieldError('faimilyMember').join(',')}</div>


							<InputItem
								type="text"
								{...getFieldProps('fatherName', {
									initialValue: pageInfo.fatherName,
									// rules: [{ required: true, message: '请填写父亲姓名' }],
								})}
								clear
								placeholder="父亲姓名"
							>父亲姓名</InputItem>
							<div className='common-jc-error'>{getFieldError('fatherName') && getFieldError('fatherName').join(',')}</div>


							<InputItem
								type="text"
								{...getFieldProps('fatherPhone', {
									initialValue: pageInfo.fatherPhone,
									// rules: [{ required: true, message: '请填写父亲手机' }],
								})}
								clear
								placeholder="父亲手机"
							>父亲手机</InputItem>
							<div className='common-jc-error'>{getFieldError('fatherPhone') && getFieldError('fatherPhone').join(',')}</div>


							<InputItem
								type="text"
								{...getFieldProps('motherName', {
									initialValue: pageInfo.motherName,
									// rules: [{ required: true, message: '请填写母亲姓名' }],
								})}
								clear
								placeholder="母亲姓名"
							>母亲姓名</InputItem>
							<div className='common-jc-error'>{getFieldError('motherName') && getFieldError('motherName').join(',')}</div>


							<InputItem
								type="text"
								{...getFieldProps('motherPhone', {
									initialValue: pageInfo.motherPhone,
									// rules: [{ required: true, message: '请填写母亲手机' }],
								})}
								clear
								placeholder="母亲手机"
							>母亲手机</InputItem>
							<div className='common-jc-error'>{getFieldError('motherPhone') && getFieldError('motherPhone').join(',')}</div>


							<InputItem
								type="text"
								{...getFieldProps('partnerName', {
									initialValue: pageInfo.partnerName,
									// rules: [{ required: true, message: '请填写配偶姓名' }],
								})}
								clear
								placeholder="配偶姓名"
							>配偶姓名</InputItem>
							<div className='common-jc-error'>{getFieldError('partnerName') && getFieldError('partnerName').join(',')}</div>


							<InputItem
								type="text"
								{...getFieldProps('partnerPhone', {
									initialValue: pageInfo.partnerPhone,
									// rules: [{ required: true, message: '请填写配偶手机' }],
								})}
								clear
								placeholder="配偶手机"
							>配偶手机</InputItem>
							<div className='common-jc-error'>{getFieldError('partnerPhone') && getFieldError('partnerPhone').join(',')}</div>


						</List>
					</Accordion.Panel>

					<Accordion.Panel header="公司信息">
						<List className="my-list">

							<InputItem
								type="text"
								{...getFieldProps('corpName', {
									initialValue: pageInfo.corpName,
									// rules: [{ required: true, message: '请填写公司名称' }],
								})}
								clear
								placeholder="公司名称"
							>公司名称</InputItem>
							<div className='common-jc-error'>{getFieldError('corpName') && getFieldError('corpName').join(',')}</div>


							<InputItem
								type="text"
								{...getFieldProps('dep', {
									initialValue: pageInfo.dep,
									// rules: [{ required: true, message: '请填写所属部门' }],
								})}
								clear
								placeholder="所属部门"
							>所属部门</InputItem>
							<div className='common-jc-error'>{getFieldError('dep') && getFieldError('dep').join(',')}</div>


							<InputItem
								type="text"
								{...getFieldProps('post', {
									initialValue: pageInfo.post,
									// rules: [{ required: true, message: '请填写职位' }],
								})}
								clear
								placeholder="职位"
							>职位</InputItem>
							<div className='common-jc-error'>{getFieldError('post') && getFieldError('post').join(',')}</div>


							<InputItem
								type="text"
								{...getFieldProps('corpAddr', {
									initialValue: pageInfo.corpAddr,
									// rules: [{ required: true, message: '请填写公司地址' }],
								})}
								clear
								placeholder="公司地址"
							>公司地址</InputItem>
							<div className='common-jc-error'>{getFieldError('corpAddr') && getFieldError('corpAddr').join(',')}</div>


							<InputItem
								type="text"
								{...getFieldProps('corpPhone', {
									initialValue: pageInfo.corpPhone,
									// rules: [{ required: true, message: '请填写公司电话' }],
								})}
								clear
								placeholder="公司电话"
							>公司电话</InputItem>
							<div className='common-jc-error'>{getFieldError('corpPhone') && getFieldError('corpPhone').join(',')}</div>

						</List>
					</Accordion.Panel>
					<Accordion.Panel header="财产信息">
						<List className="my-list">
							<div className="ttt">
								房产信息
                            </div>
							<TextareaItem
								{...getFieldProps('houseInfo', {
									initialValue: pageInfo.houseInfo,
									// rules: [{ required: true, message: '请填写房产信息' }],
								})}
								rows={3}
								placeholder="请描述该借款人房产的相关信息"
							/>
							<div className='common-jc-error'>{getFieldError('houseInfo') && getFieldError('houseInfo').join(',')}</div>


							<div className="ttt">
								车辆信息
                            </div>
							<TextareaItem
								{...getFieldProps('carInfo', {
									initialValue: pageInfo.carInfo,
									// rules: [{ required: true, message: '请填写房产信息' }],
								})}
								rows={3}
								placeholder="请描述该借款人车辆的相关信息"
							/>
							<div className='common-jc-error'>{getFieldError('carInfo') && getFieldError('carInfo').join(',')}</div>


						</List>
					</Accordion.Panel>

					<Accordion.Panel header="人脉信息">
						<List className="my-list">

							<InputItem
								type="text"
								{...getFieldProps('contact1', {
									initialValue: pageInfo.contact1,
									// rules: [{ required: true, message: '请填写联系人' }],
								})}
								clear
								placeholder="联系人"
							>联系人</InputItem>
							<div className='common-jc-error'>{getFieldError('contact1') && getFieldError('contact1').join(',')}</div>


							<InputItem
								type="text"
								{...getFieldProps('contact1Relation', {
									initialValue: pageInfo.contact1Relation,
									// rules: [{ required: true, message: '请填写关系' }],
								})}
								clear
								placeholder="关系"
							>关系</InputItem>
							<div className='common-jc-error'>{getFieldError('contact1Relation') && getFieldError('contact1Relation').join(',')}</div>


							<InputItem
								type="text"
								{...getFieldProps('contact1Phone', {
									initialValue: pageInfo.contact1Phone,
									// rules: [{ required: true, message: '请填写手机' }],
								})}
								clear
								placeholder="手机"
							>手机</InputItem>
							<div className='common-jc-error'>{getFieldError('contact1Phone') && getFieldError('contact1Phone').join(',')}</div>


							<InputItem
								type="text"
								{...getFieldProps('contact2', {
									initialValue: pageInfo.contact2,
									// rules: [{ required: true, message: '请填写联系人' }],
								})}
								clear
								placeholder="联系人"
							>联系人</InputItem>
							<div className='common-jc-error'>{getFieldError('contact2') && getFieldError('contact2').join(',')}</div>


							<InputItem
								type="text"
								{...getFieldProps('contact2Relation', {
									initialValue: pageInfo.contact2Relation,
									// rules: [{ required: true, message: '请填写关系' }],
								})}
								clear
								placeholder="关系"
							>关系</InputItem>
							<div className='common-jc-error'>{getFieldError('contact2Relation') && getFieldError('contact2Relation').join(',')}</div>

							<InputItem
								type="text"
								{...getFieldProps('contact2Phone', {
									initialValue: pageInfo.contact2Phone,
									// rules: [{ required: true, message: '请填写手机' }],
								})}
								clear
								placeholder="手机"
							>手机</InputItem>
							<div className='common-jc-error'>{getFieldError('contact2Phone') && getFieldError('contact2Phone').join(',')}</div>

							<InputItem
								type="text"
								{...getFieldProps('contact3', {
									initialValue: pageInfo.contact3,
									// rules: [{ required: true, message: '请填写联系人' }],
								})}
								clear
								placeholder="联系人"
							>联系人</InputItem>
							<div className='common-jc-error'>{getFieldError('contact3') && getFieldError('contact3').join(',')}</div>

							<InputItem
								type="text"
								{...getFieldProps('contact3Relation', {
									initialValue: pageInfo.contact3Relation,
									// rules: [{ required: true, message: '请填写关系' }],
								})}
								clear
								placeholder="关系"
							>关系</InputItem>
							<div className='common-jc-error'>{getFieldError('contact3Relation') && getFieldError('contact3Relation').join(',')}</div>

							<InputItem
								type="text"
								{...getFieldProps('contact3Phone', {
									initialValue: pageInfo.contact3Phone,
									// rules: [{ required: true, message: '请填写手机' }],
								})}
								clear
								placeholder="手机"
							>手机</InputItem>
							<div className='common-jc-error'>{getFieldError('contact3Phone') && getFieldError('contact3Phone').join(',')}</div>

						</List>
					</Accordion.Panel>

					<Accordion.Panel header="网络信息">
						<List className="my-list">

							<InputItem
								type="text"
								{...getFieldProps('wechatId', {
									initialValue: pageInfo.wechatId,
									// rules: [{ required: true, message: '请填写微信号' }],
								})}
								clear
								placeholder="微信号"
							>微信号</InputItem>
							<div className='common-jc-error'>{getFieldError('wechatId') && getFieldError('wechatId').join(',')}</div>


							<InputItem
								type="text"
								{...getFieldProps('blogHome', {
									initialValue: pageInfo.blogHome,
									// rules: [{ required: true, message: '请填写微博主页' }],
								})}
								clear
								placeholder="微博主页"
							>微博主页</InputItem>
							<div className='common-jc-error'>{getFieldError('blogHome') && getFieldError('blogHome').join(',')}</div>


							<InputItem
								type="text"
								{...getFieldProps('blog', {
									initialValue: pageInfo.blog,
									// rules: [{ required: true, message: '请填写微博号' }],
								})}
								clear
								placeholder="微博号"
							>微博号</InputItem>
							<div className='common-jc-error'>{getFieldError('blog') && getFieldError('blog').join(',')}</div>


							<InputItem
								type="text"
								{...getFieldProps('qq', {
									initialValue: pageInfo.qq,
									// rules: [{ required: true, message: '请填写QQ号' }],
								})}
								clear
								placeholder="QQ号"
							>QQ号</InputItem>
							<div className='common-jc-error'>{getFieldError('qq') && getFieldError('qq').join(',')}</div>


							<InputItem
								type="text"
								{...getFieldProps('alipay', {
									initialValue: pageInfo.alipay,
									// rules: [{ required: true, message: '请填写支付宝号' }],
								})}
								clear
								placeholder="支付宝号"
							>支付宝号</InputItem>
							<div className='common-jc-error'>{getFieldError('alipay') && getFieldError('alipay').join(',')}</div>



						</List>
					</Accordion.Panel>

					<Accordion.Panel header="其他信息">
						<List className="my-list">
							<div className="ttt">
								其他信息
                            </div>
							<TextareaItem
								{...getFieldProps('otherInfo', {
									initialValue: pageInfo.otherInfo,
									// rules: [{ required: true, message: '请填写其他信息' }],
								})}
								rows={3}
								placeholder="请补充您获得的有关借款人的信息"
							/>
							<div className='common-jc-error'>{getFieldError('otherInfo') && getFieldError('otherInfo').join(',')}</div>


						</List>
					</Accordion.Panel>

				</Accordion>

				<div className="bottom-btn">
					<Button onClick={this.onSubmit}>提交</Button>
				</div>

			</div>
		)
	}
}


export default createForm()(page);
