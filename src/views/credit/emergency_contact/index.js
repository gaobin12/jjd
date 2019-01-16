
//信用报告-历史紧急联系人列表
import '../credit.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Flex,List } from 'antd-mobile'
import { Loading, Modal } from 'SERVICE'

@withRouter
export default class App extends Component {
    constructor(props, context) {
        document.title = "历史紧急联系人列表";
        super(props, context)
        let { query } = this.props.location;
        this.state = {
            //userId:query.userId,
            //列表   
            list:[]     
        }
    }
    componentDidMount(){
        //this.getRecordInfo();
    }
    getRecordInfo=()=>{
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/credit/user/getEmergencyContactHistory',
            data:{
                userId: this.state.userId
            }
        }).then((data)=>{
            //保存用户数据
            this.setState({
                list:data
            })
        }).catch((msg)=>{
            Modal.infoX(msg);
        }).finally(()=>{
			Loading.hide();
		})
    }
    
    // 日期格式转换
    formatDate=(time)=> {
        return new Date(time*1000).Format('yyyy-MM-dd hh:mm');
    }

    render() {
        const { list } = this.state
        return (
            <div className='record-credit'>
            <div className="father_flex_div">
                {list.map((item) => {
                    return (
                        <div key={Math.random()}>
                            <Flex className="father_flex">
                                <Flex.Item>姓名</Flex.Item>
                                <Flex.Item>{item.contactDetail[0] && item.contactDetail[0].contact_name?item.contactDetail[0].contact_name:'未知'}</Flex.Item>
                                <Flex.Item>{item.contactDetail[1] && item.contactDetail[1].contact_name?item.contactDetail[1].contact_name:'未知'}</Flex.Item>
                            </Flex>
                            <Flex className="father_flex">
                                <Flex.Item>与本人关系</Flex.Item>
                                <Flex.Item>{item.contactDetail[0] && item.contactDetail[0].contact_type?item.contactDetail[0].contact_type:'未知'}</Flex.Item>
                                <Flex.Item>{item.contactDetail[1] && item.contactDetail[1].contact_type?item.contactDetail[1].contact_type:'未知'}</Flex.Item>
                            </Flex>
                            <Flex className="father_flex">
                                <Flex.Item>联系方式</Flex.Item>
                                <Flex.Item>{item.contactDetail[0] && item.contactDetail[0].contact_tel?item.contactDetail[0].contact_tel:'未知'}</Flex.Item>
                                <Flex.Item>{item.contactDetail[1] && item.contactDetail[1].contact_tel?item.contactDetail[1].contact_tel:'未知'}</Flex.Item>
                            </Flex>
                            <Flex className="father_flex">
                                <Flex.Item>半年内通话次数</Flex.Item>
                                <Flex.Item>{item.contactDetail[0] && item.contactDetail[0].call_cnt?item.contactDetail[0].call_cnt:'0'}</Flex.Item>
                                <Flex.Item>{item.contactDetail[1] && item.contactDetail[1].call_cnt?item.contactDetail[1].call_cnt:'0'}</Flex.Item>
                            </Flex>
                            <Flex className="father_flex">
                                <Flex.Item>更新时间</Flex.Item>
                                <Flex.Item>{item.update_time?this.formatDate(item.update_time):'未知'}</Flex.Item>
                            </Flex>
                        </div>
                    )
                })}
                </div>
                <List className="no_data" hidden={list.length !== 0}>
                    <img src={'/imgs/iou/loan-null.svg'} />
                    <div className="row_font">暂无任何内容</div>
                </List>
                
        </div>
        )
    }
}