import React, { Component } from "react";
import { List, Checkbox, Flex } from 'antd-mobile';
import { Tap } from 'COMPONENT'

const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;
// 引入样式
import "./index.less";
export default class Telephone extends Component {
	constructor(props) {
		document.title = "电话催收";
		super(props);
		// 定义状态数据
		this.state = {
			read: false
		}
	}
	onChange = (val) => {
	    console.log(val);
	}
	onAgreement=() =>{
		// let values = this.props.form.getFieldsValue();
  //       let _state = this.state;
		// _state.date_repayment = _state.date_repayment.getTime();
		// sessionStorage.setItem('pre_borrow_form',JSON.stringify(Object.assign(_state,values)));
		// this.props.history.push({
		this.props.history.push({
			pathname: '/agree/iou'
		});
	}
	createList() {
		return this.props.data.map((item, index) => (<div key={index} className="formList">
			<div className="floatLeft">
				<span>{item.title}</span>
				<span>{item.iconPath ? <img src={item.iconPath} alt=""/> : null}</span>
			</div>
			<div className="floatRight">
				<div className={item.sub_text ? "hasSub" : ""}>{item.value}</div>
				<div>{item.sub_text ? <span>{item.sub_text}</span> : null}</div>
			</div>
		</div>))
	}
	render() {
		const data = [
			{ value: 0, label: 'Ph.D.' }
		];
		// 解构
		let { read } = this.state;
		return (
			<div id="g_telephone">
				<div>{ this.createList() }</div>
				{/*<div className="radio">
					<label><input type="radio" onChange={ e => this.setState({ read: e.target.checked })} checked={read}/>已阅读并同意<i className="rules">《催收协议及收费规则》</i></label>
				</div>*/}
				<div className="btn" onClick={ () => {} }>立即申请</div>
				<div className="position">
					<List>
						<Checkbox.AgreeItem onChange={this.onAgreementChange}>
                            已阅读并同意
                            <Tap onTap={this.onAgreement}><a className="mainC1">《今借到借款协议》</a></Tap>
                        </Checkbox.AgreeItem>
					</List>
				</div>
			</div>
		)
	}
}

Telephone.defaultProps = {
	data: [
		{
			title: "催收对象",
			value: "张元"
		},
		{
			title: "催收金额",
			value: "5000元"
		},
		{
			title: "逾期天数",
			value: "59天"
		},
		{
			title: "服务费比例",
			value: "10%-50%"
		},
		{
			title: "预计服务费",
			value: "0-2500元"
		},
		{
			title: "委托期限",
			value: "3个月",
			sub_text: "佣金金额将在收到还款时自动按比例扣"
		},
		{
			title: "保证金",
			value: "100.00元",
			iconPath: "/imgs/iou/feedback.svg"
		}
	]
}