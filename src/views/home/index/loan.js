
//出借
import './index.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Tap,Anchor } from 'COMPONENT'
import { Loading, Modal, util, math } from 'SERVICE'

const minTimeUnits = ['日','月','年']

@withRouter
@inject('userStore','homeStore')
@observer
export default class page extends Component {
	
	constructor (props, context) {
        super(props, context)
        this.state = {
            //展开收起状态
            showAll: {
                myLendStatus: false,
            },
        };
    }
    
    componentDidMount(){
        if(this.props.userStore.userInfo.userId){
            this.getPageInfo();
        }
    }

    componentDidUpdate(){
    }
    onShowAll(type){
        let { homeInfo, setHomeInfo, } = this.props.homeStore,
            { showAll } = this.state;
        
        if(type=='myLendStatus'){
            if(showAll.myLendStatus == false){//展开
                showAll.myLendStatus = true
                if(homeInfo.lendDynamic.borrowListCount == homeInfo.lendDynamic.borrowList.length){//若已经获取过数据
                    this.setState({
                        showAll
                    })
                }else{//后台取数据
                    Loading.show()
                    $.ajaxE({
                        type: 'GET',
                        //url: '/user/getBorrowerModuleInfo',
                        url: '/loanpre/userShowInfo/getFriendBorrowListRest',
                        data:{}
                    }).then((data)=>{
                        homeInfo.lendDynamic.borrowList = homeInfo.lendDynamic.borrowList.concat(data.lendDynamic.friendBorrowList)
                        setHomeInfo(setHomeInfo)
                        this.setState({
                            showAll
                        },()=>{
                            Loading.hide()
                        })
                    }).catch((msg)=>{
                        Modal.infoX(msg);
                    })
                }
            }else{//收起
                showAll.myLendStatus =false
                this.setState({
                    showAll
                })
            }
        }
    }

