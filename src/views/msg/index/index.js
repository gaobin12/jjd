//消息主页面
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { List, Badge } from 'antd-mobile';
import { Tap } from 'COMPONENT'
import { Loading, Modal } from 'SERVICE'
const Item = List.Item;
const Brief = Item.Brief;


@withRouter
export default class App extends Component {
	constructor (props, context) {
		document.title = "消息";
		super(props, context)
		this.state = {
            total: 0,
            pageInfo: {
				type:0,
				page:0,
				rows:20,
			},
            message_detail_data:[],
            message_business_count:'',
            message_accept_payments_count:'',
            message_report_count:'',
            message_system_count:'',
            message_cancle_business_count:'',
            messageListCount:10		
		};
	}
	componentDidMount(){
	    this.onGetMore();
    }
    //获得消息数据
    onGetMore=(more) => {
        Loading.show();
        let { pageInfo, message_detail_data } = this.state;
        if(more){
            pageInfo.page = pageInfo.page+1
        }
		$.ajaxE({
			type: 'GET',
			url: '/user/wx/getMessage',
			data: pageInfo,
		}).then((data) => {
            console.log(data, 35);
		let {message_business_count, message_accept_payments_count, message_report_count,message_system_count,message_cancle_business_count,message_detail_data}  = this.state;
			//验证成功
			this.setState({
				total: data.total,
				message_business_count:data.unsee_cnt1    ,
				message_accept_payments_count:data.unsee_cnt2,
				message_report_count:data.unsee_cnt3,
				message_system_count:data.unsee_cnt4,
				message_cancle_business_count:data.unsee_cnt5,	
				message_detail_data:message_detail_data.concat(data.msgList),			
			})
		}).catch((msg) => {
			Modal.infoX(msg);
		}).finally(() => {
            Loading.hide();
        })
	}
	
	render () {
		let {message_business_count, message_accept_payments_count, message_report_count,message_system_count,message_cancle_business_count, message_detail_data, total}  = this.state;
		return (
		<div className='view-message'>
		    <List className="my-list">
		        <div>
                    <Link to="/msg/trade">
                        <Item 
                            arrow="horizontal"
                            // thumb='/imgs/com/rev-new_1.png' 
                            multipleLine >
                        交易消息
                        <Badge text={message_business_count} style={{marginLeft:12}}></Badge>
                        </Item>
                    </Link>
		        </div>
	
			    <div>
			        <Link to="/msg/pay">
			            <Item 
                        arrow="horizontal"
                        // thumb='/imgs/com/rev-new_2.png' 
                        multipleLine >
                        收还款消息
                        <Badge text={message_accept_payments_count} style={{marginLeft:12}}></Badge>
                        </Item>
			        </Link>
			    </div>

                <div>
                    <Link to="/msg/report">
                        <Item 
                        arrow="horizontal"
                        // thumb='/imgs/com/rev-new_3.png' 
                        multipleLine >
                        举报消息
                        <Badge text={message_report_count} style={{marginLeft:12}}></Badge>
                        </Item>
                    </Link>
                </div>

                <div>
                    <Link to="/msg/system">
                        <Item 
                        arrow="horizontal"
                        // thumb='/imgs/com/rev-new_4.png' 
                        multipleLine >
                        系统消息
                        <Badge text={message_system_count} style={{marginLeft:12}}></Badge>
                        </Item>
                    </Link>
                </div>

                <div>
                    <Link to="/msg/off">
                        <Item 
                        arrow="horizontal"
                        // thumb='/imgs/com/rev-new_1.png' 
                        multipleLine >
                        销账消息
                        <Badge text={message_cancle_business_count} style={{marginLeft:12}}></Badge>
                        </Item>
                    </Link>
                </div>
		    </List>
		
		    <div className='view-map-list'>
		        <div className="l-box">
                    {message_detail_data&&message_detail_data.length>0 ?
                    <List className="query-list" >
                        {message_detail_data.map((ele, index) => {
                        return(
                            <div className="l-box-li" key={'faqs' + index}>
                                <Link to={ele.url}>
                                    <Item data-seed="logId" arrow="horizontal"  >
                                        {ele.title}
                                        <Brief>
                                            {(new Date(ele.createTime)).Format('MM月dd日')}
                                        </Brief>
                                    </Item>
                                </Link>
                                <Item className="warple">
                                    <div className="white_nom" dangerouslySetInnerHTML={{ __html:ele.first }}></div>
                                    <Brief>{ele.key1} {ele.value1} </Brief>
                                    <Brief>{ele.key2} {ele.value2} </Brief>
                                    <Brief>{ele.key3} {ele.value3} </Brief>
                                    <Brief>{ele.key4} {ele.value4} </Brief>
                                    <Brief>{ele.key5} {ele.value5} </Brief>
                                </Item>   
                            </div>)
                        })
                    }
                    {message_detail_data&&total>message_detail_data.length?<Tap onTap={() => {this.onGetMore(true)}}>
                        <div style={{height:'48px',lineHeight:'48px',textAlign:'center',background:'#fff'}}>加载更多</div>
                    </Tap>:null}
                    </List>:<div></div>}
		        </div>
		   </div>
		</div>
		)
	}
}
