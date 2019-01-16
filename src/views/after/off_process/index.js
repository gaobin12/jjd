
//借条详情 => 展期进度
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { Button, WingBlank,List, Flex} from 'antd-mobile'
import { Loading, Modal } from 'SERVICE'

const Item = List.Item;

@withRouter
export default class Page extends Component {
	constructor(props, context) {
		document.title = "展期进度";
		super(props, context)
		let { query } = this.props.location;
		this.state = {
			// id:query.id,
			// days:query.days,
            // onlineStatus:query.onlineStatus,
            days:53,
            onlineStatus:true,
			userInfo:{
				versionNumber:10
			}
		};
	}

	componentDidMount() {

    }

	
	
	render() {
		const { days,userInfo:{versionNumber} } = this.state;
		return (
			<div className="urge-process">
                <div>
                    <Flex justify='start' className='list-title mar16'>
                        <span className='title'>有一个销账等待借款人确认</span>
                    </Flex> 
                    <List className="detail_list">
                        <Item extra={'500元'}>销账金额</Item>
                        <Item extra={'待处理'}>销账状态</Item>
                        <Item extra={'其他方式'}>销账原因</Item>
                        <Item extra={'200元'}>借款人应付款</Item>
                    </List>
                </div>
                <List className="no_data"  hidden="true">
                    <img src={'/imgs/iou/loan-null.svg'} />
                    <div className="row_font">当前没有待处理销账</div>
                </List>

                <Flex justify='start' className='iou-text'>
                    <span>查看借条详情<img src='/imgs/home/arrow-r.svg'/></span>
                </Flex>
                <div className="box-br"></div>

                <div className="box_ce">
                    {this.state.days > 0?<div> 
                        <div className="days"><img src={'/imgs/iou/time3.svg'} />
                            <span>2018-06-44 </span>
                            <span className='blue'>被驳回</span>
                        </div>
                        <div className="timeline">
                            <span>08:00</span>
                            <span>展期&nbsp;500元</span>
                            <span>2019-3-2到期</span>
                        </div>
                        <div className="timeline">
                            <span></span>
                            <span>利率&nbsp;24%</span>
                            <span>借款人应付款&nbsp;200元</span>
                        </div>
                    </div> :null}
                    {this.state.days > 16 ?<div>
                        <div className="days state1"><img src={'/imgs/iou/time1.svg'} />
                            <span>2018-06-44 </span>
                            <span>已发起</span>
                        </div>
                        <div className="timeline yello">
                            <span>08:00</span>
                            <span>展期：500元</span>
                            <span>2019-3-2到期</span>
                        </div>
                    </div>: null}
                    {this.state.days > 30 ?<div>
                        <div className="days state2"><img src={'/imgs/iou/time2.svg'} />
                            <span>2018-06-44 </span>
                            <span>已失效</span>
                        </div>
                        <div className="timeline none">
                            <span>08:00</span>
                            <span>展期：500元</span>
                            <span>2019-3-2到期</span>
                        </div>
                        <div className="timeline none">
                            <span></span>
                            <span>利率24%</span>
                            <span></span>
                        </div>
                    </div>:null}
                </div>

			</div>
		)
	}
}
