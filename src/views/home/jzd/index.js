//主页
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tap } from 'COMPONENT'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Drawer, Carousel, WingBlank, Flex , SearchBar, PullToRefresh, List} from 'antd-mobile';
import { Modal, Loading } from 'SERVICE/popup'

@withRouter
@inject('homeStore')
@observer
export default class page extends Component {
	
	constructor (props, context) {
        super(props, context)

        this.state = {
            open: false,
            isLogin: props.isLogin,
            switchIndex: props.homeStore.switchIndex,//1借款2出借3担保
            topIndex: 1,//1钱   2物
            notices: [],//广播列表 excitationList
            // borrowInfo: null,//借钱
            // lenderInfo: null,//出借
            // guaranteeInfo: null,//担保
            homeInfo: null,//全部数据
            //展开收起状态
            showAll: {
                myBorrowStatus: false,
                friendProductList: false,
                myLendStatus: false,
                myGuaranteeStatus: false,
            },
            //借物
            productType: null,//借物，商品类别
            productIdList: [],//已获取到物列表的ID，用于分页
            refreshing: false,//刷新中   物标签下拉加载更多状态
            messageCount: 0,//待处理订单数
        };
        //this.onOpenChange = onOpenChange.bind(this)
    }
    componentDidUpdate(){
        if(this.props.userInfo&&(!this.state.homeInfo||!this.state.homeInfo.userInfo)){
            let { homeInfo } = this.state;
            if(!homeInfo)homeInfo={}
            homeInfo.userInfo = this.props.userInfo            
            this.setState({
                homeInfo,
                isLogin:this.props.isLogin
            },()=>{
                if(sessionStorage.getItem('first_home_login')){
                    //不是第一次进入   记录
                    this.onSwitch(this.props.homeStore.switchIndex)
                }else{
                    //第一次登录进入   后台判断
                    this.onSwitch(homeInfo.userInfo.identity)
                    sessionStorage.setItem('first_home_login',true)
                }
            })
        }   
    }
    componentDidMount(){
        if($.isUserExist()){  
            //如果已登录，获取信息 
            //获取消息数据
            $.ajaxE({
                type: 'GET',
                url: '/user/wx/getMessage',
                data:{type:0,page:0,rows:10}
            }).then((data)=>{
                this.setState({
                    homeMessageCount: data.unsee_cnt1||data.unsee_cnt2||data.unsee_cnt3||data.unsee_cnt4||data.unsee_cnt5
                })
            }).catch((msg)=>{
                console.error(msg);
            })
            if(sessionStorage.getItem('app_str')){
                let switchIndex=JSON.parse(sessionStorage.getItem('app_str'));
                this.onSwitch(switchIndex);
            }
            
            //更新userInfo信息
           //this.sessionUserInfo()
        }
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
    //更新userInfo信息
		sessionUserInfo=()=>{
			$.ajaxE({
	            type: 'GET',
	            url: '/user/info/getUserInfo',
	            data:{}
	        }).then((data)=>{
	            sessionStorage.setItem('userInfo',JSON.stringify(data));
	        }).catch((msg)=>{   
	            console.error(msg);
	        })
		}
		
		/*借物-商品详情[无需登录校验]*/
    onOpenGoodsDetail = product_id => {
    	if ($.isUserExist()) {
				window.sessionStorage.userId = $.getUserInfo() && $.getUserInfo().userId;
//  			var token = $.getUserInfo().token;
    	} 
			window.location.href = jjdConf.leaseUrl + '/html/prod/prodDetail.html?id=' + product_id;
    }
    /*借物-购物车[需登录校验]*/
    toShoppingCart = () => {
	    if ($.isUserExist()) {
	        /*已登录，跳转购物车*/
	       	window.sessionStorage.userId = $.getUserInfo() && $.getUserInfo().userId;
//	       	var token = $.getUserInfo().token;
	        window.location.href = jjdConf.leaseUrl + '/html/shop/shoppingCart.html';
	    } else {
	        /*未登录，跳转登录*/
	        this.props.history.push({
	            pathname: '/user/wy_valid/0'
	        })
    	}
    }
    /*借物搜索[根据商品名称模糊查询][无需登录校验]*/
    onSearch = (v) => {
        if (v.length) {
        		if ($.isUserExist()) {
        			/*如果已登录,则将userId传递到借物*/
							window.sessionStorage.userId = $.getUserInfo() && $.getUserInfo().userId;
//							var token = $.getUserInfo()&&$.getUserInfo().token;
        		} 
        		window.location.href = jjdConf.leaseUrl + '/html/my/search_rent.html?n_source=index&search_name=' + v;
        } else {
            this.setState({
                searchWord:null,
                searchList:{}
            })
        }
    }
    /*借物-加入我们[无需登录校验]*/
    toJoinUs = () => {
    	window.location.href = jjdConf.leaseUrl + '/html/prod/shopEnter.html';
    }
    /*借物-叨叨[需登录校验]*/
    toChat = () => {
	    if ($.isUserExist()) {
	        /*已登录，跳转叨叨*/
	       	window.sessionStorage.userId = $.getUserInfo() && $.getUserInfo().userId;
//	       	var token = $.getUserInfo()&&$.getUserInfo().token;
	        window.location.href = jjdConf.leaseUrl + '/html/prod/messageList.html';
	    } else {
	        /*未登录，跳转登录*/
	        this.props.history.push({
	            pathname: '/user/wy_valid/0'
	        })
    	}
    }
    /*借物-待处理订单[需登录校验]*/
   	toOrderHavedHandle = () => {
	    if ($.isUserExist()) {
	        /*已登录，跳转待处理订单*/
	       	window.sessionStorage.userId = $.getUserInfo() && $.getUserInfo().userId;
//	       	var token = $.getUserInfo().token;
	        window.location.href = jjdConf.leaseUrl + '/html/order/my-order.html?state=0';
	    } else {
	        /*未登录，跳转登录*/
	        this.props.history.push({
	            pathname: '/user/wy_valid/0'
	        })
    	}
		}
   	/*借物-新手攻略[无需登录校验]*/
   	toLeaseIntro = () => {
   		window.location.href = jjdConf.leaseUrl + '/html/operateActivity/newHands.html';
   	}

    onOpenChange=()=>{
        let {home,doDrawer} = this.props;
        doDrawer(!home.drawer);
    }
    onSwitch=e=>{
        let _this = this;
        let { doSwitchIndex } = this.props.homeStore;
        doSwitchIndex(e);
        if(!this.state.isLogin){
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
                    let { homeInfo } = _this.state;
                    if(!homeInfo)homeInfo = {}
                    homeInfo.borrowDynamic = data.borrowDynamic; 
                    homeInfo.borrowInfo = data.borrowInfo;
                
                    //判断是否有求借款，求借款只能有一个
                    if(data.borrowInfo.bidStatus){//有求借款
                        sessionStorage.setItem('pre_borrow_form_state',1)
                    }else{//没有求借款
                        sessionStorage.removeItem('pre_borrow_form_state')
                    }

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
        }else if(e==2){
            //出借信息
            $.ajaxE({
                type: 'GET',
                url: '/user/info/getHomepageInfo',
                data:{
                    identity:2
                }
              }).then((data)=>{
                    let { homeInfo } = _this.state;
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
                let { homeInfo } = _this.state;
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
        if(this.state.isLogin){
            this.setState({
                [key]: value,
                creditor: param
            })
        }else{
            this.props.history.push({
                pathname: '/user/wy_valid/0'
            })
        }
    }
    onShowAll(type){
        let { home } = this.props,
            { homeInfo, showAll } = this.state;
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
        if(this.state.isLogin){//已登录
            if(type=='borrow'){
                //判断是否有正在求借款
                if(sessionStorage.getItem('pre_borrow_form_state')){
                    Modal.infoX('同一时间只能有一个求借款！')
                }else{
                    this.props.history.push({pathname:"/pre/borrow_form"})
                }
            }else{
                this.props.history.push({pathname:"/pre/loan_mine"})
            }
        }else{
            //未登录
            this.props.history.push({
                pathname: '/user/wy_valid/0'
            })
        }
    }
    gotoPagefaqs=()=>{
        this.props.history.push({
            pathname: '/user/faqs'
        })
    }
    gotoPage=(v)=>{
        if(this.state.isLogin){//已登录
            if(v=='message'){
                this.props.history.push({
                    pathname: '/message'
                })
            }
            if(v=="credit"){
                this.props.history.push({
                    pathname: '/credit'
                })
            }
        }else{
            //未登录
            this.props.history.push({
                pathname: '/user/wy_valid/0'
            })
        }
    }
    gotoPageFast=()=>{
        if(this.state.isLogin){//已登录
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
                pathname: '/user/wy_valid/0'
            })
        }
    }
        
    gotoPageP=(pathname)=>{
        if(this.state.isLogin){//已登录
            this.props.history.push({
                pathname
            })
        }else{
            //未登录
            this.props.history.push({
                pathname: '/user/wy_valid/0'
            })
        }
    }
    onGetMore=(show,id)=>{
        Loading.show();
        let {productIdList,productType} = this.state;
        if(show){//表示不是加载更多
            productIdList = []
        }
        
        //选中当前类型
        if(typeof id == 'number'||id===''){
            productType.forEach(item=>{
                if(item.id == id){
                    item.active = true
                }else{
                    item.active = false
                }
            })
        }

        $.ajaxE({
            urlType: 'jiewu',
            type: 'POST',
            url: '/homepage/listRentSearch',
            data:{limit: 16,productIdList,prod_type_id:id?id:null}
        }).then((data)=>{
            let rentSearchList = this.state.rentSearchList||[],_list = [];
            rentSearchList = data.object.rentSearch.rentSearchList;
            rentSearchList.forEach(ele=>{
                _list.push(ele.product_id)
            })
            this.setState({
                rentSearchList,
                productIdList: _list,
                refreshing: false
            },()=>{
                Loading.hide()
            })
        }).catch((msg)=>{
            Modal.infoX(msg);
        })
    }
    onJieWu(){
        this.setState({topIndex:2})
        this.onGetMore(true)
        if(!this.state.productType){
            //查询商品类别
            $.ajaxE({
                urlType: 'jiewu',
                type: 'GET',
                url: '/prod/getAllOneLevelProdType',
              }).then((data)=>{
                data.object.list.unshift({
                    "type_name": "全部",
                    "id": '',
                    "type_order": '',
                    active: true
                })
                this.setState({
                    productType: data.object.list
                })
              }).catch((msg)=>{
                console.error(msg);
            })
        }

        //获取首页订单消息列表
        $.ajaxE({
            urlType: 'jiewu',
            type: 'GET',
            url: '/homepage/listMessageInfo',
            data: {userId: $.getUserInfo()&&$.getUserInfo().userId},
          }).then((data)=>{
            this.setState({
                messageCount: data.object.messageCount
            })
          }).catch((msg)=>{
            console.error(msg);
        })
        //获取用户未读消息数量
        $.ajaxE({
            urlType: 'jiewu',
            type: 'GET',
            url: '/im/getImUnReadCnt',
            data: {userId: $.getUserInfo()&&$.getUserInfo().userId},
          }).then((data)=>{
            this.setState({
                daodao: data.object.cnt
            })
          }).catch((msg)=>{
            console.error(msg);
        })
    }
    
	
	onTapp=()=>{
		this.props.history.push('/about')
	}

    onOpenChange = (...args) => {
        console.log(args);
        this.setState({ open: !this.state.open });
    }
    getSideBar = () => {
        const sidebar = (
            <List>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i, index) => {
                if (index === 0) {
                    return (<List.Item key={index}
                    thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
                    multipleLine
                    >Category</List.Item>);
                }
                return (<List.Item key={index}
                    thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
                >Category{index}</List.Item>);
                })}
            </List>
        )
        return sidebar
    }
    getListComponent = ()=>{
        let { homeStore } = this.props, //homeInfo  首页展示数据
            { notices, homeInfo, showAll, topIndex, productType, productIdList, rentSearchList } = this.state,
            { myBorrowStatus, friendBorrowStatus, myLendStatus, myGuaranteeStatus } = showAll,
            switchIndex = homeStore.switchIndex;

        let result = null;
        if(topIndex==1&&switchIndex==1&&homeInfo&&homeInfo.borrowDynamic){
            result=<div>{homeInfo.borrowDynamic.borrowListCount?
                <div className='list-box'>
                        <h3>我的借款</h3>
                    {homeInfo.borrowDynamic.borrowList.map((ele,index)=>{
                    if(!myBorrowStatus&&index>4)return;
                    return <div className='list-card' key={Math.random()}>
                            <Tap onTap={(e)=>{this.onGoRouter('myBorrow',ele,e)}}>
                                <div className='header'>
                                    {ele.type==0?'我发起了求借款':null}
                                    {ele.type==1?`我发给${ele.name}的补借条`:null}
                                    {ele.type==2?`${ele.name}发给我的补借条`:null}
                                    {ele.type==3?`我向${ele.name}申请借款`:null}
                                    <span className='extra'>
                                        {ele.leftOverDays<0?'失效':
                                        ele.leftOverDays==0?'不到一天':
                                        '剩余'+ele.leftOverDays+'天'}
                                    </span>
                                </div>
                                {ele.type==0?<Flex className='body'  justify='between'>
                                    <Flex.Item>
                                        <p><span className='num-font'>{$.toYuan(ele.amount)}</span>元</p>
                                        <p>金额</p>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <p><span className='num-font'>{$.toYuan(ele.leftOverAmount)}</span>元</p>
                                        <p>还差</p>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <p><span className='num-font'>{(ele.getAmount/ele.amount*100).toFixed()}</span>%</p>
                                        <p>完成度</p>
                                    </Flex.Item>
                                </Flex>:<Flex className='body'  justify='between'>
                                    <Flex.Item>
                                        <p><span className='num-font'>{$.toYuan(ele.amount)}</span>元</p>
                                        <p>金额</p>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <p><span className='num-font'>{ele.borrowDays}</span>天</p>
                                        <p>时长</p>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <p><span className='num-font'>{ele.interestRate}</span>%</p>
                                        <p>年利率</p>
                                    </Flex.Item>
                                </Flex>}
                                <div className='footer'>
                                    {ele.type==0?<span>邀请出借人</span>:null}
                                    {ele.type==1&&ele.loanType==1&&ele.paid==0?<span>去支付</span>:
                                    ele.type==1?<span>提醒他确认</span>:null}
                                    {ele.type==2?<span>马上确认</span>:null}
                                    {ele.type==3?<span>查看详情</span>:null}
                                </div>
                            </Tap>
                        </div>
                })}
                    {!myBorrowStatus&&homeInfo.borrowDynamic.borrowListCount>5?
                        <Tap onTap={()=>{this.onShowAll('myBorrowStatus')}}><p className='h-show-more'>查看全部{homeInfo.borrowDynamic.borrowListCount}个借款<img src={'/imgs/home/arrow.svg'} /></p></Tap>
                    :null}
                    {myBorrowStatus&&homeInfo.borrowDynamic.borrowListCount>5?
                        <Tap onTap={()=>{this.onShowAll('myBorrowStatus')}}><p className='h-show-more'>收起<img style={{transform: 'rotate(270deg)'}} src={'/imgs/home/arrow.svg'} /></p></Tap>
                    :null}
                </div>
            :null}

            {homeInfo&&homeInfo.borrowDynamic.friendProductListCount?
                <div className='list-box'>
                        <h3>好友在出借</h3>
                    {homeInfo.borrowDynamic.friendProductList.map((ele,index)=>{
                    if(!friendBorrowStatus&&index>4)return;
                    return <div className='list-card chujie' key={Math.random()}>
                            <Tap onTap={()=>{this.props.history.push({pathname:'/pre/loan_detail',query:{id:ele.productId}})}}>
                                <div className='header'>
                                    {ele.lenderName+'在出借'}
                                    <span className='extra'>{ele.applyCount||ele.applyCount==0?ele.applyCount:ele.applyCnt}人申请</span>
                                </div>
                                <Flex className='body'  justify='between'>
                                    <Flex.Item>
                                        <p><span className='num-font'>{$.toYuan(ele.minAmount)}-{$.toYuan(ele.maxAmount)}</span>元</p>
                                        {ele.repayType==0?<p>借款时长{ele.minTime+minTimeUnits[ele.minTimeUnit]}-{ele.maxTime+minTimeUnits[ele.maxTimeUnit||ele.maxTimeUnit]}&nbsp;&nbsp;&nbsp;&nbsp;年利率{ele.interestRate}%</p>:
                                        <p>分期次数&nbsp;&nbsp;{ele.minTime}期-{ele.maxTime}期&nbsp;&nbsp;&nbsp;&nbsp;年利率{ele.interestRate}%</p>}
                                    </Flex.Item>
                                </Flex>
                                <div className='footer'>
                                    <span>马上申请</span>
                                </div>
                            </Tap>
                        </div>
                        })}
                        {!friendBorrowStatus&&homeInfo.borrowDynamic.friendProductListCount>5?<Tap onTap={()=>{this.onShowAll('friendBorrowStatus')}}>
                            <p className='h-show-more'>展开所有<img src={'/imgs/home/arrow.svg'} /></p>
                        </Tap>:null}
                        {friendBorrowStatus&&homeInfo.borrowDynamic.friendProductListCount>5?<Tap onTap={()=>{this.onShowAll('friendBorrowStatus')}}>
                            <p className='h-show-more'>收起<img style={{transform: 'rotate(270deg)'}} src={'/imgs/home/arrow.svg'} /></p>
                        </Tap>:null}
                </div>
            :null}

            {homeInfo&&homeInfo.borrowDynamic.amongLoanListCount?
                <div className='list-box'>
                    <h3>贷中贷后动态</h3>
                    {homeInfo.borrowDynamic.amongLoanList.map((ele,index)=>{
                    if(index>4)return;
                    return  <span key={Math.random()}>{ele.type==0?<Tap onTap={()=>{this.props.history.push({pathname:'/after/borrow_detail',query:{id:ele.loanId}})}}>
                                <div className='list-card'>
                                    <div className='header'>
                                        {`${ele.name}发起展期`}
                                        <span className='extra'>
                                            {ele.leftOverDays<0?'失效':
                                            ele.leftOverDays==0?'不到一小时':
                                            '剩余'+ele.leftOverDays+'小时'}
                                        </span>
                                    </div>
                                    <div className='footer-body'>
                                        <span className='num-font'>{$.toYuan(ele.amount)}元</span>
                                        <span className='s-btn'>马上处理</span>
                                    </div>
                                </div>
                            </Tap>:<Tap onTap={()=>{this.props.history.push({pathname:'/after/borrow_detail',query:{id:ele.loanId}})}}>
                                <div className='list-card'>
                                    <div className='header'>
                                        {`${ele.name}发起销账`}
                                        <span className='extra'>
                                            {ele.leftOverDays<0?'失效':
                                            ele.leftOverDays==0?'不到一天':
                                            '剩余'+ele.leftOverDays+'天'}
                                        </span>
                                    </div>
                                    <div className='footer-body'>
                                        <span className='num-font'>{$.toYuan(ele.amount)}元</span>
                                        <span className='s-btn'>马上处理</span>
                                    </div>
                                </div>
                            </Tap>}</span>
                        }
                )}
                </div>
            :null}</div>
        }else if(topIndex==1&&switchIndex==2&&homeInfo&&homeInfo.lendDynamic){
            result=<div>{homeInfo.lendDynamic.borrowListCount?
                <div className='list-box'>
                    <h3>好友在借款</h3>
                    {homeInfo.lendDynamic. borrowList.map((ele,index)=>{
                    if(!myLendStatus&&index>4)return;
                    return <div className='list-card' key={Math.random()}>
                            <Tap onTap={()=>{this.onGoRouter('friendBorrow',ele)}}>
                            <div className='header'>
                                {ele.type==0?`${ele.name}申请借款`:null}
                                {ele.type==1?`我发给${ele.name}的补借条`:null}
                                {ele.type==2?`${ele.name}发给我的补借条`:null}
                                {ele.type==3?`${ele.name}正在请求借款`:null}
                                <span className='extra'>
                                    {ele.leftOverDays<0?'失效':
                                    ele.leftOverDays==0?'不到一天':
                                    '剩余'+ele.leftOverDays+'天'}
                                </span>
                            </div>
                            <Flex className='body'  justify='between'>
                                <Flex.Item>
                                    <p><span className='num-font'>{$.toYuan(ele.amount)}</span>元</p>
                                    <p>金额</p>
                                </Flex.Item>
                                <Flex.Item>
                                    <p><span className='num-font'>{ele.borrowDays}</span>天</p>
                                    <p>时长</p>
                                </Flex.Item>
                                <Flex.Item>
                                    <p><span className='num-font'>{ele.interestRate}</span>%</p>
                                    <p>年利率</p>
                                </Flex.Item>
                            </Flex>
                            <div className='footer'>
                                {ele.type==0?<span>马上审核</span>:null}
                                {ele.type==1?<span>提醒他确认</span>:null}
                                {ele.type==2?<span>马上确认</span>:null}
                                {ele.type==3?<span>借给他</span>:null}
                            </div>
                            </Tap>
                        </div>
                    })}
                    {!myLendStatus&&homeInfo.lendDynamic.borrowListCount>5?<Tap onTap={()=>{this.onShowAll('myLendStatus')}}>                    
                        <p className='h-show-more'>查看全部{homeInfo.lendDynamic.borrowListCount}个借款<img src={'/imgs/home/arrow.svg'} /></p>
                    </Tap>:null}
                    {myLendStatus&&homeInfo.lendDynamic.borrowListCount>5?<Tap onTap={()=>{this.onShowAll('myLendStatus')}}>                    
                        <p className='h-show-more'>收起<img style={{transform: 'rotate(270deg)'}} src={'/imgs/home/arrow.svg'} /></p>
                    </Tap>:null}
                </div>
            :null}

            {homeInfo.lendDynamic.amongLoanListCount?
                <div className='list-box'>
                    <h3>贷中贷后动态</h3>
                    {homeInfo.lendDynamic.amongLoanList.map((ele,index)=>{
                    //if(index>4)return;
                    return <div className='list-card' key={Math.random()}>
                        <Tap onTap={()=>{this.onGoRouter('report',ele)}}>
                            <div className='header'>
                                {ele.type==0?`${ele.name}举报了你`:null}
                                {ele.type==1?`${ele.name}的催记状态更新了`:null}
                                <span className='extra'>剩余{ele.leftOverDays}天</span>
                            </div>
                            <Flex className='body body-one'  justify='between'>
                                <Flex.Item>
                                    <p>举报原因&nbsp;&nbsp;&nbsp;&nbsp;
                                    {ele.reportReasonStatus==1?'不确认收款':''}
                                    {ele.reportReasonStatus==2?'完全没出借':''}
                                    {ele.reportReasonStatus==3?'部分出借':''}
                                    </p>
                                </Flex.Item>
                            </Flex>
                            <div className='footer'>
                                {ele.type==0?<span>马上反馈</span>:null}
                                {ele.type==1?<span>马上查看</span>:null}
                            </div>
                        </Tap>
                        </div>
                    })}
                </div>
            :null}</div>
        }else if(topIndex==1&&switchIndex==3&&homeInfo&&homeInfo.guaranteeDynamic){
            result=<div>{homeInfo.guaranteeDynamic.borrowListCount?
            <div className='list-box'>
                <h3>好友在借款</h3>
                {homeInfo.guaranteeDynamic.borrowList.map((ele,index)=>{
                if(!myGuaranteeStatus&&index>4)return;
                    return <div className='list-card' key={Math.random()}>
                            <Tap onTap={()=>{this.onGoRouter('guarantee',ele)}}>
                            <div className='header'>
                                {ele.name}
                                <span className='extra'>
                                    {ele.leftOverDays<0?'失效':
                                    ele.leftOverDays==0?'不到一天':
                                    '剩余'+ele.leftOverDays+'天'}
                                </span>
                            </div>
                            <Flex className='body'  justify='between'>
                                <Flex.Item>
                                    <p><span className='num-font'>{$.toYuan(ele.amount)}</span>元</p>
                                    <p>金额</p>
                                </Flex.Item>
                                <Flex.Item>
                                    <p><span className='num-font'>{ele.borrowDays}</span>天</p>
                                    <p>时长</p>
                                </Flex.Item>
                                <Flex.Item>
                                    <p><span className='num-font'>{ele.interestRate}</span>%</p>
                                    <p>年利率</p>
                                </Flex.Item>
                            </Flex>
                            <div className='footer'>
                                <span>作担保</span>
                            </div>
                            </Tap>
                        </div>
                        })}
                        {!myGuaranteeStatus&&homeInfo.guaranteeDynamic.borrowListCount>5?<Tap onTap={()=>{this.onShowAll('myGuaranteeStatus')}}>            
                            <p className='h-show-more'>查看全部<img src={'/imgs/home/arrow.svg'} /></p>
                        </Tap>:null}
                        {myGuaranteeStatus&&homeInfo.guaranteeDynamic.borrowListCount>5?<Tap onTap={()=>{this.onShowAll('myGuaranteeStatus')}}>            
                            <p className='h-show-more'>收起<img style={{transform: 'rotate(270deg)'}} src={'/imgs/home/arrow.svg'} /></p>
                        </Tap>:null}
                </div>
            :null}</div>
        }

        return result;
    }
    render () {
        let { homeStore } = this.props, //homeInfo  首页展示数据
            { notices, homeInfo, showAll, topIndex, productType, productIdList, rentSearchList } = this.state,
            { myBorrowStatus, friendBorrowStatus, myLendStatus, myGuaranteeStatus } = showAll,
            switchIndex = homeStore.switchIndex,
            sidebar = this.getSideBar(),
            listComponent=this.getListComponent();
        
        //新手攻略是否显示判断
        let isNewUser = homeInfo&&homeInfo.userInfo&&homeInfo.userInfo.newUserStatus===false?false:true;

        
        return (
            <Drawer
                className="view-home-jzd"
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
                        <Tap onTap={()=>{this.onJieWu()}} className={topIndex==2?" tab active":"tab"}>物</Tap>
                        <Tap className="right" onTap={()=>{this.gotoPage('message')}}>
                            {this.state.homeMessageCount?<span className='msg-r'></span>:null}
                            <img src={'/imgs/home/home-msg.svg'} />
                        </Tap>
                    </div>
                    <div className='view-home-box'>
                        {topIndex==1?<div className='view-home-b-in'>
                            <div className='top-continue'>
                                {notices.length?<div className='notices'>
                                    <img className='left' src={'/imgs/home/notice.svg'} />                            
                                    <WingBlank>
                                        <Carousel className="my-carousel"
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
                                    </WingBlank>
                                </div>:null}
                            </div>  
                            <div className="home-content">

                                <div className="tabs">
                                    <Tap onTap={()=>{this.onSwitch(1)}} className={switchIndex==1?" tab active":"tab"}>借款</Tap>
                                    <Tap onTap={()=>{this.onSwitch(2)}} className={switchIndex==2?" tab active":"tab"}>出借</Tap>
                                    <Tap onTap={()=>{this.onSwitch(3)}} className={switchIndex==3?" tab active":"tab"}>担保</Tap>
                                </div>

                                <div className='home-content-in'>
                                    <div className='top'>
                                        <div className='left'>
                                            <p>{$.isUserExist()?`欢迎回来${$.getUserInfo().userName ? $.getUserInfo().userName : $.getUserInfo().telephone}` : <Link to="/user/wy_valid/0">立即登录</Link>}</p>
                                            <p>{homeInfo?`这是您使用今借到的第${homeInfo.userInfo&&homeInfo.userInfo.registerDays||1}天`:'来今借到，今天就借到'}</p>
                                        </div>
                                        <img className='right' src={'/imgs/home/top-bg.svg'} />



                                        {switchIndex==1&&homeInfo&&homeInfo.borrowInfo&&homeInfo.borrowInfo.loanUserCount?
                                            <Flex justify='between' className='h-money'>
                                                <Tap onTap={() => { this.gotoPageP('/wallet') }}>
                                                    <Flex.Item>
                                                        <p><span className='num-font'>{$.toYuan(homeInfo.borrowInfo.amount)||0}</span>元</p>
                                                        <p className='left-text'>余额</p>
                                                    </Flex.Item>
                                                </Tap>
                                                <Tap onTap={() => { this.gotoPageP('/after/my_loaner') }}>
                                                    <Flex.Item>
                                                        <p><span className='num-font'>{homeInfo.borrowInfo.loanUserCount||0}</span>人</p>
                                                        <p>借入</p>
                                                    </Flex.Item>
                                                </Tap>
                                                <Tap onTap={() => { this.gotoPageP('/after/repay_list') }}>
                                                    <Flex.Item>
                                                        <p><span className='num-font'>{$.toYuan(homeInfo.borrowInfo.loanUserAmount)||0}</span>元</p>
                                                        <p className='right-text'>待还</p>
                                                    </Flex.Item>
                                                </Tap>
                                            </Flex>
                                        :null}
                                        
                                        {switchIndex==2&&homeInfo&&homeInfo.lendInfo&&homeInfo.lendInfo.loanUserCount?
                                            <Flex justify='between' className='h-money' >
                                                <Tap onTap={() => { this.gotoPageP('/wallet') }}>
                                                    <Flex.Item>
                                                        <p><span className='num-font'>{$.toYuan(homeInfo.lendInfo.amount)||0}</span>元</p>
                                                        <p className='left-text'>余额</p>
                                                    </Flex.Item>
                                                </Tap>
                                                <Tap onTap={() => { this.gotoPageP('/after/my_borrower') }}>
                                                    <Flex.Item>
                                                        <p><span className='num-font'>{homeInfo.lendInfo.loanUserCount||0}</span>人</p>
                                                        <p>借出</p>
                                                    </Flex.Item>
                                                </Tap>
                                                <Tap onTap={() => { this.gotoPageP('/after/receive_list') }}>
                                                    <Flex.Item>
                                                        <p><span className='num-font'>{$.toYuan(homeInfo.lendInfo.loanUserAmount)||0}</span>元</p>
                                                        <p className='right-text'>待收</p>
                                                    </Flex.Item>
                                                </Tap>
                                            </Flex>
                                        :null}
                                        
                                        {switchIndex==3&&homeInfo&&homeInfo.guaranteeInfo&&homeInfo.guaranteeInfo.loanUserCount?
                                            <Flex justify='between' className='h-money' style={{marginBottom:0,borderBottom:0,paddingBottom:0}}>
                                                <Tap onTap={() => { this.gotoPageP('/wallet') }}>
                                                    <Flex.Item>
                                                        <p><span className='num-font'>{$.toYuan(homeInfo.guaranteeInfo.amount)||0}</span>元</p>
                                                        <p className='left-text'>余额</p>
                                                    </Flex.Item>
                                                </Tap>
                                                <Tap onTap={() => { this.gotoPageP('/after/my_guarantee') }}>
                                                    <Flex.Item>
                                                        <p><span className='num-font'>{homeInfo.guaranteeInfo.loanUserCount||0}</span>人</p>
                                                        <p>担保</p>
                                                    </Flex.Item>
                                                </Tap>
                                                <Tap onTap={() => { this.gotoPageP('/after/repay_list') }}>
                                                    <Flex.Item>
                                                        <p><span className='num-font'>{$.toYuan(homeInfo.guaranteeInfo.loanUserAmount)||0}</span>元</p>
                                                        <p className='right-text'>待还</p>
                                                    </Flex.Item>
                                                </Tap>
                                            </Flex>
                                        :null}



                                        {switchIndex==1?<span>                        
                                            <div className='jc-bottom'>
                                                <Tap onTap={()=>{this.onShowIOU('quickly',true,0)}}>
                                                    补借条
                                                </Tap>
                                                <Tap onTap={()=>{this.isLogin('borrow')}}>
                                                        求借款
                                                </Tap>
                                            </div>
                                        </span>:null}
                                        {switchIndex==2?<span>                     
                                            <div className='jc-bottom'>
                                                <Tap onTap={()=>{this.onShowIOU('quickly',true,1)}}>
                                                    补借条
                                                </Tap>
                                                <Tap onTap={()=>{this.isLogin('lend')}}>
                                                    去出借
                                                </Tap>
                                            </div>
                                        </span>:null}
                                    </div>

                                    <div className='b-image'>
                                        <Tap onTap={()=>{this.gotoPageFast()}}>
                                            <img src={'/imgs/home/banner.png'} />
                                        </Tap>
                                    </div>
                                </div>
                            </div>
                            

                            <div className='home-help'>
                                
                                {listComponent}

                                {isNewUser?<div className='help-title'>
                                    <h4>仅需三步&nbsp;&nbsp;轻松借钱</h4>
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
                                            <span>借钱</span>
                                        </div>
                                    </Flex>
                                </div>:null}
                                {isNewUser&&switchIndex==1?<Link to="/strategy/borrow_ious"><Flex justify='between' align='center' className='help-item'>
                                    <img className='left' src={'/imgs/home/left-strategy.svg'} />
                                    <Flex.Item className='middle'>
                                        <p className='top'>
                                            新手攻略<span>1分钟掌握</span>
                                        </p>
                                        <p className='bottomin'>
                                            <span className='num-font'>60</span>秒学会攻略，迅速到账
                                        </p>
                                    </Flex.Item>
                                    <span className='right' >
                                        去看看
                                        <img src={'/imgs/home/arrow.svg'} /> 
                                    </span>
                                </Flex></Link>:null}
                                {isNewUser&&switchIndex==2?<Link to="/strategy/lend_ious"><Flex justify='between' align='center' className='help-item'>
                                    <img className='left' src={'/imgs/home/left-strategy.svg'} />
                                    <Flex.Item className='middle'>
                                        <p className='top'>
                                            新手攻略<span>1分钟掌握</span>
                                        </p>
                                        <p className='bottomin'>
                                            <span className='num-font'>60</span>秒学会攻略，迅速到账
                                        </p>
                                    </Flex.Item>
                                    <span className='right' >
                                        去看看
                                        <img src={'/imgs/home/arrow.svg'} /> 
                                    </span>
                                </Flex></Link>:null}
                                <Tap className='right' onTap={()=>{this.gotoPage('credit')}}>
                                <Flex className='help-item'>
                                    <img className='left' src={'/imgs/home/left-report.svg'} />
                                    {homeInfo&&homeInfo.userInfo&&homeInfo.userInfo.creditStatus?       //是否完成信用认证                     
                                    <Flex.Item className='middle'>
                                        <p className='top'>
                                            信用认证<span>{`完成度${homeInfo.userInfo&&homeInfo.userInfo.creditCompleteDegree*100}%`}</span> 
                                        </p>
                                        <p className='bottomin'>
                                            {homeInfo.userInfo&&homeInfo.userInfo.creditLeftOverDays>0?
                                            `您的信用报告还有${homeInfo.userInfo&&homeInfo.userInfo.creditLeftOverDays}天到期`:
                                            homeInfo.userInfo&&homeInfo.userInfo.creditLeftOverDays==0?
                                            `您的信用报告今天到期`:
                                            '您的信用报告已过期'}
                                        </p>
                                    </Flex.Item>
                                    :<Flex.Item className='middle'>
                                        <p className='top'>
                                            信用认证<span>未认证</span> 
                                        </p>
                                        <p className='bottomin'>
                                            信用是一切行为的前提，马上开始吧
                                        </p>
                                    </Flex.Item>}
                                    <span className='right'>
                                        去看看
                                        <img src={'/imgs/home/arrow.svg'} /> 
                                    </span>
                                </Flex>
                                </Tap>
                                <Tap className='right' onTap={()=>{this.gotoPagefaqs()}}>
                                    <Flex className='help-item'>
                                        <img className='left' src={'/imgs/home/left-help.svg'} />
                                        <Flex.Item className='middle'>
                                            <p className='top'>
                                                常见问题<span>1分钟解决</span>
                                            </p>
                                            <p className='bottomin'>
                                                热门问题，快速掌握
                                            </p>
                                        </Flex.Item>
                                        <span className='right'>
                                            去看看
                                            <img src={'/imgs/home/arrow.svg'} /> 
                                        </span>
                                    </Flex>
                                </Tap>
                            </div>
                            <div className='bootom-des'>
                                <p>今借到-基于大数据的信用租借服务平台   </p>
                                <ul>
                                    <li>
                                        <img src={'/imgs/home/bottom-wending.svg'} />
                                        <p>稳定运行</p>
                                    </li>
                                    <li>
                                        <img src={'/imgs/home/bottom-seal.svg'} />
                                        <p>电子签章</p>
                                    </li>
                                    <li>
                                        <img src={'/imgs/home/bottom-report.svg'} />
                                        <p>信用报告</p>
                                    </li>
                                    <li>
                                        <img src={'/imgs/home/bottom-synch.svg'} />
                                        <p>逾期同步</p>
                                    </li>
                                </ul>
                            </div>
                            <div className='bottom-tip-p'>
                                <p className='bottom-tip'>借贷有风险，出借需谨慎</p>
                            </div>
                        </div>:<span>                        
                            <div className='daodao' onTouchEnd={()=>{this.toChat()}}>
                                {this.state.daodao?<span className='err-num'>{this.state.daodao}</span>:null}
                                <img src={'/imgs/wu/bor_daodao.png'} />
                            </div>
                            <PullToRefresh 
                                damping={40}  //距离
                                style={{
                                    overflow: 'auto',
                                }}
                                className={'view-home-shop-box'}
                                indicator={{activate:'加载更多', deactivate: '加载中', release: '已加载' }}
                                direction={'up'}
                                refreshing={this.state.refreshing}
                                onRefresh={() => {
                                    this.setState({ refreshing: true },this.onGetMore)
                                }}>
                                <div className='view-home-shop' style={{overflow:'auto',height:'100%'}}>
                                    <div className='shop-top'>
                                        <SearchBar cancelText='确定' onCancel={(v)=>{this.onSearch(v)}} placeholder="搜索物品"  />
                                        <Tap onTap={()=>{this.toLeaseIntro()}}>
                                                            <img className='new-kill' src={'/imgs/wu/bor_index_ban.png'} />
                                                        </Tap>
                                        <div className='shop-nav'>
                                                <Tap className='shop-tap' onTap={()=>{this.toJoinUs()}}>
                                                <a>商家入驻</a>
                                                </Tap>
                                            <Tap className='shop-tap' onTap={()=>{this.toShoppingCart()}}>
                                                <a>购物车</a>
                                                </Tap>
                                        </div>
                                    </div>
                                    <Tap onTap={()=>{this.toOrderHavedHandle()}}>
                                        {this.state.messageCount?<Item arrow="horizontal" extra={this.state.messageCount+'个'}>
                                            <img style={{marginTop:'-3px'}} src={'/imgs/wu/daichuli.png'}/>待处理订单
                                        </Item>:null}
                                    </Tap>
                                    <div className='shop-content'>
                                        <div className='shop-fenlei'>
                                            {productType&&productType.length?productType.map(item=>{
                                                return <Tap key={Math.random()} onTap={()=>{this.onGetMore(true,item.id)}} className={item.active?'active':''}>{item.type_name}</Tap>
                                            }):null}
                                        </div>
                                        <div className='shop-box'>
                                            {rentSearchList&&rentSearchList.length?rentSearchList.map((item,index)=>{
                                                return<Tap key={index} className='shop-card' onTap={()=>{this.onOpenGoodsDetail(item.product_id)}}>
                                                    <div className='card-img'>
                                                        <img src={jjdConf.leaseImgUrl + item.c_logo} />
                                                    </div>
                                                    <p className='name'>{item.c_name}</p>
                                                    <p className='price'>¥{$.toYuan(item.n_rent_amt)}/天</p>
                                                    <p className='tag'>
                                                        {item.b_express && item.n_express_amt == 0?<span>包邮</span>:null}
                                                        {item.b_sell?<span>可售</span>:null}
                                                        {item.n_new_state == 100?<span>全新</span>:null}
                                                    </p>
                                                    <span className='position'>{item.c_position}</span>
                                                </Tap>
                                            }):null}
                                        </div>
                                    </div>
                                </div>
                            </PullToRefresh>
                        </span>}
                    </div>

                    <Modal
                        popup
                        onClose={()=>{this.onShowIOU('quickly',false)}}
                        visible={this.state.quickly}
                        animationType="slide-up"
                    >
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
