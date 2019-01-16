import React, { Component } from "react";
import { Menu, ActivityIndicator, NavBar, List, Checkbox, Flex, PullToRefresh } from 'antd-mobile';
// import axios from 'axios';
const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;
// 引入组件
import Card from "../../../components/card";
// 引入样式
import './index.less';

export default class Admin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [
				{
					id: 123,
					name: "张三",
					isRemind: false,
					price: "4000",
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 10
				},
				{
					id: 124,
					name: "李思思",
					price: "5000",
					isRemind: true,
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 3

				},
				{
					id: 125,
					name: "王五",
					price: "1000",
					isRemind: true,
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 7
				},{
					id: 128,
					name: "王七",
					price: "1000",
					isRemind: true,
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 5
				},{
					id: 12,
					name: "张8",
					isRemind: false,
					price: "4000",
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 10
				},
				{
					id: 14,
					name: "李思",
					price: "5000",
					isRemind: true,
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 3

				},
				{
					id: 15,
					name: "王狗",
					price: "1000",
					isRemind: true,
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 7
				},{
					id: 125,
					name: "王七",
					price: "1000",
					isRemind: true,
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 5
				},{
					id: 123,
					name: "张三",
					isRemind: false,
					price: "4000",
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 10
				},
				{
					id: 124,
					name: "李思思",
					price: "5000",
					isRemind: true,
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 3

				},
				{
					id: 125,
					name: "王五",
					price: "1000",
					isRemind: true,
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 7
				},{
					id: 125,
					name: "王七",
					price: "1000",
					isRemind: true,
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 5
				},{
					id: 123,
					name: "张三",
					isRemind: false,
					price: "4000",
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 10
				},
				{
					id: 124,
					name: "李思思",
					price: "5000",
					isRemind: true,
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 3

				},
				{
					id: 125,
					name: "王五",
					price: "1000",
					isRemind: true,
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 7
				},{
					id: 125,
					name: "王七",
					price: "1000",
					isRemind: true,
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 5
				},{
					id: 123,
					name: "张三",
					isRemind: false,
					price: "4000",
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 10
				},
				{
					id: 124,
					name: "李思思",
					price: "5000",
					isRemind: true,
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 3

				},
				{
					id: 125,
					name: "王五",
					price: "1000",
					isRemind: true,
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 7
				},{
					id: 125,
					name: "王七",
					price: "1000",
					isRemind: true,
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 5
				},{
					id: 123,
					name: "张三",
					isRemind: false,
					price: "4000",
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 10
				},
				{
					id: 124,
					name: "李思思",
					price: "5000",
					isRemind: true,
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 3

				},
				{
					id: 125,
					name: "王五",
					price: "1000",
					isRemind: true,
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 7
				},{
					id: 125,
					name: "王七",
					price: "1000",
					isRemind: true,
					max_time: "19/05/02",
					min_time: "18/03/01",
					day: 5
				}
			],   
			// data: [],    	// 逾期用户数据
			_data: [],		// 备份数据
			_data_: [],      // 备份_data
			isOpen: false,  // 是否展示开启下拉框
			isSort: false,  // 是否展示排序下拉框
			isShow: false,
			active1: false,
			active2: false,
			active3: true,
			active4: false,
			choose_text: "逾期天数从小到大",
			openText: "未开启提醒",          //开启提醒 默认文本
			searchText: '',
			leftday: '',
			rightday: '',
			innerHeight: '',   // 屏幕高度
			showMore: false,   // 是否显示更多
			showDataNum: 5,       // 显示数据数量
			arr: [],             // 选中的数据
			allChecked: false,    // 是否全选
			oneChecked: false,     // 单选某一个
		}
	}
	// 逾期排序
	sure() {
		// 解构
		let { active1, active2, active3, active4, leftday, rightday, data, _data_ } = this.state;
		// console.log( leftday, rightday, 124);
		let minday, maxday;
		// console.log(rightday - leftday, 11)
		if(rightday - leftday > 0) {
			minday = leftday;
			maxday = rightday;
		} else {
			minday = rightday;
			maxday = leftday;
		}
		console.log('最小天数' + minday, '最大天数' + maxday, 123);



		console.log('状态' + active1, active2, active3, active4);
		if(active1) {
			this.state._data.sort((a, b) => {
				return a['price'] - b['price']
			})
			this.setState({
				choose_text: "逾期金额从小到大",
			})
		}else if(active2) {
			this.state._data.sort((a, b) => {
				return b['price'] - a['price']
			})
			this.setState({
				choose_text: "逾期金额从大到小"
			})
		}else if(active3) {
			this.state._data.sort((a, b) => {
				return a['day'] - b['day']
			})
			this.setState({
				choose_text: '逾期天数从小到大'
			})
		}else if(active4) {
			this.state._data.sort((a, b) => {
				return b['day'] - a['day']
			})
			this.setState({
				choose_text: '逾期天数从大到小'
			})
		}

		let todaydata = this.state._data.filter((item, index) => {
			return item.day >= minday && item.day <= maxday
		})
		console.log(todaydata,9);
		if(todaydata.length) {
			this.setState({
				_data: todaydata
			})
		}
		// else {
		// 	console.log(_data_, 222);
		// 	this.setState({
		// 		_data: _data_
		// 	})
		// }



		this.setState({
			isSort: !this.state.isSort
		})
	}
	// 修改搜索输入内容
	inputText(e) {
		// 缓存数据
		let searchText = e.target.value;
		this.search(searchText);

		this.setState({
			searchText
		})
	}

	// 子组件向父组件传递数据
	parentMethod(checked, data, id) {
		let { arr } = this.state;
		console.log("是否选中：" + checked, id);

		let newArr = [];

		if(checked) {
			arr.push(data);
		} else {
			console.log();
			if(arr.indexOf(data) != -1) {
				arr.splice(arr.indexOf(data), 1);
			}
		}
		this.setState({ 
			arr, 
			oneChecked: false 
		})
		
		// console.log("选中的数据", this.state.arr);

	}
	// 循环创建数据
	createCard() {
		return this.state._data.map((item, index) => {
			return <Card key={index} data={item} oneChecked={ this.state.oneChecked } checked={ this.state.allChecked } method={ this.parentMethod.bind(this) }></Card>
		})
	}
	// componentDidMount() {
	// 	this.getPageInfo();
	// }

	// getPageInfo=() =>{
	// 	// 解构数据
	// 	let {minday, maxday} = this.state;
	// 	Loading.show();
	// 	$.ajaxE({
	// 		type: 'GET',
	// 		url: "/loanlater/collection/getCollectionLoanList",
	// 		data: {
	// 			// loanId:this.state.id
	// 			beginOverdueDay: minday,
	// 			endOverdueDay: maxday,
	// 			amountSortType: '',
	// 			overdueDaySortType: '',
	// 			collectionStatus: 
	// 		} 
	// 	}).then((data) =>{
	// 		////////debugger;
	// 		if(data){
	// 			this.setState({
	// 				data: data.list
	// 			});	
	// 		}	
	// 	}).catch((msg) =>{
	// 		Modal.infoX(msg);
	// 	}).finally(() =>{
	// 		//Loading.show();
	// 		Loading.hide();
	// 	})  
	// }

	// 组件创建完成请求数据
	componentDidMount() {
		
		// 将数据按逾期天数从小到大排序
		// 发送get请求
		// axios.get('/')
		// 	// 监听数据返回
		// 	.then(({ data }) => {
		// 		// 如果请求成功
		// 		if (data.errno === 0) {
		// 			// 更新状态数据
		// 			// this.setState({ data: data.data })
		// 			// this.setState({ data: [] })
		// 			// 相当于多了一个errno字段
		// 			this.setState(data)
		// 			// console.log(this)
		// 		} else {
		// 			// 提示用户
		// 			alert(data.msg)
		// 			// 清空数据
		// 			this.setState({ data: [] })
		// 		}
		// 	})


		// 解构数据
		let { data, showDataNum, _data } = this.state;
 		// 取前二十条数据存入数组
		let showData = data.slice(0, showDataNum);
		
		this.setState({
			_data: showData
		})

		console.log(1);
		this.state.data.sort((a, b) => {
			return a['day'] - b['day']
		})

		let innerHeight = window.innerHeight - 101 + 'px';
		console.log(_data, 333);
		// 设置屏幕高度
		this.setState({
			innerHeight
		})
	}
	// 搜索
	search(text) {
		// 解构数据
		let { data } = this.state;
		
		
		let newdata = data.filter((item, index) => {
			return item.name.indexOf(text) != -1
		})
		console.log(newdata,9);
		if(newdata.length) {
			this.setState({
				_data: newdata
			})
		}else {
			// this.setState({
			// 	_data: data
			// })
		}
	}
	componentDidUpdate() {
		// 获取搜索内容

	}
	changeLeftInput(e) {
		// 获取输入的内容
		let leftday = e.target.value;
		let num = Number(leftday);
		console.log(num, 98);
		console.log(typeof(num), 13);
		if( num === 0 ) {
			this.setState({
				leftday: ''
			})
		}
		if(num < 0) {
			return
		}
		if(num > 0) {
			this.setState({
				leftday
			})
		}
	}
	changeRightInput(e) {
		// 获取输入的内容
		let rightday = e.target.value;
		let num = Number(rightday);
		if( num === 0 ) {
			this.setState({
				rightday: ''
			})
		}
		if(num < 0) {
			return
		}
		if(num > 0) {
			this.setState({
				rightday
			})
		}
	}
	// 加载更多
	loadMore() {
		let showDataNum = this.state.showDataNum;
		showDataNum += 5;
		// console.log('加载消息数量:' + showDataNum);
		if (this.state.data.length <= showDataNum) {
			// console.log("数据没了")
			this.setState({
				showMore: !this.state.showMore
			})
			return;
		}
		let showData = this.state.data.slice(0, showDataNum);
		this.setState({
			showDataNum,
			_data: showData
		})
	}
	// 全选
	allChoose(e) {
		console.log("全选触发");
		// 获取是否全选
		let checked = e.target.checked;
		// let chooseDataNum = this.state._data.length
		if (checked) {
			this.setState({
				arr: this.state._data
			})
		}else {
			this.setState({
				arr: []
			})
		}
		// console.log(checked, 333);
		this.setState({ allChecked: checked, oneChecked: true })
	}
	repayment() {

	}
	render() {
		// 解构
		let { searchText, leftday, rightday, innerHeight } = this.state;
		return (
			<div className='g_admin'>
				{/*搜索框*/}
				<div className="header">
					<div className="search">
						<img className="search_icon" src="imgs/iou/search.png" alt=""/>
						<input type="search" value={ searchText } onChange={ e => this.inputText(e) } placeholder="可搜索姓名"/>
					</div>
				</div>

				<div className='admin_chooes'>
					<div className="open_remind" onClick={ () => this.setState({ isOpen: !this.state.isOpen, isSort: false })}>
						<span>{ this.state.openText }</span>
					</div>
					<div className="sort" onClick={ () => this.setState({ isSort: !this.state.isSort, isOpen: false }) }>
						<span>{ this.state.choose_text }</span>
					</div>
				</div>
				{ this.state.isSort ? <div className="mask" style={{ height: innerHeight }}>
					<div className="select">
						<div className = { this.state.active1 ? "item_list active" : "item_list"} onClick={ () => this.setState({ active1: !this.state.active1, active2: false, active3: false, active4: false }) }>逾期金额从小到大</div>
						<div className = { this.state.active2 ? "item_list active" : "item_list"} onClick={ () => this.setState({ active2: !this.state.active2, active1: false, active3: false, active4: false }) }>逾期金额从大到小</div>
						<div className = { this.state.active3 ? "item_list active" : "item_list"} onClick={ () => this.setState({ active3: !this.state.active3, active1: false, active2: false, active4: false }) }>逾期天数从小到大</div>
						<div className = { this.state.active4 ? "item_list active" : "item_list"} onClick={ () => this.setState({ active4: !this.state.active4, active1: false, active2: false, active3: false }) }>逾期天数从大到小</div>
						
						<div className="choose_day">
							<div>逾期天数</div>
							<div className="numberbox">
								<span><input type="number" value={ leftday } onChange={ e => this.changeLeftInput(e) }/></span>
								<span className="line"></span>
								<span><input type="number" value={ rightday } onChange={ e => this.changeRightInput(e) }/></span>
							</div>
						</div>
						<div className="select_btn">
							{/*<div>重置</div>*/}
							<input type="reset" onClick={ () => this.setState({ leftday: '', rightday: ''})}/>
							<input className="sure" onClick={ () => { this.sure() } } type="submit" value='确定'/>
						</div>
					</div>
				</div> : null}
				{ this.state.isOpen ? <div className="mask" style={{ height: innerHeight }}>
					<div className="select">
						<div className="item_list" onClick={ () => this.setState({ openText: "未开启提醒", isOpen: false})}>未开启提醒</div>
						<div className="item_list" onClick={ () => this.setState({ openText: "已开启提醒", isOpen: false})}>已开启提醒</div>
					</div>
				</div> : null}
				<div className="list_item">
					{ this.createCard() }
				</div>
				<div className="loadMore" hidden={ this.state.showMore } onClick={() => this.loadMore() }>加载更多</div>
				<div className="admin_bottom_btn">
					<div className='admin_left'>
						<Flex>
							<Flex.Item >
								<AgreeItem className="gb" data-seed="logId" onChange={e => this.allChoose(e) }>
									<div className="choose">全选</div>
									<div className="heji">
										<span>合计(张)</span>
										<span className="num">20</span>
									</div>
								</AgreeItem>
							</Flex.Item>
						</Flex>
						<div className="p_fixed">
							<span>合计(张)</span>
							<span className="num">{ this.state.arr.length }</span>
						</div>
					</div>
					<div className="admin_right" onClick={ this.repayment.bind(this) }>
						<span>马上还款</span>
					</div>
				</div>
			</div>
		)
	}
}
				// { this.state.showMore ? null : <div style={{height: 200}}>
				// 	<PullToRefresh
				// 		direction="up"
				// 		distanceToRefresh={50}
				// 		onRefresh={ () => this.loadMore() }
				// 	>上拉刷新</PullToRefresh>
				// </div> }
