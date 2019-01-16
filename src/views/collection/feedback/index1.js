import React, { Component } from "react";
import { List, InputItem, WhiteSpace } from 'antd-mobile';

const Item = List.Item;

// 引入样式
import '../form.less';
import "./index.less";
export default class Feedback extends Component {
	constructor(props) {
		// 设置标题
		document.title = "反馈借款人信息";
		super(props);
		// 定义状态数据
		this.state = {
			Phone_num: "",
			Landline_num: "",
			address: "",
			familyNum: "",
			father_name: "",
			father_tel: "",
			Mom_name: "",
			Mom_tel: "",
			spouse_name: "",
			spouse_tel: "",
			isShowBase: true,
			isShowFamilyInfo: true,
			tempName: this.props.data
		}
	}
	changePhone_num(e) {
		// 获取元素的值
		let result = e.target.value;
		this.setState({ 
			Phone_num: result
		})
	}
	changeLandline_num(e) {
		// 获取元素的值
		let result = e.target.value;
		// 长度不能查过8位
		// if (username.length > 8) {
		// 	// 不要更新了
		// 	return;
		// }
		// 可以更新状态
		this.setState({ 
			Landline_num: result
		})
	}
	changeAddress(e) {
		// 获取元素的值
		let result = e.target.value;
		this.setState({ 
			address: result
		})
	}
	changeFamilyNum(e) {
		// 获取元素的值
		let result = e.target.value;
		this.setState({ 
			familyNum: result
		})
	}
	changeFather_name(e) {
		// 获取元素的值
		let result = e.target.value;
		this.setState({ 
			father_name: result
		})
	}
	changeFather_tel(e) {
		// 获取元素的值
		let result = e.target.value;
		this.setState({ 
			father_tel: result
		})
	}
	changeMom_name(e) {
		// 获取元素的值
		let result = e.target.value;
		this.setState({ 
			Mom_name: result
		})
	}
	changeMom_tel(e) {
		// 获取元素的值
		let result = e.target.value;
		this.setState({ 
			Mom_tel: result
		})
	}
	changeSpouse_name(e) {
		// 获取元素的值
		let result = e.target.value;
		this.setState({ 
			spouse_name: result
		})
	}
	changeSpouse_tel(e) {
		// 获取元素的值
		let result = e.target.value;
		this.setState({ 
			spouse_tel: result
		})
	}
	addFun(index) {
		let result = this.state.tempName[index]["isShowResult"];
		// this.props.data[index]["isShowResult"] = !this.props.data[index]["isShowResult"]
		console.log(result, 111);
		this.setState({
			// [this.state.tempName[index]["isShowResult"]]: !result
			[this.state.tempName[index]["isShowResult"]]: !result
		})
		// console.log(this.state.tempName[index]["isShowResult"], 124);
	}
	createFun(item, v, funName, e) {
		// return funName(e) {
		// 		// 获取元素的值
		// }
		let result = e.target.value;
		let temp = this.state.tempName[0]["list"][v]["sub_title"];
		this.setState({ 
			temp: result
		})
		// console.log(item, v, fun_name);
	}
	render() {
		let { isShowBase, isShowFamilyInfo, Phone_num, Landline_num, address, familyNum, father_tel, father_name, Mom_tel, Mom_name, spouse_name, spouse_tel } = this.state;
		return (
			<div className='g_feedback'>
				{/*基本信息*/}
				<div>
					<div className="relative" onClick={ () => { this.setState({ isShowBase: !isShowBase }) }}>
						<span className="title">基本信息</span>
						<img src="/imgs/home/arrow-r.svg" className={ isShowBase ? "arrow_r" : "arrow_d"}/>
					</div> 
					<div className={ isShowBase ? "isShow" : "select" }>
						<p>
							<label>手机号码<input type="text" onChange={e => this.changePhone_num(e)} placeholder="手机号码" value={Phone_num}/></label>
						</p>
						<p>
							<label>座机号码<input type="text" onChange={e => this.changeLandline_num(e)} placeholder="座机号码" value={Landline_num}/></label>
						</p>
					</div>
				</div>
				{/*家庭信息*/}
				<div>
					<div className="relative" onClick={ () => { this.setState({ isShowFamilyInfo: !isShowFamilyInfo}) }}>
						<span className="title">家庭信息</span>
						<img src="/imgs/home/arrow-r.svg" className={ isShowFamilyInfo ? "arrow_r" : "arrow_d"}/>
					</div> 
					<div className={ isShowFamilyInfo ? "isShow" : "select" }>
						<p>
						<label>家庭地址<input type="text" onChange={e => this.changeAddress(e)} placeholder="省/市/区/街道门牌信息" value={address}/></label>
						</p>
						<p>
							<label>家庭成员数<input type="text" onChange={e => this.changeFamilyNum(e)} placeholder="家庭成员数" value={familyNum}/></label>
						</p>
						<p>
							<label>父亲姓名<input type="text" onChange={e => this.changeFather_name(e)} placeholder="父亲姓名" value={father_name}/></label>
						</p>
						<p>
							<label>父亲手机<input type="text" onChange={e => this.changeFather_tel(e)} placeholder="父亲手机" value={father_tel}/></label>
						</p>
						<p>
							<label>母亲姓名<input type="text" onChange={e => this.changeMom_name(e)} placeholder="母亲姓名" value={Mom_name}/></label>
						</p>
						<p>
							<label>母亲手机<input type="text" onChange={e => this.changeMom_tel(e)} placeholder="母亲手机" value={Mom_tel}/></label>
						</p>
						<p>
							<label>配偶姓名<input type="text" onChange={e => this.changeSpouse_name(e)} placeholder="配偶姓名" value={spouse_name}/></label>
						</p>
						<p>
							<label>配偶手机<input type="text" onChange={e => this.changeSpouse_tel(e)} placeholder="配偶手机" value={spouse_tel}/></label>
						</p>
					</div>
				</div>
				{/*循环渲染信息*/}
				{ this.createInfoList() }
			</div>
		)
	}
	
	createInfoList() {
		return this.props.data.map((item, index) => {

			return (<div key={index}>
				{/*<div className="relative" onClick={ () => { this.setState({ this.state.tempName[index]["isShowResult"]: !this.state.tempName[index]["isShowResult"]}) }}>*/}
				<div className="relative" onClick={ this.addFun.bind(this, index) }>
					<span className="title">{item.title}</span>
					<img src="/imgs/home/arrow-r.svg" className={ this.state.tempName[index]["isShowResult"] ? "arrow_r" : "arrow_d"}/>
				</div> 
				<div className={ this.state.tempName[index]["isShowResult"] ? "isShow" : "select" }>
					{ item.list.map((v, i) => {
						return (<p>
							<label>{v.sub_title}<input type="text" onChange={e => this.createFun(index, i, v.fun_name, e)} placeholder={v.sub_title} value={v.value}/></label>
						</p>
						)
					}) }
				</div>
			</div>
			)
		})
	}

	componentDidMount() {
	}
}

Feedback.defaultProps = {
	data: [
		{
			title: "公司信息",
			isShowResult: false,
			list: [
				{
					sub_title: "公司名称",
					fun_name: "changeCopname",
					value: ""
				},
				{
					sub_title: "所属部门",
					fun_name: "changeCopbumen",
					value: ""
				},
				{
					sub_title: "职位",
					fun_name: "changeCopjob",
					value: ""
				},
				{
					sub_title: "公司地址",
					fun_name: "changeCopaddress",
					value: ""
				},
				{
					sub_title: "公司电话",
					fun_name: "changeCoptel",
					value: ""
				}
			]
		}
	]
}