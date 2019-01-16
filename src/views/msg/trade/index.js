
//交易消息
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { List } from 'antd-mobile'
import { Tap } from 'COMPONENT'
import { Loading, Modal } from 'SERVICE'

const Item = List.Item;
const Brief = Item.Brief;


@withRouter
export default class App extends Component {
    constructor(props, context) {
        document.title = "交易消息";
        super(props, context)
        this.state = {
            total: 0,
            pageInfo: {
				type:1,
				page:0,
				rows:20,
			},
            message_detail_data:[],
        };
    }

    // 调接口
    componentDidMount() {
        this.onGetMore();
    }

    onGetMore = (more) => {
        Loading.show();
        // 通过类型查询常见问题
        let { pageInfo, message_detail_data } = this.state;
        if(more){
            pageInfo.page = pageInfo.page+1
        }
        $.ajaxE({
            type: 'GET',
            url: '/user/wx/getMessage',
            data: pageInfo,
            async: false
        }).then((data) => {            
            this.setState({
				total: data.total,
                message_detail_data : message_detail_data.concat(data.msgList)
            })
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
            //Loading.show();
            Loading.hide();
        })
    }
    render() {
        let { message_detail_data, total } = this.state
        return (
            <div className='view-mb-list'>

           { message_detail_data&&message_detail_data.length>0 ?
            <div>
                <List className="query-list" >
                    {
                        message_detail_data.map((ele, index) => {
                            return (
                                <div className="l-box" key={'faqs' + index}>
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
                                    </Item>                            
                                </div>
                            )
                        })
                    }
                </List>
                    {message_detail_data&&total>message_detail_data.length?<Tap onTap={()=>{this.onGetMore(true)}}>
                        <div style={{height:'48px',lineHeight:'48px',textAlign:'center',background:'#fff'}}>加载更多</div>
                    </Tap>:null}
                </div >:
                <div>
                 <div className="view-mb-list list_div_group">
                     <div className="row">
                      <div className="bg">
                         <div className="icon">
                         <img src={'/imgs/friend/null.png'} />
                         </div>
                        <div className="row_font">暂无任何内容</div>
                      </div>
                    </div>
                  </div> 
                </div>
           }
            </div>
                   
        )
    }
}
