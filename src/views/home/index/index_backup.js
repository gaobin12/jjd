//主页
import './index.less'
import React, { Component } from 'react'
import { Tap } from 'COMPONENT'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Drawer, Carousel, WingBlank, Flex , SearchBar, PullToRefresh, List} from 'antd-mobile';
import { Modal, Loading } from 'SERVICE/popup'
import {getListComponent,getSideBar} from './module'

@withRouter
@inject('userStore','homeStore')
@observer
export default class page extends Component {
	
	constructor (props, context) {
        super(props, context)

        this.state = {
            open: false,
            switchIndex: props.homeStore.switchIndex,//1借款2出借3担保
            topIndex: 1,//1钱  2物
            notices: ['李**和陈**刚刚使用今借到成功借款','李**和陈**刚刚使用今借到成功借款','李**和陈**刚刚使用今借到成功借款'],//广播列表 excitationList
            // borrowInfo: null,//借钱
            // lenderInfo: null,//出借
            // guaranteeInfo: null,//担保
            //展开收起状态
            showAll: {
                myBorrowStatus: false,
                friendProductList: false,
                myLendStatus: false,
                myGuaranteeStatus: false,
            },
        };
    }
    
    componentDidMount(){ 
        this.props.userStore.getUserInfo();
        this.props.userStore.getUserCreditInfo();
        this.props.userStore.removeStorage();
    }

    componentDidUpdate(){
    }

	//首页获取用户信息
	getHomepageInfo=()=>{
		$.ajaxE({
			type: 'GET',
			url: '/user/info/getHomepageInfo',
			data:{
                identity:0  //获取默认数据
            }
		}).then((data)=>{
            //保存用户数据
            if(!data)return
            data.userInfo=data.userInfoVO;
			this.setState({
				data
            });
		}).catch((msg)=>{			
			console.error(msg);
		})
    }
    getBaseInfo = (e)=>{
        //广播信息激励组件
        $.ajaxE({
            type: 'GET',
            url: '/loanlater/loaninfo/getExcitationInfo',
            data:{type:e}
          }).then((data)=>{
            this.setState({
                notices: data||[]
            })
          }).catch((msg)=>{
            console.error(msg);
        })
    }

