
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
    static contextTypes = {
        router: PropTypes.object.isRequired
    }
    constructor(props, context) {
        document.title = "展期状态";
        super(props, context)
        const query = util.getUrlParams(this.props.location.search);
        let strs = query.id.split('___');
        this.state = {
            id:strs[0],
            isShare:strs[1],
            show:false,
            //0 借款人   1出借人    2其他人
            isSelf:2,
            extensStatus:0,
            //展期状态;0、已发起待确认 1、已确认（回盘） 2、 已确认，系统正在处理 3、展期已结束（借条已完结，或者新申请了展期） -1、驳回 -2、系统处理失败（回盘失败） -3、展期未确认，已失效
            //展期还款日
            repaymentDay:'',
            //展期利率
            rolloverRate:'',
        };
    }

    componentDidMount(){
        this.getShowStatus();
    }

    getShowStatus=()=>{
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/loanlater/loanExceeding/getLastLoanExceeding',
            data: {
                loanId: this.state.id
            }
        }).then((data) => {
            let self = 2;
            if(data.lenderUidE == $.getUserInfo().userId){
                self = 1;
            }
            if(data.borrowerUidE == $.getUserInfo().userId){  
                self = 0;
            }

            if(self==0 && data.extensStatus==0){
                this.props.history.replace({
                    pathname: '/after/show_confirm',
                    query:{
                        id:this.state.id,
                        isShare:this.state.isShare
                    }
                });
                return;
            }

            if(self==2){
                Modal.infoX('您不能操作此借条',()=>{
                    this.props.history.replace({
                        pathname: '/'
                    });
                });
                return;
            }else{
                this.setState({
                    show:true,
                    isSelf:self,
                    amt:$.toYuan(data.amt),
                    repaymentDay: (new Date(data.endTm*1000)).Format('yyyy-MM-dd'),
                    rolloverRate: data.interestRateExtend,
                    extensStatus:data.extensStatus//展期状态
                })
                return; 
            }
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }

    onShare=()=>{
        $.setItem('wx_share',{
            id:this.state.id+"___1",
            code:0,
            path:'/after/show_status',
            amt:this.state.amt,
            rate:this.state.rolloverRate,
            date:this.state.repaymentDay,
        });
        this.props.history.push({
            pathname: '/after/share'
        });
    }

    onSuccess=()=>{        
        if(this.state.isShare==1){
            if(this.state.isSelf==1){
                //从分享
                this.props.history.push({
                    pathname: '/after/loan_detail',
                    query:{
                        id:this.state.id
                    }
                });
            }
            if(this.state.isSelf==0){
                //从分享
                this.props.history.push({
                    pathname: '/after/borrow_detail',
                    query:{
                        id:this.state.id
                    }
                });
            }            
        }else if(this.state.isShare==2){
            //从借条详情
            history.go(-1)
        }else{
            //从展期发起
            history.go(-2)
        }
    }
    
    render() {
        let { show,extensStatus,isSelf } = this.state;
        if(!show){
            return null;
        }

        if(isSelf==1){
            return (
                <div className='view-form'>
                    <div style={{height: '100%',overflow:'auto'}}>

                        <img src={'/imgs/iou/borrow-success.svg'} className="succ-img" />
                        {this.state.extensStatus==0?<div className="succ-font">展期已发起 ，待对方确认</div>:null}
                        {this.state.extensStatus==1?<div className="succ-font">已确认</div>:null}
                        {this.state.extensStatus==2?<div className="succ-font">已确认，系统正在处理</div>:null}
                        {this.state.extensStatus==3?<div className="succ-font">展期已结束</div>:null}
                        {this.state.extensStatus==-1?<div className="succ-font">展期已被驳回</div>:null}
                        {this.state.extensStatus==-2?<div className="succ-font">系统处理失败</div>:null}
                        {this.state.extensStatus==-3?<div className="succ-font">展期未确认，已失效</div>:null}                       
        
                        <Flex className="succ-table-flex" justify="between">
                            <Flex.Item>展期利率</Flex.Item>
                            <Flex.Item>{this.state.rolloverRate}%</Flex.Item>
                        </Flex>
                        <Flex className="succ-table-flex" justify="between">
                            <Flex.Item>展期还款日</Flex.Item>
                            <Flex.Item>{this.state.repaymentDay}</Flex.Item>
                        </Flex>
        
                        {extensStatus==0?<div className='common-btn_box'>
                            <Tap className='span' onTap={this.onSuccess}>完成</Tap>
                            <Tap className='c-black span active' onTap={this.onShare} >提醒Ta确认</Tap>
                        </div>:null}
        
                        {extensStatus==1||extensStatus==2?<div className='common-btn_box'>
                            <Tap className='c-black span active' onTap={this.onSuccess} >完成</Tap>
                        </div>:null}
        
                        {extensStatus==3||extensStatus==-1||extensStatus==-2||extensStatus==-3?<div className='common-btn_box'>
                            <Tap  className='c-black span active' onTap={()=>{
                                    this.props.history.push({
                                        pathname: '/after/show_new',
                                        query:{
                                            id: this.state.id
                                        }
                                    });
                            }} >重新发起展期</Tap>
                        </div>:null}
                    </div>
                </div>
            )
        }else{
            return (
                <div className='view-show-tatus'>
                    <div className="top-status">
                        <img src={'/imgs/com/cash_succ.svg'} alt="" />
                            {this.state.extensStatus==0?<div>展期已发起 ，待对方确认</div>:null}
                            {this.state.extensStatus==1?<div>已确认</div>:null}
                            {this.state.extensStatus==2?<div>已确认，系统正在处理</div>:null}
                            {this.state.extensStatus==3?<div>展期已结束</div>:null}
                            {this.state.extensStatus==-1?<div>展期已被驳回</div>:null}
                            {this.state.extensStatus==-2?<div>系统处理失败</div>:null}
                            {this.state.extensStatus==-3?<div>展期未确认，已失效</div>:null}
                    </div>
    
                    <Flex className="succ-table-flex" justify="between">
                        <Flex.Item>展期利率</Flex.Item>
                        <Flex.Item>{this.state.rolloverRate}%</Flex.Item>
                    </Flex>
                    <Flex className="succ-table-flex" justify="between">
                        <Flex.Item>展期还款日</Flex.Item>
                        <Flex.Item>{this.state.repaymentDay}</Flex.Item>
                    </Flex>
    
                    <div className='common-btn_box'>
                        <Tap className='c-black span active' onTap={this.onSuccess} >完成</Tap>
                    </div>
    
                </div>
            )
        }
    }
}