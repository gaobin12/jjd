//出借
import './index.less'
import React, { Component } from 'react'
import { Tap } from 'COMPONENT'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Loading, Modal, util, math } from 'SERVICE'

@withRouter
@inject('userStore','homeStore')
@observer
export default class page extends Component {
	
	constructor (props, context) {
        super(props, context)

        this.state = {
            //展开收起状态
            showAll: {
                myGuaranteeStatus: false,
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
        if(type=='myGuaranteeStatus'){
            if(showAll.myGuaranteeStatus == false){//展开
                showAll.myGuaranteeStatus = true
                if(homeInfo.guaranteeDynamic.borrowListCount == homeInfo.guaranteeDynamic.borrowList.length){//若已经获取过数据
                    this.setState({
                        showAll
                    })
                }else{//后台取数据
                    Loading.show()
                    $.ajaxE({
                        type: 'GET',
                        url: '/loanpre/userShowInfo/getGuaranteeListRest',
                        data:{}
                    }).then((data)=>{
                        homeInfo.guaranteeDynamic.borrowList = homeInfo.guaranteeDynamic.borrowList.concat(data)
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
                showAll.myGuaranteeStatus =false
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
                identity:3  //获取默认数据
            }
		}).then((data)=>{
            homeStore.setHomeInfo(data);            
		}).catch((msg)=>{			
			Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }

    onGo=(type,ob)=>{
        switch(type){
            case 'guarantee':
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
        const { homeInfo:{guaranteeDynamic} } = this.props.homeStore;
        let { showAll:{myGuaranteeStatus} } = this.state;
        return (
            <div className='home-list'>                
                {guaranteeDynamic.borrowListCount?<div className='list-box'>
                <h3>好友在借钱</h3>
                {guaranteeDynamic.borrowList.map((ele,index)=>{
                    if(!myGuaranteeStatus&&index>4)return;
                    return <div className='list-card' key={Math.random()}>
                            <Tap onTap={()=>{this.onGo('guarantee',ele)}}>
                                <div className='top'>
                                    <p>
                                        <img src={ele.avatarUrl||ele.name[0]} />
                                        <span className='fontC3 font12 text-left'>
                                            <span  className='marB6 mainC2'>
                                                {ele.name}的求借款
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
                        {!myGuaranteeStatus&&guaranteeDynamic.borrowListCount>5?<Tap onTap={()=>{this.onShowAll('myGuaranteeStatus')}}>            
                            <p className='h-show-more font12 fontC4'>查看全部<img src={'/imgs/home/arrow.svg'} /></p>
                        </Tap>:null}
                        {myGuaranteeStatus&&guaranteeDynamic.borrowListCount>5?<Tap onTap={()=>{this.onShowAll('myGuaranteeStatus')}}>            
                            <p className='h-show-more font12 fontC4'>收起<img style={{transform: 'rotate(270deg)'}} src={'/imgs/home/arrow.svg'} /></p>
                        </Tap>:null}
                    </div>:null}
            </div>
        )
    }
}
