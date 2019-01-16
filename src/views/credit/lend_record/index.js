
//信用报告-借出记录
import '../credit.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { Flex,List } from 'antd-mobile'
import { Loading, Modal, util} from 'SERVICE'
import { inject, observer } from 'mobx-react'
import { Tap } from 'COMPONENT'

@withRouter
@inject('creditStore', 'userStore')
@observer
export default class App extends Component {
    constructor (props, context) {
        document.title = "借出记录";   
        super(props, context)
        let query = util.getUrlParams(this.props.location.search);
        this.state = {
            userId:query.userId,
            //列表   
            list:[],
            isShow:false, 
            isIdent:true,
        }
    }
    componentDidMount(){
        this.getRecordInfo();
    }
    getRecordInfo=()=>{
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/user/my/getLendList',
            data:{
                userId: this.state.userId
            }
        }).then((data)=>{
            //保存用户数据
            // if(this.state.userId==$.getUserInfo().userId){
            //     this.setState({
            //         isShow:true, 
            //     })
            // }
            this.setState({
                list:data
            })
            
        }).catch((msg)=>{
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }
  render () {
    const { list }=this.state;
    return (
        <div className='record-credit'>
            {this.state.isIdent && this.state.isShow?<div className="ident-self">
                * 标志为仅本人可见
                <Tap className="img" onTap={()=>{this.setState({isIdent:false}) }}><img src={'/imgs/credit/close_1.svg'} /></Tap>
            </div>:null}
            <Flex className="father_flex_tit">
                <Flex.Item>借款人</Flex.Item>
                <Flex.Item>借款金额</Flex.Item>
                <Flex.Item>创建时间</Flex.Item>
                <Flex.Item>还款时间</Flex.Item>
                {this.state.isShow?<Flex.Item><span className="idents">*</span>状态</Flex.Item>:null}
            </Flex>
            <div className="father_flex_div">
                {list.map((item) => {
                    return (
                        <Flex className="father_flex" key={Math.random()}>
                            <Flex.Item>{item.name}</Flex.Item>
                            <Flex.Item>{$.toYuan(item.amount)}元</Flex.Item>
                            <Flex.Item className="city-flex">{item.time}</Flex.Item>
                            <Flex.Item className="city-flex">{item.repayTime }</Flex.Item>
                            {this.state.isShow?<Flex.Item>{item.status==1?"还款中":null}
                            {item.status==2?"已还清":null}
                            {item.status==3?"已逾期":null}
                            {item.status==4?"有争议":null}
                            </Flex.Item>:null}
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
