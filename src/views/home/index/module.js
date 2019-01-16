
import React, { Component } from 'react'
import { Tap } from 'COMPONENT'


let getSideBar=function(){
        let {userInfo} = this.props.homeStore.homeInfo;
        const sidebar = (
            <div className="left-cont">
                <div style={{height:'100%',overflow:'auto'}}>
                    <div className='head'>
                        <Tap onTap={() => { this.gotoPage('friend') }}>
                            <img src={'/imgs/iou/user.svg'} />
                            <span className='font18 fontC1'>{'琚城'}</span>
                            {/* <span className='font18 fontC1'>尚未实名认证</span> */}
                            <span className='font14 fontC1'>{'13623563562'}</span>
                        </Tap>
                    </div>
                    <div className='credit'>
                        <Tap onTap={() => { this.gotoPage('card') }}>
                            <span className='mainC1 font12'>银行卡</span><img src='/imgs/home/arrow-color.svg' />
                        </Tap>
                        <Tap onTap={() => { this.gotoPage('credit') }}>
                            <span className='mainC1 font12'>信用报告</span><img src='/imgs/home/arrow-color.svg' />
                        </Tap>
                    </div>
                    <div className='menu'>
                        <Tap onTap={() => { this.gotoPage('wallet') }}>
                            <img src={'/imgs/home/wallet.svg'} />
                            <span>钱包</span>
                            <span className='right'>
                            {
                                userInfo && $.toYuan(userInfo.amount) ? $.toYuan(userInfo.amount):0
                            }元</span>
                        </Tap>
                        <Tap onTap={() => { this.gotoPage('repay_list') }}>
                            <img src={'/imgs/home/repay.svg'} />
                            <span>待还</span>
                            <span className='right'>
                            {
                                userInfo && $.toYuan(userInfo.toRepayAmount) ?  $.toYuan(userInfo.toRepayAmount):0
                            }元</span>
                        </Tap>
                        <Tap onTap={() => { this.gotoPage('receive_list') }}>
                            <img src={'/imgs/home/receive.svg'} />
                            <span>待收</span>
                            <span className='right'>
                            {
                                userInfo && $.toYuan(userInfo.toReceiveAmount) ? $.toYuan(userInfo.toReceiveAmount):0
                            }元
                            </span>
                        </Tap>
                        <Tap onTap={() => { this.gotoPage('guarantee_list') }}>
                            <img src={'/imgs/home/guarantee.svg'} />
                            <span>担保</span>
                        </Tap>
                        <Tap onTap={() => { this.gotoPage('friend') }}>
                            <img src={'/imgs/home/friend.svg'} />
                            <span>好友</span>
                        </Tap>
                    </div>
                </div>
                <div className='bottom'>
                    <Tap onTap={() => { this.gotoPage('setting') }}>
                        <img src={'/imgs/home/setting.svg'} />
                        <span>设置</span>
                    </Tap>
                    <Tap onTap={() => { this.gotoPage('faqs') }}>
                        <img src={'/imgs/home/kefu.svg'} />
                        <span>客服</span>
                    </Tap>
                    <Tap onTap={() => { this.gotoPage('strategy') }}>
                        <img src={'/imgs/home/gonglue.svg'} />
                        <span>攻略</span>
                    </Tap>
                </div>
            </div>
        )
        return sidebar
    },
 getListComponent=function(){
        let { switchIndex, homeInfo } = this.props.homeStore, //homeInfo  首页展示数据
            { showAll, topIndex, productType, productIdList, rentSearchList } = this.state,
            { myBorrowStatus, friendBorrowStatus, myLendStatus, myGuaranteeStatus } = showAll;

        let result = null;
        if(topIndex==1&&switchIndex==1&&homeInfo&&homeInfo.borrowDynamic){
            result=<div className='home-list'>{homeInfo.borrowDynamic.borrowListCount?
                <div className='list-box'>
                    <h3 className='com-title-left'>我在借款</h3>
                    {homeInfo.borrowDynamic.borrowList.map((ele,index)=>{
                    if(!myBorrowStatus&&index>4)return;
                    return <div className='list-card' key={Math.random()}>
                            <Tap onTap={(e)=>{this.onGoRouter('myBorrow',ele,e)}}>
                                {ele.type==0?<div className='top'>
                                    <p>
                                        <span className='font14 fontC3'>已借到</span>
                                        <span className='num-font font24 mainC1 numMar'>{ele.getAmount}</span>
                                        <span className='font12 mainC1'>元</span>
                                    </p>
                                    <Tap className='com-btn-border'>邀请出借人</Tap>
                                </div>:<div className='top'>
                                    <p>
                                        <img src='/imgs/iou/user.svg' />
                                        {ele.type==1?<span className='fontC3 font12 text-left'>
                                            <span className='marB6 mainC2'>我发给{ele.name}的补借条</span>
                                            3天后关闭
                                        </span>:<span className='fontC3 font12 text-left'>
                                            <span  className='marB6 mainC2'>{ele.name}发给我的补借条</span>
                                            3天后关闭
                                        </span>}
                                    </p>
                                    {ele.type==1?<Tap className='com-btn-border'>提醒TA确认</Tap>:
                                    ele.type==2?<Tap className='com-btn-border'>马上确认</Tap>:null}
                                </div>}
                                {ele.type==0?<div className='bottom'>
                                    <span className='font14 fontC3'>总金额</span>
                                    <span className='font16 fontC1 numMar'>{ele.getAmount}</span>
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
                    {!myBorrowStatus&&homeInfo.borrowDynamic.borrowListCount>5?
                        <Tap onTap={()=>{this.onShowAll('myBorrowStatus')}}><p className='h-show-more font12 fontC4'>查看全部{homeInfo.borrowDynamic.borrowListCount}个借款<img src={'/imgs/home/arrow-r.svg'} /></p></Tap>
                    :null}
                    {myBorrowStatus&&homeInfo.borrowDynamic.borrowListCount>5?
                        <Tap onTap={()=>{this.onShowAll('myBorrowStatus')}}><p className='h-show-more font12 fontC4'>收起<img style={{transform: 'rotate(270deg)'}} src={'/imgs/home/arrow.svg'} /></p></Tap>
                    :null}
                </div>
            :null}

            {homeInfo&&homeInfo.borrowDynamic.friendProductListCount?
                <div className='list-box'>
                    <h3 className='com-title-left'>好友在出借</h3>
                    {homeInfo.borrowDynamic.friendProductList.map((ele,index)=>{
                    if(!friendBorrowStatus&&index>4)return;
                    return <div className='list-card' key={Math.random()}>
                            <Tap onTap={()=>{this.props.history.push({pathname:'/pre/loan_detail',query:{id:ele.productId}})}}>
                                <div className='top'>
                                    <p>
                                        <img src='/imgs/iou/user.svg' />
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
                                    <span className='font14 fontC3 numMar'>2天</span>
                                    <span className='font14 fontC3 marL30'>年利率</span>
                                    <span className='font14 fontC3 numMar'>{ele.interestRate}%</span>
                                </div>
                            </Tap>
                        </div>
                        })}
                        {!friendBorrowStatus&&homeInfo.borrowDynamic.friendProductListCount>5?<Tap onTap={()=>{this.onShowAll('friendBorrowStatus')}}>
                            <p className='h-show-more font12 fontC4'>展开所有<img src={'/imgs/home/arrow.svg'} /></p>
                        </Tap>:null}
                        {friendBorrowStatus&&homeInfo.borrowDynamic.friendProductListCount>5?<Tap onTap={()=>{this.onShowAll('friendBorrowStatus')}}>
                            <p className='h-show-more font12 fontC4'>收起<img style={{transform: 'rotate(270deg)'}} src={'/imgs/home/arrow.svg'} /></p>
                        </Tap>:null}
                </div>
            :null}

            {homeInfo&&homeInfo.borrowDynamic.amongLoanListCount?
                <div className='list-box'>
                    <h3 className='com-title-left'>借条动态</h3>
                    {homeInfo.borrowDynamic.amongLoanList.map((ele,index)=>{
                    if(index>4)return;
                    return <Tap key={Math.random()} onTap={()=>{this.props.history.push({pathname:'/after/borrow_detail',query:{id:ele.loanId}})}}>
                            <div className='list-card'>
                                <div className='top'>
                                    <p>
                                        <img src='/imgs/iou/user.svg' />
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
                        </Tap>
                        }
                )}
                </div>
            :null}</div>
        }else if(topIndex==1&&switchIndex==2&&homeInfo&&homeInfo.lendDynamic){
            result=<div className='home-list'>
                {homeInfo.lendDynamic.borrowListCount?
                <div className='list-box'>
                    <h3>我在出借</h3>
                    {homeInfo.lendDynamic. borrowList.map((ele,index)=>{
                    if(!myLendStatus&&index>4)return;
                    return<div className='list-card' key={Math.random()}>
                            <Tap onTap={(e)=>{this.onGoRouter('friendBorrow',ele)}}>
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
                    {!myLendStatus&&homeInfo.lendDynamic.borrowListCount>5?<Tap onTap={()=>{this.onShowAll('myLendStatus')}}>                    
                        <p className='h-show-more font12 fontC4'>查看全部{homeInfo.lendDynamic.borrowListCount}个借款<img src={'/imgs/home/arrow.svg'} /></p>
                    </Tap>:null}
                    {myLendStatus&&homeInfo.lendDynamic.borrowListCount>5?<Tap onTap={()=>{this.onShowAll('myLendStatus')}}>                    
                        <p className='h-show-more font12 fontC4'>收起<img style={{transform: 'rotate(270deg)'}} src={'/imgs/home/arrow.svg'} /></p>
                    </Tap>:null}
                </div>
            :null}

            {homeInfo.lendDynamic.borrowListCount?
                <div className='list-box'>
                    <h3>好友在借钱</h3>
                    {homeInfo.lendDynamic. borrowList.map((ele,index)=>{
                    if(!myLendStatus&&index>4)return;
                    return<div className='list-card' key={Math.random()}>
                            <Tap onTap={(e)=>{this.onGoRouter('friendBorrow',ele)}}>
                                <div className='top'>
                                    <p>
                                        <img src='/imgs/iou/user.svg' />
                                        <span className='fontC3 font12 text-left'>
                                            <span  className='marB6 mainC2'>
                                                {ele.type==0?`${ele.name}申请借款`:null}
                                                {ele.type==1?`我发给${ele.name}的补借条`:null}
                                                {ele.type==2?`${ele.name}发给我的补借条`:null}
                                                {ele.type==3?`${ele.name}正在请求借款`:null}
                                            </span>
                                            3天后关闭
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
                                    <span className='font14 fontC3'>时长</span>
                                    <span className='font14 fontC3 numMar'>3天-3个月</span>
                                    <span className='font14 fontC3 marL30'>年利率</span>
                                    <span className='font14 fontC3 numMar'>{ele.interestRate}%</span>
                                </div>
                            </Tap>
                        </div> 
                    })}
                    {!myLendStatus&&homeInfo.lendDynamic.borrowListCount>5?<Tap onTap={()=>{this.onShowAll('myLendStatus')}}>                    
                        <p className='h-show-more font12 fontC4'>查看全部{homeInfo.lendDynamic.borrowListCount}个借款<img src={'/imgs/home/arrow.svg'} /></p>
                    </Tap>:null}
                    {myLendStatus&&homeInfo.lendDynamic.borrowListCount>5?<Tap onTap={()=>{this.onShowAll('myLendStatus')}}>                    
                        <p className='h-show-more font12 fontC4'>收起<img style={{transform: 'rotate(270deg)'}} src={'/imgs/home/arrow.svg'} /></p>
                    </Tap>:null}
                </div>
            :null}

            {homeInfo.lendDynamic.amongLoanListCount?
                <div className='list-box'>
                    <h3>借条动态</h3>
                    {homeInfo.lendDynamic.amongLoanList.map((ele,index)=>{
                    if(index>4)return;
                    return <div className='list-card' key={Math.random()}>
                        <Tap onTap={()=>{this.onGoRouter('report',ele)}}>
                            <div className='top'>
                                <p>
                                    <img src='/imgs/iou/user.svg' />
                                    <span className='mainC2 font12 text-left'>
                                        {ele.type==0?'马卫东举报了你':
                                        ele.type==1?'马卫东的催收状态更新了':null}
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
                </div>
            :null}</div>
        }else if(topIndex==1&&switchIndex==3&&homeInfo&&homeInfo.guaranteeDynamic){
            result=<div className='home-list'>{homeInfo.guaranteeDynamic.borrowListCount?
            <div className='list-box'>
                <h3>好友在借钱</h3>
                {homeInfo.guaranteeDynamic.borrowList.map((ele,index)=>{
                if(!myGuaranteeStatus&&index>4)return;
                    return <div className='list-card' key={Math.random()}>
                            <Tap onTap={()=>{this.onGoRouter('guarantee',ele)}}>
                                <div className='top'>
                                    <p>
                                        <img src='/imgs/iou/user.svg' />
                                        <span className='fontC3 font12 text-left'>
                                            <span  className='marB6 mainC2'>
                                                马卫东的求借款
                                            </span>
                                            3天后关闭
                                        </span>
                                    </p>
                                    <Tap className='com-btn-border'>
                                        做担保
                                    </Tap>
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
                            </Tap>
                        </div>
                        })}
                        {!myGuaranteeStatus&&homeInfo.guaranteeDynamic.borrowListCount>5?<Tap onTap={()=>{this.onShowAll('myGuaranteeStatus')}}>            
                            <p className='h-show-more font12 fontC4'>查看全部<img src={'/imgs/home/arrow.svg'} /></p>
                        </Tap>:null}
                        {myGuaranteeStatus&&homeInfo.guaranteeDynamic.borrowListCount>5?<Tap onTap={()=>{this.onShowAll('myGuaranteeStatus')}}>            
                            <p className='h-show-more font12 fontC4'>收起<img style={{transform: 'rotate(270deg)'}} src={'/imgs/home/arrow.svg'} /></p>
                        </Tap>:null}
                </div>
            :null}</div>
        }

        return result;
    };
export { getSideBar, getListComponent }