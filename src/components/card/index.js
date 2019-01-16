import React, { Component } from 'react';
import { List, Checkbox, Flex } from 'antd-mobile';
import { Link } from 'react-router-dom';
const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;
// 引入样式
import "./index.less";
export default class Card extends Component {

	onChange = (val) => {
		console.log(val);
	}
  	render() {
  		// 解构数据
  		let { data, method, checked, oneChecked } = this.props; 
	    return (
			<div className="g-outer">
				<Flex>
					<Flex.Item>
						{ this.props.oneChecked ? <AgreeItem 
						onClick={ e => method(e.target.checked, data, data.id) } 
						checked = { checked }
						className="gb" data-seed="logId" onChange={e => { console.log(e, 666)}}>
							<div id="g-card">
								<div className="pull-left">
									<div className="top">
										<span className="name">{ data.name }<i>（代换元）</i></span>
										<span className="price">{ data.price }</span>
									</div>
									<div className="bottom">
										<span className="min-time">{ data.min_time }-</span>
										<span className="max-time">{ data.max_time }</span>
									</div>
								</div>
							</div>
						</AgreeItem> : <AgreeItem 
						onClick={ e => method(e.target.checked, data, data.id) } 
						className="gb" data-seed="logId" onChange={e => { console.log(e, 666)}}>
							<div id="g-card">
								<div className="pull-left">
									<div className="top">
										<span className="name">{ data.name }<i>（代换元）</i></span>
										<span className="price">{ data.price }</span>
									</div>
									<div className="bottom">
										<span className="min-time">{ data.min_time }-</span>
										<span className="max-time">{ data.max_time }</span>
									</div>
								</div>
							</div>
						</AgreeItem>}
						
					</Flex.Item>
					<div className="pull-right">
						<Link to={ '/' + data.id }>
							<span className="c_red">逾期<i>{ data.day }</i>天</span>
							<img className="arrow" src="imgs/pay/arrow-r.svg" alt=""/>
						</Link>
					</div>
				</Flex>
			</div>
		);
	}
}
// 定义默认数据
Card.defaultProps = {
	data: {},
	method: () => {},
	checked: false
}