    onOpenChange=()=>{
        let {home,doDrawer} = this.props;
        doDrawer(!home.drawer);
    }
    onSwitch=e=>{
        let _this = this;
        let { doSwitchIndex, doSetHomeInfo } = this.props.homeStore;
        doSwitchIndex(e);
        if(!this.props.homeStore.isLogin){
            //如果未登录，不操作
            return     
        }
        //获取激励组件,先清空
        this.setState({
            notices: []
        })
        this.getBaseInfo(e-1)
        if(e==1){
            //借款信息
            $.ajaxE({
                type: 'GET',
                url: '/user/info/getHomepageInfo',
                data:{
                    identity:1
                }
              }).then((data)=>{
                    let { homeInfo } = _this.props.homeStore;
                    if(!homeInfo)homeInfo = {}
                    homeInfo.borrowDynamic = data.borrowDynamic; 
                    homeInfo.borrowInfo = data.borrowInfo;
                
                    //判断是否有求借款，求借款只能有一个
                    if(data.borrowInfo.bidStatus){//有求借款
                        sessionStorage.setItem('pre_borrow_form_state',1)
                    }else{//没有求借款
                        sessionStorage.removeItem('pre_borrow_form_state')
                    }
                    doSetHomeInfo(homeInfo)
                    _this.setState({
                        showAll: {
                            myBorrowStatus: false,
                            friendProductList: false,
                            myLendStatus: false,
                            myGuaranteeStatus: false,
                        },
                    })
                    
              }).catch((msg)=>{
                console.error(msg);
            })
        }else if(e==2){
            //出借信息
            $.ajaxE({
                type: 'GET',
                url: '/user/info/getHomepageInfo',
                data:{
                    identity:2
                }
              }).then((data)=>{
                let { homeInfo } = _this.props.homeStore;
                    if(!homeInfo)homeInfo = {}
                    homeInfo.lendDynamic = data.lendDynamic;
                    homeInfo.lendInfo = data.lendInfo
                    _this.setState({
                        homeInfo,
                        showAll: {
                            myBorrowStatus: false,
                            friendProductList: false,
                            myLendStatus: false,
                            myGuaranteeStatus: false,
                        },
                    })
              }).catch((msg)=>{
                console.error(msg);
            })
        }else if(e==3){            
            //担保信息
            $.ajaxE({
                type: 'GET',
                url: '/user/info/getHomepageInfo',
                data:{
                    identity:3
                }
            }).then((data)=>{
                let { homeInfo } = _this.props.homeStore;
                if(!homeInfo)homeInfo = {}
                homeInfo.guaranteeDynamic = data.guaranteeDynamic;
                homeInfo.guaranteeInfo = data.guaranteeInfo
                _this.setState({
                    homeInfo,
                    showAll: {
                        myBorrowStatus: false,
                        friendProductList: false,
                        myLendStatus: false,
                        myGuaranteeStatus: false,
                    },
                })
            }).catch((msg)=>{
                console.error(msg);
            })
        }
    }
    onShowIOU(key,value,param){
        if(this.props.homeStore.isLogin){
            this.setState({
                [key]: value,
                creditor: param
            })
        }else{
            this.props.history.push({
                pathname: '/user/login'
            })
        }
    }
    onShowAll(type){
        let { homeInfo } = this.props.homeStore,
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
                        this.setState({
                            homeInfo,
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
                        this.setState({
                            homeInfo,
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
        }else if(type=='myLendStatus'){
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
                        this.setState({
                            homeInfo,
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
        }else if(type=='myGuaranteeStatus'){
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
                        this.setState({
                            homeInfo,showAll
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
    onGoRouter=(type,obj,e)=>{
        let pathname='',query={};
        if(type=='myBorrow'){
            pathname=obj.type==0?'/pre/borrow_detail':
            obj.type==1?'/pre/iou_detail':
            obj.type==2?'/pre/iou_detail':
            '/pre/product_detail'   //ele.type==3
            query={id:obj.id||obj.loanId}
        }else if(type=='friendBorrow'){
            pathname=obj.type==0?'/pre/product_detail':
            obj.type==1?'/pre/iou_detail':
            obj.type==2?'/pre/iou_detail':
            '/pre/borrow_detail'   //ele.type==3
            query={id:obj.id||obj.loanId}
        }else if(type=='report'){
            //0   举报进度    1 催收进度
            pathname=obj.type==0?'/after/report_process':'/after/urge_process'
            query={id:obj.loanId}
        }else if(type=='guarantee'){
            //做担保
            pathname='pre/borrow_detail'
            query={id:obj.id}
        }

        this.props.history.push({
            pathname,
            query
        })
    }
    isLogin=(type)=>{
        if(this.props.homeStore.isLogin){//已登录
            if(type=='borrow'){
                //判断是否有正在求借款
                if(sessionStorage.getItem('pre_borrow_form_state')){
                    Modal.infoX('同一时间只能有一个求借款！')
                }else{
                    this.props.history.push({pathname:"/pre/borrow_form"})
                }
            }else{
                this.props.history.push({pathname:"/pre/product_list"})
            }
        }else{
            //未登录
            this.props.history.push({
                pathname: '/user/login'
            })
        }
    }
    gotoPagefaqs=()=>{
        this.props.history.push({
            pathname: '/user/faqs'
        })
    }
    gotoPage=(v)=>{
        if(this.props.homeStore.isLogin){//已登录
                this.props.history.push({
                    pathname: v
                })
        }else{
            //未登录
            this.props.history.push({
                pathname: '/user/login'
            })
        }
    }
    gotoPageFast=()=>{
        if(this.props.homeStore.isLogin){//已登录
            $.ajaxE( {
                type: 'GET',
                url: '/user/my/checkCredit',
                data: {
                }
            }).then((data) => {
                if(data.idCardStatus && data.passwordStatus){
                    this.props.history.push({
                        pathname: '/fast/form',
                        query:{
                            creditor:this.props.homeStore.switchIndex==2?1:0
                        }
                    });
                }else{
                    this.props.history.push({
                        pathname: '/fast/index',
                        query:{
                            creditor:this.props.homeStore.switchIndex==2?1:0
                        }
                    });
                }
            }).catch((msg) => {
            }); 
        }else{
            //未登录
            this.props.history.push({
                pathname: '/user/login'
            })
        }
    }
        
    gotoPageP=(pathname)=>{
        if(this.props.homeStore.isLogin){//已登录
            this.props.history.push({
                pathname
            })
        }else{
            //未登录
            this.props.history.push({
                pathname: '/user/login'
            })
        }
    }
	
    onOpenChange = (...args) => {
        console.log(args);
        this.setState({ open: !this.state.open });
    }
   
    render () {
        let { switchIndex, homeInfo } = this.props.homeStore, //homeInfo  首页展示数据
            { notices, showAll, topIndex, productType, productIdList, rentSearchList } = this.state,
            { myBorrowStatus, friendBorrowStatus, myLendStatus, myGuaranteeStatus } = showAll,
            sidebar = getSideBar.call(this),
            listComponent=getListComponent.call(this);
        
        //新手攻略是否显示判断
        let isNewUser = homeInfo&&homeInfo.userInfo&&homeInfo.userInfo.newUserStatus===false?false:true;

        
        return (
            <Drawer
                className="view-home"
                style={{ minHeight: document.documentElement.clientHeight }}
                contentStyle={{ textAlign: 'center' }}
                sidebar={sidebar}
                open={this.state.open}
                onOpenChange={this.onOpenChange}
            >
                <div className='view-home-cont'>
                    <div className="head">
                        <Tap className="left" onTap={this.onOpenChange}>
                            <img src={'/imgs/home/home-user.svg'} />
                        </Tap>
                        <Tap onTap={()=>{this.setState({topIndex:1})}} className={topIndex==1?" tab active":"tab"} >钱</Tap>
                        <i className='line'/>
                        <Tap onTap={()=>{this.props.history.push('/jzd')}} className={topIndex==2?" tab active":"tab"}>物</Tap>
                        <Tap className="right" onTap={()=>{this.gotoPage('message')}}>
                            {this.state.homeMessageCount?<span className='msg-r'></span>:null}
                            <img src={'/imgs/home/home-msg.svg'} />
                        </Tap>                        
                        <img className='head-bg' src={'/imgs/home/gold.svg'} />

                        {notices.length?<div className='notice text-left'>
                            <p className='no-left'><span>速报</span></p>  
                            <Carousel className="my-carousel font12"
                                vertical
                                dots={false}
                                dragging={false}
                                swiping={false}
                                autoplay
                                infinite
                            >
                            {notices.map(type => {
                                return <div className="v-item" key={Math.random()}>{type}</div>
                            })}
                            </Carousel>
                        </div>:null}
                    </div>
                    <div className="home-content">
                        <div className='home-content-in'>                            
                            <div className="tabs">
                                <Tap onTap={()=>{this.onSwitch(1)}} className={switchIndex==1?"tab active mainC1":"tab fontC3"}>借款</Tap>
                                <Tap onTap={()=>{this.onSwitch(2)}} className={switchIndex==2?"tab active mainC1":"tab fontC3"}>出借</Tap>
                                <Tap onTap={()=>{this.onSwitch(3)}} className={switchIndex==3?"tab active mainC1":"tab fontC3"}>担保</Tap>
                            </div>

                            {this.props.homeStore.isLogin?<div className='top'>
                                <div className='left'>
                                    <p className='name num-font font16 mainC2'>{this.state.isUserExist?`Hi，琚城`: '136****3562'}</p>
                                    <p className='credit font12'>
                                        立即认证
                                        <img src='/imgs/home/arrow-r.svg' />
                                    </p>
                                </div>
                                {switchIndex==1?
                                    <Flex justify='between' className='h-money'>
                                        <Tap onTap={() => { this.gotoPageP('/wallet') }}>
                                            <Flex.Item>
                                                <p className='font12 mainC1'><span className='num-font font16'>0</span>元</p>
                                                <p className='text-left font12 fontC1'>余额</p>
                                            </Flex.Item>
                                        </Tap>
                                        <Tap onTap={() => { this.gotoPageP('/after/my_loaner') }}>
                                            <Flex.Item>
                                                <p className='font12 mainC1'><span className='num-font font16'>0</span>人</p>
                                                <p className='font12 fontC1'>好友</p>
                                            </Flex.Item>
                                        </Tap>
                                        <Tap onTap={() => { this.gotoPageP('/after/repay_list') }}>
                                            <Flex.Item>
                                                <p className='font12 mainC1'><span className='num-font font16'>0</span>元</p>
                                                <p className='text-right font12 fontC1'>待还</p>
                                            </Flex.Item>
                                        </Tap>
                                    </Flex>
                                :null}
                                
                                {switchIndex==2?
                                    <Flex justify='between' className='h-money' >
                                        <Tap onTap={() => { this.gotoPageP('/wallet') }}>
                                            <Flex.Item>
                                                <p className='font12 mainC1'><span className='num-font font16'>0</span>元</p>
                                                <p className='text-left font12 fontC1'>余额</p>
                                            </Flex.Item>
                                        </Tap>
                                        <Tap onTap={() => { this.gotoPageP('/after/my_borrower') }}>
                                            <Flex.Item>
                                                <p className='font12 mainC1'><span className='num-font font16'>0</span>人</p>
                                                <p className='font12 fontC1'>好友</p>
                                            </Flex.Item>
                                        </Tap>
                                        <Tap onTap={() => { this.gotoPageP('/after/receive_list') }}>
                                            <Flex.Item>
                                                <p className='font12 mainC1'><span className='num-font font16'>0</span>元</p>
                                                <p className='text-right font12 fontC1'>待收</p>
                                            </Flex.Item>
                                        </Tap>
                                    </Flex>
                                :null}
                                
                                {switchIndex==3?
                                    <Flex justify='between' className='h-money' style={{marginBottom:0,borderBottom:0,paddingBottom:'5px'}}>
                                        <Tap onTap={() => { this.gotoPageP('/wallet') }}>
                                            <Flex.Item>
                                                <p className='font12 mainC1'><span className='num-font font16'>0</span>元</p>
                                                <p className='text-left font12 fontC1'>余额</p>
                                            </Flex.Item>
                                        </Tap>
                                        <Tap onTap={() => { this.gotoPageP('/after/my_guarantee') }}>
                                            <Flex.Item>
                                                <p className='font12 mainC1'><span className='num-font font16'>0</span>人</p>
                                                <p className='font12 fontC1'>好友</p>
                                            </Flex.Item>
                                        </Tap>
                                        <Tap onTap={() => { this.gotoPageP('/after/repay_list') }}>
                                            <Flex.Item>
                                                <p className='font12 mainC1'><span className='num-font font16'>0</span>元</p>
                                                <p className='text-right font12 fontC1'>待还</p>
                                            </Flex.Item>
                                        </Tap>
                                    </Flex>
                                :null}

                                {switchIndex==1?<span>                        
                                    <div className='jc-bottom'>
                                        <Tap className='com-btn-border--big' onTap={()=>{this.onShowIOU('quickly',true,0)}}>
                                            补借条
                                        </Tap>
                                        <Tap className='com-btn-solid--big' onTap={()=>{this.isLogin('borrow')}}>
                                                求借款
                                        </Tap>
                                    </div>
                                </span>:null}
                                {switchIndex==2?<span>                     
                                    <div className='jc-bottom'>
                                        <Tap className='com-btn-border--big' onTap={()=>{this.onShowIOU('quickly',true,1)}}>
                                            补借条
                                        </Tap>
                                        <Tap className='com-btn-solid--big' onTap={()=>{this.isLogin('lend')}}>
                                            去出借
                                        </Tap>
                                    </div>
                                </span>:null}

                            </div>:<div className='top'>
                                {switchIndex==1?                                    
                                    <div className='left'>
                                        <p className='des font16 mainC2'>我要借钱</p>
                                        <p className='bottom font12 fontC3'>最高可借额度(元)<span className='mainC1'><strong className='num-font font32'>200,000</strong></span></p>
                                    </div>
                                :null}                                
                                {switchIndex==2?                                 
                                    <div className='left'>
                                        <p className='des font16 mainC2'>我要出借</p>
                                        <p className='bottom font12 fontC3'>极速出借仅需<span className='mainC1'><strong className='num-font font32'>3</strong>分钟</span></p>
                                    </div>
                                :null}                                
                                {switchIndex==3?                         
                                    <div className='left'>
                                        <p className='des font16 mainC2'>帮朋友做担保</p>
                                        <p className='bottom font12 fontC3'>最高担保收益<span className='mainC1'><strong className='num-font font32'>10</strong>%</span></p>
                                    </div>
                                :null}

                                {switchIndex==1?
                                    <div className='jc-bottom'>
                                        <Tap onTap={()=>{this.onShowIOU('quickly',true,0)}}>
                                            补借条
                                        </Tap>
                                        <Tap onTap={()=>{this.isLogin('borrow')}}>
                                            求借款
                                        </Tap>
                                    </div>:null}
                                {switchIndex==2?                     
                                    <div className='jc-bottom'>
                                        <Tap onTap={()=>{this.onShowIOU('quickly',true,1)}}>
                                            补借条
                                        </Tap>
                                        <Tap onTap={()=>{this.isLogin('lend')}}>
                                            去出借
                                        </Tap>
                                    </div>:null}
                                {switchIndex==3?                     
                                    <div className='jc-bottom danbao'>
                                        <Tap onTap={()=>{this.onShowIOU('quickly',true,1)}}>
                                            立即担保
                                        </Tap>
                                    </div>:null}
                            </div>}
                        </div>

                        <div className='b-image'>
                            <Tap onTap={()=>{this.gotoPageFast()}}>
                                <img src={'/imgs/home/banner.png'} />
                            </Tap>
                        </div>
                    </div>
                        
                    {listComponent}                  

                    <div className='home-help'>
                        {isNewUser?
                            <div className='help-content'>
                                <h3 className='title com-title-left'>新手攻略</h3>
                                <div className='card'>
                                    <h4 className='font14 fontC3 text-left'>
                                        仅需三步&nbsp;&nbsp;轻松借钱
                                        <Tap className='com-btn-border float-right' onTap={()=>{this.gotoPage('credit')}}>立即认证</Tap>
                                    </h4>
                                    <Flex className='h-box' justify='around'>
                                        <div className='item'>
                                            <Flex className='img' justify='center' align='center'><img src={'/imgs/home/1.png'} /></Flex>
                                            <span>注册</span>
                                        </div>
                                        <div className='line'></div>
                                        <div className='item'>
                                            <Flex className='img' justify='center' align='center'><img src={'/imgs/home/2.png'} /></Flex>
                                            <span>信用认证</span>
                                        </div>
                                        <div className='line'></div>
                                        <div className='item'>
                                            <Flex className='img' justify='center' align='center'><img src={'/imgs/home/3.png'} /></Flex>
                                            {switchIndex==1?<span>借钱</span>:
                                            switchIndex==2?<span>出借</span>:
                                            switchIndex==3?<span>担保</span>:null}
                                            
                                        </div>
                                    </Flex>
                                    <div className='h-bottom text-right'>
                                        {switchIndex==1?<Link to="/strategy/borrow_ious">详细攻略</Link>:
                                        switchIndex==2?<Link to="/strategy/lend_ious">详细攻略</Link>:
                                        switchIndex==3?<Link to="/strategy/borrow_ious">详细攻略</Link>:null}
                                        <img src='/imgs/home/arrow-r.svg'/>
                                    </div>
                                </div>
                            </div>
                        :null}
                        <Tap className='right' onTap={()=>{this.gotoPagefaqs()}}>
                            <h3 className='title com-title-left'>常见问题</h3>
                            <Flex className='help-item'>
                                <Flex.Item className='middle'>
                                    <p className='top mainC2 font14'>
                                        1分钟解决
                                    </p>
                                    <p className='bottomin font12 fontC3'>
                                        热门问题，快速掌握
                                    </p>
                                </Flex.Item>
                                <span className='right font12 fontC4'>
                                    去看看
                                    <img src={'/imgs/home/arrow-r.svg'} /> 
                                </span>
                            </Flex>
                        </Tap>
                    </div>
                    <div className='bootom-des'>
                        <ul>
                            <li>
                                <img src={'/imgs/home/bottom1.svg'} />
                                <p>稳定运行</p>
                            </li>
                            <li>
                                <img src={'/imgs/home/bottom2.svg'} />
                                <p>电子签章</p>
                            </li>
                            <li>
                                <img src={'/imgs/home/bottom3.svg'} />
                                <p>信用报告</p>
                            </li>
                            <li>
                                <img src={'/imgs/home/bottom4.svg'} />
                                <p>逾期同步</p>
                            </li>
                        </ul>
                    </div>
                    <div className='bottom-tip-p'>
                        <p className='bottom-tip'>借贷有风险&nbsp;&nbsp;出借需谨慎</p>
                    </div>

                    <Modal
                        popup
                        onClose={()=>{this.onShowIOU('quickly',false)}}
                        visible={this.state.quickly}
                        animationType="slide-up">
                        <div className='home-quickly-borrow'>
                            
                            <Link to={"/pre/iou_form?creditor="+this.state.creditor}  className='left'>
                                <img src={'/imgs/home/bjt.svg'} />
                                <p>补借条</p>
                                <span>需认证助风控</span>
                            </Link>
                            <Tap onTap={()=>{this.gotoPageFast()}} className='right'>
                                <img src={'/imgs/home/jsjt.svg'} />
                                <p>极速借条</p>
                                <span>免认证更快捷</span>
                            </Tap>
                            <Tap onTap={()=>{this.onShowIOU('quickly',false)}} className='j-bottom'>
                                <img src={'/imgs/home/gb.svg'} />
                            </Tap>         
                        </div>
                    </Modal>
                </div>
            </Drawer>
        )
    }
}
