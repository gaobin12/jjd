
//信用报告-定位详情
import '../credit.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { Flex,List } from 'antd-mobile'
import { Loading,Modal } from 'SERVICE'

@withRouter
export default class App extends Component {
    constructor(props, context) {
        document.title = "定位详情";
        super(props, context)
        let { query } = this.props.location;
        this.state = {
            //userId:query.userId,
            //列表   
            list:[]     
        };
    }
    // 日期格式转换
    formatDate=(time)=> {
        return new Date(time*1000).Format('yyyy-MM-dd');
    }
    componentDidMount(){
        //this.getRecordInfo();
    }
    getRecordInfo=()=>{
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/credit/user/getLocationHistory',
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
    
    render() {
        const { list } = this.state
        return (
            <div className='record-credit'>
                <Flex className="father_flex_tit">
                    <Flex.Item>定位时间</Flex.Item>
                    <Flex.Item>定位地点</Flex.Item>
                </Flex>
                <div className="father_flex_div">
                    {list.map((item) => {
                        return (
                            <Flex className="father_flex" key={Math.random()}>
                                <Flex.Item>{item.location_tm?this.formatDate(item.location_tm):'未知'}</Flex.Item>
                                <Flex.Item>{item.province_name}{item.city_name}</Flex.Item>
                            </Flex>
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
