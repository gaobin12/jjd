
//收还款消息
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List} from 'antd-mobile'
import { Link,withRouter } from 'react-router-dom'
import { Tap } from 'COMPONENT'
import { Loading, Modal } from 'SERVICE'

const Item = List.Item;
const Brief = Item.Brief;

@withRouter
export default class App extends Component {
    constructor(props, context) {
        document.title = "收还款消息";
        super(props, context)
        this.state = {
            total: 0,
            pageInfo: {
				type:2,
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
        let { pageInfo, message_detail_data } = this.state;
        if(more){
            pageInfo.page = pageInfo.page+1
        }
        // 通过类型查询常见问题
        $.ajaxE({
            type: 'GET',
            url: '/user/wx/getMessage',
            data: pageInfo,
            async: false
        }).then((data)=>{
            this.setState({
				total: data.total,
                message_detail_data : message_detail_data.concat(data.msgList)
            })
        }).catch((msg)=>{
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }

    getSearchParams = (url) => {
        //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.split('?')[1];
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

    
    message_jump = (data) =>{
        this.props.history.push({
            pathname: data.split('?')[0],
            query:{
                id:data.split('?')[1].split('=')[1]
            }
        })
    }

    render() {
        let { message_detail_data, total} = this.state;
        return (
            <div className='view-map-list'>
           { message_detail_data&&message_detail_data.length>0 ?
            <div>
                    <List className="query-list" >
                        {message_detail_data.map((ele, index) => {
                            return(
                                <div className="l-box" key={Math.random()}>
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
                                    </Item>                      
                                </div>)
                        })}
                    </List>
                    {message_detail_data&&total>message_detail_data.length?<Tap onTap={()=>{this.onGetMore(true)}}>
                        <div style={{height:'48px',lineHeight:'48px',textAlign:'center',background:'#fff'}}>加载更多</div>
                    </Tap>:null}
                </div>
                :
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