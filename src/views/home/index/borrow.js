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
                myBorrowStatus: false,
                friendBorrowStatus: false,
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
        let { homeInfo, setHomeInfo } = this.props.homeStore,
            { showAll } = this.state;
        if(type=='myBorrowStatus'){
            if(showAll.myBorrowStatus == false){//展开
                showAll.myBorrowStatus =true;
                if(homeInfo.borrowDynamic.borrowListCount == homeInfo.borrowDynamic.borrowList.length){//若已经获取过数据
                    this.setState({
                        showAll
                    })
                }else{//后台取数据
                    Loading.show()
                    $.ajaxE({
                        type: 'GET',
                        url: '/loanpre/userShowInfo/getBorrowListRest',
                        data:{}
                    }).then((data)=>{                   
                        homeInfo.borrowDynamic.borrowList = homeInfo.borrowDynamic.borrowList.concat(data)
                        setHomeInfo(homeInfo)
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
                showAll.myBorrowStatus =false;
                this.setState({
                    showAll
                })
            }
        }else if(type=='friendBorrowStatus'){
            if(showAll.friendBorrowStatus == false){//展开
                showAll.friendBorrowStatus = true
                if(homeInfo.borrowDynamic.friendProductListCount == homeInfo.borrowDynamic.friendProductList.length){//若已经获取过数据
                    this.setState({
                        showAll
                    })
                }else{//后台取数据
                    Loading.show()
                    $.ajaxE({
                        type: 'GET',
                        url: '/loanpre/userShowInfo/getFriendProductListRest',
                        data:{}
                    }).then((data)=>{
                        homeInfo.borrowDynamic.friendProductList = homeInfo.borrowDynamic.friendProductList.concat(data.borrowDynamic.friendProductList)
                        setHomeInfo(homeInfo)
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
                showAll.friendBorrowStatus =false
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
                identity:1  //获取默认数据
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

    onGo=(type,ob)=>{
        switch(type){
            case 'iou_detail':
                $.anchorId = ob.id;
                this.props.history.push({
                    pathname: '/pre/iou_detail',
                    search: '?id=' + ob.id
                });
            break;
            case 'product_detail':
                $.anchorId = ob.productId;
                this.props.history.push({
                    pathname: '/pre/product_detail',
                    search: '?id=' + ob.productId
                });
            break;
            case 'borrow_detail':
                $.anchorId = ob.id;
                this.props.history.push({
                    pathname: '/pre/borrow_detail',
                    search: '?id=' + ob.id
                });
            break;
            default:
            break;
        }
    }
    
    render () {
        const { homeInfo:{borrowDynamic} } = this.props.homeStore;
        let { showAll:{myBorrowStatus,friendBorrowStatus,} } = this.state;
        return (
            <div className='home-list'>       
                {borrowDynamic.borrowListCount?<div className='list-box'>
                    <h3 className='com-title-left'>我在借款</h3>
                    {borrowDynamic.borrowList.map((ele,index)=>{
                        if(!myBorrowStatus&&index>4)return;
                        return <div className='list-card' key={ele.id}>
                            <Anchor id={ele.id}></Anchor>
                            <Tap onTap={()=>{ele.type==0?this.onGo('borrow_detail',ele):this.onGo('iou_detail',ele)}}>
                                {ele.type==0?<div className='top'>
                                    <p>
                                        <span className='font14 fontC3'>已借到</span>
                                        <span className='num-font font24 mainC1 numMar'>{ele.getAmount}</span>
                                        <span className='font12 mainC1'>元</span>
                                    </p>
                                    <Tap className='com-btn-border'>邀请出借人</Tap>
                                </div>:<div className='top'>
                                    <p>
                                        <img src={(ele.avatarUrl&&ele.avatarUrl.length)?ele.avatarUrl:'/imgs/iou/user.svg'} />
                                        {ele.type==1?<span className='fontC3 font12 text-left'>
                                            <span className='marB6 mainC2'>我发给{ele.name}的补借条</span>
                                            {ele.leftOverDays}天后关闭
                                        </span>:<span className='fontC3 font12 text-left'>
                                            <span  className='marB6 mainC2'>{ele.name}发给我的补借条</span>
                                            {ele.leftOverDays}天后关闭
                                        </span>}
                                    </p>
                                    {ele.type==1?<Tap className='com-btn-border'>提醒TA确认</Tap>:
                                    ele.type==2?<Tap className='com-btn-border'>马上确认</Tap>:null}
                                </div>}
                                {ele.type==0?<div className='bottom'>
                                    <span className='font14 fontC3'>总金额</span>
                                    <span className='font16 fontC1 numMar'>{$.toYuan(ele.amount)}</span>
                                    <span className='font12 fontC1 num-font'>元</span>
                                    <span className='font14 fontC3 marL30'>{ele.leftOverDays}天后失效</span>
                                </div>:<div className='bottom text-left'>
                                    <p className='mainC1 font24 num-font'>{$.toYuan(ele.amount)}<span className='font12'>元</span></p>
                                    <span className='font14 fontC3'>时长</span>
                                    <span className='font14 fontC3 numMar'>{ele.borrowDays}天</span>
                                    <span className='font14 fontC3 marL30'>年利率</span>
                                    <span className='font14 fontC3 numMar'>{ele.interestRate}%</span>
                                </div>}
                            </Tap>
                        </div>
                    })}
                    {!myBorrowStatus&&borrowDynamic.borrowListCount>5?
                        <Tap onTap={()=>{this.onShowAll('myBorrowStatus')}}><p className='h-show-more font12 fontC4'>查看全部{borrowDynamic.borrowListCount}个借款<img src={'/imgs/home/arrow-r.svg'} /></p></Tap>
                    :null}
                    {myBorrowStatus&&borrowDynamic.borrowListCount>5?
                        <Tap onTap={()=>{this.onShowAll('myBorrowStatus')}}><p className='h-show-more font12 fontC4'>收起<img style={{transform: 'rotate(270deg)'}} src={'/imgs/home/arrow.svg'} /></p></Tap>
                    :null}
                </div>:null}

                {borrowDynamic.friendProductListCount?<div className='list-box'>                
                    <h3 className='com-title-left'>好友在出借</h3>
                    {borrowDynamic.friendProductList.map((ele,index)=>{
                        if(!friendBorrowStatus&&index>4)return;
                        return <div className='list-card' key={ele.productId}>
                            <Anchor id={ele.productId}></Anchor>
                            <Tap onTap={()=>{this.onGo('product_detail',ele)}}>
                                <div className='top'>
                                    <p>
                                        <img src={(ele.avatarUrl&&ele.avatarUrl.length)?ele.avatarUrl:'/imgs/iou/user.svg'} />
                                        <span className='fontC3 font12 text-left'>
                                            <span  className='marB6 mainC2'>{ele.lenderName}</span>
                                            已有{ele.applyCount}人申请
                                        </span>
                                    </p>
                                    <Tap className='com-btn-border'>马上申请</Tap>
                                </div>
                                <div className='bottom text-left'>
                                    <p className='mainC1 font24 num-font'>
                                        {$.toYuan(ele.minAmount)}-{$.toYuan(ele.maxAmount)}
                                        <span className='font12'>元</span>
                                    </p>
                                    <span className='font14 fontC3'>时长</span>

                                    {ele.repayType==0?<span className='font14 fontC3 numMar'>
                                    {ele.minTime+minTimeUnits[ele.minTimeUnit]}-{ele.maxTime+minTimeUnits[ele.maxTimeUnit||ele.maxTimeUnit]}
                                    </span>:<span className='font14 fontC3 numMar'>
                                    {ele.minTime}期-{ele.maxTime}期
                                    </span>}

                                    <span className='font14 fontC3 marL30'>年利率</span>
                                    <span className='font14 fontC3 numMar'>{ele.interestRate}%</span>
                                </div>
                            </Tap>
                        </div>
                        })}
                        {!friendBorrowStatus&&borrowDynamic.friendProductListCount>5?<Tap onTap={()=>{this.onShowAll('friendBorrowStatus')}}>
                            <p className='h-show-more font12 fontC4'>展开所有<img src={'/imgs/home/arrow.svg'} /></p>
                        </Tap>:null}
                        {friendBorrowStatus&&borrowDynamic.friendProductListCount>5?<Tap onTap={()=>{this.onShowAll('friendBorrowStatus')}}>
                            <p className='h-show-more font12 fontC4'>收起<img style={{transform: 'rotate(270deg)'}} src={'/imgs/home/arrow.svg'} /></p>
                        </Tap>:null}
                </div>:null}

                {borrowDynamic.amongLoanListCount?<div className='list-box'>
                    <h3 className='com-title-left'>借条动态</h3>
                    {borrowDynamic.amongLoanList.map((ele,index)=>{
                        return <Tap key={ele.loanId} onTap={()=>{this.onGo('borrow_detail',ele)}}>
                                <Anchor id={ele.loanId}></Anchor>
                                <div className='list-card'>
                                    <div className='top'>
                                        <p>
                                            <img src={(ele.avatarUrl&&ele.avatarUrl.length)?ele.avatarUrl:'/imgs/iou/user.svg'} />
                                            <span className='mainC2 font12 text-left'>
                                                {ele.name}发起的{ele.type==0?'销账':'展期'}
                                            </span>
                                        </p>
                                        <Tap className='com-btn-border'>马上处理</Tap>
                                    </div>
                                    <div className='bottom text-left'>
                                        <p className='mainC1 font24 num-font'>
                                            {$.toYuan(ele.amount)}
                                            <span className='font12'>元</span>
                                        </p>
                                        <span className='font14 fontC3'>时长</span>
                                        <span className='font14 fontC3 numMar'>3天</span>
                                        <span className='font14 fontC3 marL30'>年利率</span>
                                        <span className='font14 fontC3 numMar'>{ele.interestRate}%</span>
                                    </div>
                                </div>
                            </Tap>}
                    )}
                </div>:null}
            </div>
        )
    }
}
