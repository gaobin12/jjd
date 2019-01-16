
//展期状态(公共)
import '../form.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { List,Flex } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Loading, Modal } from 'SERVICE'
import { Tap } from 'COMPONENT'
import util from 'SERVICE/util'
const Item = List.Item;
const Brief = Item.Brief;

@withRouter
export default class App extends Component {
    constructor(props, context) {
        document.title = "展期状态";
        super(props, context)
        const query = util.getUrlParams(this.props.location.search);
        this.state = {
            id:query.id,
            extensStatus:0,
            //展期状态;0、已发起待确认 1、已确认（回盘） 2、 已确认，系统正在处理 3、展期已结束（借条已完结，或者新申请了展期） -1、驳回 -2、系统处理失败（回盘失败） -3、展期未确认，已失效
            //展期还款日
            repaymentDay:"",
            //展期利率
            rolloverRate:1,
        };
    }

    componentDidMount(){
        this.getLastLoanExceeding();
    }

    getLastLoanExceeding=()=>{
        $.ajaxE({
            type: 'GET',
            url: '/loanlater/loanExceeding/getLastLoanExceeding',
            data: {
                loanId: this.state.id
            }
        }).then((data) => {
            if(data){        
                this.setState({
                    repaymentDay: (new Date(data.endTm*1000)).Format('yyyy-MM-dd'),
                    rolloverRate: data.interestRateExtend,
                    extensStatus:data.extensStatus//展期状态
                })             
            }
        }).catch((msg) => {
            console.log(msg)
        })
    }

    render() { 
        return (
            <div className="view-form">
                <div style={{height: '100%',overflow:'auto'}}>		
                    <img src={'/imgs/iou/borrow-success.svg'} className="succ-img" />
                    {this.state.extensStatus==0?<div>
                    <p className="succ-font">展期已发起 ，待对方确认</p>
                    <p className="succ-font-sml">对方在今日22:00之前确认即可生效</p>
                    </div>:null}
                    {this.state.extensStatus==1?<p className="succ-font">已确认</p>:null}
                    {this.state.extensStatus==2?<p className="succ-font">已确认，系统正在处理</p>:null}
                    {this.state.extensStatus==3?<p className="succ-font">展期已结束</p>:null}
                    {this.state.extensStatus==-1?<p className="succ-font">对方已确认 &nbsp;&nbsp;系统处理中</p>:null}
                    {this.state.extensStatus==-2?<p className="succ-font">系统处理失败<br />请于今日22:00之前重试</p>:null}
                    {this.state.extensStatus==-3?<p className="succ-font">对方未在当天22:00前确认 <br />  本次展期已失效</p>:null}

                    <Flex className="succ-table-flex" justify="between">
                        <Flex.Item>展期利率</Flex.Item>
                        <Flex.Item>{this.state.rolloverRate}%</Flex.Item>
                    </Flex>
                    <Flex className="succ-table-flex" justify="between">
                        <Flex.Item>展期还款日</Flex.Item>
                        <Flex.Item>{this.state.repaymentDay}</Flex.Item>
                    </Flex>
                </div>
                <div className="common-btn_box">
                    {this.state.extensStatus!=0&&this.state.extensStatus!=2?<Tap className='c-black span font16 active' onTap={()=>{
                            this.props.history.push({
                                pathname: '/after/show_new',
                                query:{
                                    id: this.state.id
                                }
                            });
                    }} >重新发起展期</Tap>:<Tap className='c-black span font16 active' onTap={()=>{
                            history.go(-2)
                    }} >完成</Tap>}  
                </div>
            </div>
        )
    }
}