	//首页获取用户信息
	getPageInfo=()=>{
        const { homeStore } = this.props;
        Loading.show();
		$.ajaxE({
			type: 'GET',
			url: '/user/info/getHomepageInfo',
			data:{
                identity:2  //获取默认数据
            }
		}).then((data)=>{
            //保存用户数据
            homeStore.setHomeInfo(data);
		}).catch((msg)=>{			
			Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }

    onGoRouter=(type,ob)=>{
        $.anchorId = ob.id;
        switch(type){
            case 'friend_borrow':
                if(ob.type==0){
                    this.props.history.push({
                        pathname: '/pre/borrow_detail',
                        search: '?id=' + ob.id
                    });
                }else if(ob.type==1){
                    this.props.history.push({
                        pathname: '/pre/iou_detail',
                        search: '?id=' + ob.id
                    });
                }else if(ob.type==2){
                    this.props.history.push({
                        pathname: '/pre/borrow_detail',
                        search: '?id=' + ob.id
                    });
                }else{
                    this.props.history.push({
                        pathname: '/pre/borrow_detail',
                        search: '?id=' + ob.id
                    });
                }            
            break;
            case 'product_detail':
                this.props.history.push({
                    pathname: '/pre/product_detail',
                    search: '?id=' + ob.productId
                });
            break;
            case 'borrow_detail':
                this.props.history.push({
                    pathname: '/after/borrow_detail',
                    search: '?id=' + ob.id
                });
            break;
            default:
            break;
        }
    }
    
    render () {
        const { homeInfo:{lendDynamic} } = this.props.homeStore;
        let { showAll:{myLendStatus,} } = this.state;
        return (
            <div className='home-list'>
                {/* {lendDynamic.borrowListCount?<div className='list-box'>
                    <h3>我在出借</h3>
                    {lendDynamic.borrowList.map((ele,index)=>{
                        return <div className='list-card' key={Math.random()}>
                                <Tap onTap={()=>{this.onGoRouter('friendBorrow',ele)}}>
                                    <div className='top'>
                                        <p>
                                            <span className='num-font font24 mainC1 numMar'>{1000-5000}</span>
                                            <span className='font12 mainC1'>元</span>
                                        </p>
                                        <span className='font14 mainC2'><img src='/imgs/home/share.svg' />分享</span>
                                    </div>
                                    <div className='bottom text-left'>
                                        <span className='font14 fontC3'>时长</span>
                                        <span className='font14 fontC3 numMar'>3天-3个月</span>
                                        <span className='font14 fontC3 marL30'>年利率</span>
                                        <span className='font14 fontC3 numMar'>{ele.interestRate}%</span>
                                    </div>
                                </Tap>
                            </div>
                        })}
                    {!myLendStatus&&lendDynamic.borrowListCount>5?<Tap onTap={()=>{this.onShowAll('myLendStatus')}}>                    
                        <p className='h-show-more font12 fontC4'>查看全部{lendDynamic.borrowListCount}个借款<img src={'/imgs/home/arrow.svg'} /></p>
                    </Tap>:null}
                    {myLendStatus&&lendDynamic.borrowListCount>5?<Tap onTap={()=>{this.onShowAll('myLendStatus')}}>                    
                        <p className='h-show-more font12 fontC4'>收起<img style={{transform: 'rotate(270deg)'}} src={'/imgs/home/arrow.svg'} /></p>
                    </Tap>:null}
                </div>
            :null} */}

            {lendDynamic.borrowListCount?<div className='list-box'>
                    <h3>好友在借款</h3>
                    {lendDynamic.borrowList.map((ele,index)=>{
                        if(!myLendStatus&&index>4)return;  
                        return <div className='list-card' key={ele.id}>
                                <Anchor id={ele.id}></Anchor>
                                <Tap onTap={(e)=>{this.onGoRouter('friend_borrow',ele)}}>
                                    <div className='top'>
                                        <p>
                                            <img src={(ele.avatarUrl&&ele.avatarUrl.length)?ele.avatarUrl:'/imgs/iou/user.svg'} />
                                            <span className='fontC3 font12 text-left'>
                                                <span  className='marB6 mainC2'>
                                                    {ele.type==0?`${ele.name}申请借款`:null}
                                                    {ele.type==1?`我发给${ele.name}的补借条`:null}
                                                    {ele.type==2?`${ele.name}发给我的补借条`:null}
                                                    {ele.type==3?`${ele.name}正在请求借款`:null}
                                                </span>
                                                {ele.leftOverDays}天后关闭
                                            </span>
                                        </p>
                                        <Tap className='com-btn-border'>
                                            {ele.type==0?'马上审核':null}
                                            {ele.type==1?'提醒他确认':null}
                                            {ele.type==2?'马上确认':null}
                                            {ele.type==3?'借给他':null}
                                        </Tap>
                                    </div>
                                    <div className='bottom text-left'>
                                        <p className='mainC1 font24 num-font'>{$.toYuan(ele.amount)}<span className='font12'>元</span></p>
                                        <span className='font14 fontC3'>时长</span>
                                        {(ele.type==1||ele.type==2)?<span className='font14 fontC3 numMar'>
                                            {ele.borrowDays}天
                                        </span>:null}
                                        <span className='font14 fontC3 marL30'>年利率</span>
                                        <span className='font14 fontC3 numMar'>{ele.interestRate}%</span>
                                    </div>
                                </Tap>                                
                            </div> 
                        })}
                    {!myLendStatus&&lendDynamic.borrowListCount>5?<Tap onTap={()=>{this.onShowAll('myLendStatus')}}>                    
                        <p className='h-show-more font12 fontC4'>查看全部{lendDynamic.borrowListCount}个借款<img src={'/imgs/home/arrow.svg'} /></p>
                    </Tap>:null}
                    {myLendStatus&&lendDynamic.borrowListCount>5?<Tap onTap={()=>{this.onShowAll('myLendStatus')}}>                    
                        <p className='h-show-more font12 fontC4'>收起<img style={{transform: 'rotate(270deg)'}} src={'/imgs/home/arrow.svg'} /></p>
                    </Tap>:null}
                </div>:null}

            {lendDynamic.amongLoanListCount?
                <div className='list-box'>
                    <h3>借条动态</h3>
                    {lendDynamic.amongLoanList.map((ele,index)=>{
                        return <div className='list-card' key={ele.id}>
                                <Anchor id={ele.id}></Anchor>
                                <Tap onTap={()=>{this.onGoRouter('report',ele)}}>
                                    <div className='top'>
                                        <p>
                                            <img src={(ele.avatarUrl&&ele.avatarUrl.length)?ele.avatarUrl:'/imgs/iou/user.svg'} />
                                            <span className='mainC2 font12 text-left'>
                                                {ele.type==0?`${ele.name}举报了你`:
                                                ele.type==1?`${ele.name}的催收状态更新了`:null}
                                            </span>
                                        </p>
                                        <Tap className='com-btn-border'>马上处理</Tap>
                                    </div>
                                    <div className='bottom text-left'>
                                        {ele.type==0?<span className='font12 mainC2'><font className='mainC1'>举报原因</font>&nbsp;&nbsp;&nbsp;&nbsp;  不确认收款</span>:
                                        ele.type==1?<span className='font12 fontC4'>电话催收-已接通-预计本周还款…</span>:null}
                                    </div>
                                </Tap>
                            </div>
                        })}
                </div>:null}
            </div>
        )
    }
}
