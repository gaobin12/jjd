//主页
import './index.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Drawer, Carousel, Flex} from 'antd-mobile'
import { Tap,Anchor } from 'COMPONENT'
import { Loading, Modal, util, math } from 'SERVICE'
import Store from 'MOBX/store'
import BORROW from './borrow'
import LOAN from './loan'
import GUARANTEE from './guarantee'

@withRouter
@inject('userStore','homeStore','preIouStore')
@observer
export default class page extends Component {
	
	constructor (props, context) {
        super(props, context)
        this.state = {
            isLogin: props.userStore&&props.userStore.userInfo.userId, // 是否登录
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
        if(this.props.userStore.userInfo.userId){
            this.props.userStore.getUserInfo();
            this.props.userStore.getUserCreditInfo();            
            this.getPageInfo();
        }
        Store.clearStore();

        setTimeout(()=>{
            $.anchorId = null;
        },500)
    }
    // 消息
    gotoPage=(v)=>{
        if(this.state.isLogin){//已登录
            if(v=='message'){
                // console.log(this, 2434);
                // this.props.history.push({
                // this.props.history.push({
                this.props.history.push({
                    pathname: '/msg'
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
    //首页获取用户信息
	getPageInfo=()=>{
        const { userStore } = this.props;
        //Loading.show();
		$.ajaxE({
			type: 'GET',
			url: '/user/info/getHomepageInfo',
			data:{
                identity:0  //获取默认数据
            }
		}).then((data)=>{
            //debugger;
            userStore.setUserInfo(data.userInfoVO);
            //保存用户数据          
		}).catch((msg)=>{			
			Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }

    componentDidUpdate(){
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
        }).finally(()=>{
            Loading.hide();
        })
    }

    onOpenChange=()=>{
        let { homeStore } = this.props;
        homeStore.changeDrawer(!homeStore.drawer);
    }

    onGo=(type,ob)=>{
        if(!this.props.userStore.userInfo.userId){
            this.props.history.push("/user/login");
            return;
        }
        switch(type){
            case 'idAuth':
                //实名认证
                this.props.history.push({
                    pathname: '/pre/iou_detail'
                });
            break;
            case 'friend':
                //好友
                this.props.history.push({
                    pathname: '/friend/list'
                });            
            break;
            case 'card':
                //银行卡
                this.props.history.push({
                    pathname: '/card'
                });
            break;
            case 'credit':
                //信用认证lvvl
                this.props.history.push({
                    pathname: '/credit'
                });
            break;
            case 'wallet':
                //钱包
                this.props.history.push({
                    pathname: '/wallet'
                });
            break;
            case 'repay_list':
                this.props.history.push({
                    pathname: '/after/borrow_list'
                });
            break;
            case 'receive_list':
                this.props.history.push({
                    pathname: '/after/loan_list'
                });
            break;
            case 'guarantee_list':
                this.props.history.push({
                    pathname: '/card'
                });
            break;
            case 'fast':
                this.props.preIouStore.setIouForm({
                    tab:this.props.homeStore.tab?1:0
                })
                this.props.history.push({
                    pathname: '/fast/form'
                });
            break;
            case 'borrow_form':
                this.props.history.push({
                    pathname: '/pre/borrow_form'
                });
            break;
            case 'iou_form':
                this.props.preIouStore.setIouForm({
                    tab:ob
                })
                this.props.history.push({
                    pathname: '/pre/iou_form'
                });
            break;
            case 'product_list':
                this.props.history.push({
                    pathname: '/pre/product_list'
                });
            break;
            case 'setting':
                this.props.history.push({
                    pathname: '/setting'
                });
            break;
            default:
            break;
        }
    }
    
    render () {
        const { userStore:{userInfo,creditInfo},homeStore,homeStore:{homeInfo} } = this.props;
        const { notices, showAll, topIndex } = this.state;
        const sidebar = (
            <div className="left-cont">
                <div style={{height:'100%',overflow:'auto'}}>
                    <div className='head'>
                        {(!userInfo.userId && creditInfo.idCardStatus!=1)?<Tap onTap={() => { this.onGo() }}>
                            <img src={'/imgs/iou/user.svg'} />
                            <span className='font18 fontC1'>尚未登录</span>
                        </Tap>:null}            
                        {(userInfo.userId && creditInfo.idCardStatus!=1)?<Tap onTap={() => { this.onGo('idAuth') }}>
                            <img src={ (userInfo.avatarUrl&&userInfo.avatarUrl.length)?userInfo.avatarUrl:'/imgs/iou/user.svg'} />
                            <span className='font18 fontC1'>{userInfo.telephone}</span>
                        </Tap>:null}
                        {(userInfo.userId && creditInfo.idCardStatus==1)?<Tap onTap={() => { this.onGo('friend') }}>
                            <img src={(userInfo.avatarUrl&&userInfo.avatarUrl.length)?userInfo.avatarUrl:'/imgs/iou/user.svg'} />
                            <span className='font18 fontC1'>{userInfo.userName}</span>
                        </Tap>:null}
                    </div>
                    <div className='credit'>
                        <Tap onTap={() => { this.onGo('card') }}>
                            <span className='mainC1 font12'>银行卡</span><img src='/imgs/home/arrow-color.svg' />
                        </Tap>
                        <Tap onTap={() => { this.onGo('credit') }}>
                            <span className='mainC1 font12'>信用报告</span><img src='/imgs/home/arrow-color.svg' />
                        </Tap>
                    </div>
                    <div className='menu'>
                        <Tap onTap={() => { this.onGo('wallet') }}>
                            <img src={'/imgs/home/wallet.svg'} />
                            <span>钱包</span>
                            <span className='right'>
                                {(userInfo.userId && creditInfo.idCardStatus==1)?$.toYuan(userInfo.toRepayAmount):0}元
                            </span>
                        </Tap>
                        <Tap onTap={() => { this.onGo('repay_list') }}>
                            <img src={'/imgs/home/repay.svg'} />
                            <span>待还</span>
                            <span className='right'>
                                {(userInfo.userId && creditInfo.idCardStatus==1)?$.toYuan(userInfo.toRepayAmount):0}元
                            </span>
                        </Tap>
                        <Tap onTap={() => { this.onGo('receive_list') }}>
                            <img src={'/imgs/home/receive.svg'} />
                            <span>待收</span>
                            <span className='right'>
                                {(userInfo.userId && creditInfo.idCardStatus==1)?$.toYuan(userInfo.toReceiveAmount):0}元
                            </span>
                        </Tap>
                        <Tap onTap={() => { this.onGo('guarantee_list') }}>
                            <img src={'/imgs/home/guarantee.svg'} />
                            <span>担保</span>
                        </Tap>
                        <Tap onTap={() => { this.onGo('friend') }}>
                            <img src={'/imgs/home/friend.svg'} />
                            <span>好友</span>
                        </Tap>
                    </div>
                </div>
                <div className='bottom'>
                    <Tap onTap={() => { this.onGo('setting') }}>
                        <img src={'/imgs/home/setting.svg'} />
                        <span>设置</span>
                    </Tap>
                    <Tap onTap={() => { this.onGo('faqs') }}>
                        <img src={'/imgs/home/kefu.svg'} />
                        <span>客服</span>
                    </Tap>
                    <Tap onTap={() => { this.onGo('strategy') }}>
                        <img src={'/imgs/home/gonglue.svg'} />
                        <span>攻略</span>
                    </Tap>
                </div>
            </div>
        );

        return (
            <Drawer
                className="view-home"
                style={{ minHeight: document.documentElement.clientHeight }}
                contentStyle={{ textAlign: 'center' }}
                sidebar={sidebar}
                open={homeStore.drawer}
                onOpenChange={this.onOpenChange}>
                <div className='view-home-cont'>
                    <div className="head">
                        <Tap className="left" onTap={this.onOpenChange}>
                            <img src={'/imgs/home/home-user.svg'} />
                        </Tap>
                        <Tap onTap={()=>{this.setState({topIndex:1})}} className={topIndex==1?" tab active":"tab"} >钱</Tap>
                        <i className='line'/>
                        <Tap onTap={()=>{this.props.history.push('/jzd')}} className={topIndex==2?" tab active":"tab"}>物</Tap>
                        <Tap className="right" onTap={()=>{this.gotoPage('message')}}>
                            {userInfo.unSeeMsgCount?<span className='msg-r'></span>:null}
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
                                <Tap onTap={()=>{homeStore.changeTab(0)}} className={homeStore.tab==0?"tab active mainC1":"tab fontC3"}>借款</Tap>
                                <Tap onTap={()=>{homeStore.changeTab(1)}} className={homeStore.tab==1?"tab active mainC1":"tab fontC3"}>出借</Tap>
                                <Tap onTap={()=>{homeStore.changeTab(2)}} className={homeStore.tab==2?"tab active mainC1":"tab fontC3"}>担保</Tap>
                            </div>

                            <div className='top'>
                                {(userInfo.userId && creditInfo.idCardStatus!=1)?<div className='left'>
                                    <p className='name num-font font16 mainC2'>Hi，{userInfo.telephone}</p>
                                    <Tap onTap={() => { this.onGo('idAuth') }}>
                                        <p className='credit font12'>
                                            立即认证
                                            <img src='/imgs/home/arrow-r.svg' />
                                        </p>
                                    </Tap>                                
                                </div>:null}
                                {(userInfo.userId && creditInfo.idCardStatus==1)?<div className='left'>
                                    <p className='name num-font font16 mainC2'>Hi，{userInfo.userName}</p>
                                </div>:null}
                                {homeStore.tab==0?
                                    (userInfo.userId)?<Flex justify='between' className='h-money'>
                                        <Tap onTap={() => { this.onGo('wallet') }}>
                                            <Flex.Item>
                                                <p className='text-left font12 mainC1'><span className='num-font font16'>
                                                    {$.toYuan(homeInfo.borrowInfo.amount)}</span>元</p>
                                                <p className='text-left font12 fontC1'>余额</p>
                                            </Flex.Item>
                                        </Tap>
                                        <Tap onTap={() => { this.onGo('friend') }}>
                                            <Flex.Item>
                                                <p className='font12 mainC1'><span className='num-font font16'>
                                                    {homeInfo.borrowInfo.loanUserCount}</span>人</p>
                                                <p className='font12 fontC1'>好友</p>
                                            </Flex.Item>
                                        </Tap>
                                        <Tap onTap={() => { this.onGo('repay_list') }}>
                                            <Flex.Item>
                                                <p className='text-right font12 mainC1'><span className='num-font font16'>
                                                    {$.toYuan(homeInfo.borrowInfo.loanUserAmount)}</span>元</p>
                                                <p className='text-right font12 fontC1'>待还</p>
                                            </Flex.Item>
                                        </Tap>
                                    </Flex>:<div className='left'>
                                        <p className='des font16 mainC2 font-bold'>我要借钱</p>
                                        <p className='bottom font12 fontC3'>最高可借额度(元)<span className='mainC1'><strong className='num-font font32'>200,000</strong></span></p>
                                    </div>
                                :null}
                                
                                {homeStore.tab==1?
                                    (userInfo.userId)?<Flex justify='between' className='h-money' >
                                        <Tap onTap={() => { this.onGo('wallet') }}>
                                            <Flex.Item>
                                                <p className='text-left font12 mainC1'><span className='num-font font16'>
                                                    {$.toYuan(homeInfo.lendInfo.amount)}
                                                </span>元</p>
                                                <p className='text-left font12 fontC1'>余额</p>
                                            </Flex.Item>
                                        </Tap>
                                        <Tap onTap={() => { this.onGo('friend') }}>
                                            <Flex.Item>
                                                <p className='font12 mainC1'><span className='num-font font16'>
                                                    {homeInfo.lendInfo.loanUserCount}
                                                </span>人</p>
                                                <p className='font12 fontC1'>好友</p>
                                            </Flex.Item>
                                        </Tap>
                                        <Tap onTap={() => { this.onGo('receive_list') }}>
                                            <Flex.Item>
                                                <p className='text-right font12 mainC1'><span className='num-font font16'>
                                                    {$.toYuan(homeInfo.lendInfo.loanUserAmount)}
                                                </span>元</p>
                                                <p className='text-right font12 fontC1'>待收</p>
                                            </Flex.Item>
                                        </Tap>
                                    </Flex>:<div className='left'>
                                        <p className='des font16 mainC2 font-bold'>我要出借</p>
                                        <p className='bottom font12 fontC3'>极速出借仅需<span className='mainC1'><strong className='num-font font32'>3</strong>分钟</span></p>
                                    </div>
                                :null}
                                
                                {homeStore.tab==2?
                                    (userInfo.userId)?<Flex justify='between' className='h-money' style={{marginBottom:0,borderBottom:0,paddingBottom:'5px'}}>
                                        <Tap onTap={() => { this.onGo('wallet') }}>
                                            <Flex.Item>
                                                <p className='text-left font12 mainC1'><span className='num-font font16'>
                                                    {$.toYuan(homeInfo.guaranteeInfo.amount)}
                                                </span>元</p>
                                                <p className='text-left font12 fontC1'>余额</p>
                                            </Flex.Item>
                                        </Tap>
                                        <Tap onTap={() => { this.onGo('friend') }}>
                                            <Flex.Item>
                                                <p className='font12 mainC1'><span className='num-font font16'>
                                                    {homeInfo.guaranteeInfo.loanUserCount}
                                                </span>人</p>
                                                <p className='font12 fontC1'>好友</p>
                                            </Flex.Item>
                                        </Tap>
                                        <Tap onTap={() => { this.onGo('repay_list') }}>
                                            <Flex.Item>
                                                <p className='text-right font12 mainC1'><span className='num-font font16'>
                                                    {$.toYuan(homeInfo.guaranteeInfo.loanUserAmount)}
                                                </span>元</p>
                                                <p className='text-right font12 fontC1'>待还</p>
                                            </Flex.Item>
                                        </Tap>
                                    </Flex>:<div className='left'>
                                        <p className='des font16 mainC2 font-bold'>帮朋友做担保</p>
                                        <p className='bottom font12 fontC3'>最高担保收益<span className='mainC1'><strong className='num-font font32'>10</strong>%</span></p>
                                    </div>
                                :null}

                                {homeStore.tab==0?
                                    <div className='jc-bottom'>
                                        <Tap className='com-btn-border--big' onTap={()=>{this.onGo('iou_form',0)}}>
                                            补借条
                                        </Tap>
                                        <Tap className='com-btn-solid--big' onTap={()=>{this.onGo('borrow_form')}}>
                                            求借款
                                        </Tap>
                                    </div>:null}
                                {homeStore.tab==1?                     
                                    <div className='jc-bottom'>
                                        <Tap className='com-btn-border--big' onTap={()=>{this.onGo('iou_form',1)}}>
                                            补借条
                                        </Tap>
                                        <Tap className='com-btn-solid--big' onTap={()=>{this.onGo('product_list')}}>
                                            去出借
                                        </Tap>
                                    </div>:null}
                                {homeStore.tab==2&&!userInfo.userId?                     
                                    <div className='jc-bottom danbao'>
                                        <Tap className='com-btn-solid--big' onTap={()=>{this.onGo('quickly',1)}}>
                                            立即担保
                                        </Tap>
                                    </div>:null}
                            </div>
                        </div>

                        <div className='b-image'>
                            <Tap onTap={()=>{this.onGo('fast')}}>
                                <img src={'/imgs/home/banner.png'} />
                            </Tap>
                        </div>
                    </div>  

                    {homeStore.tab==0?<BORROW />:null}
                    {homeStore.tab==1?<LOAN />:null}
                    {homeStore.tab==2?<GUARANTEE />:null}     

                    <div className='home-help'>                        
                        {userInfo.newUserStatus?<div className='help-content'>
                                <h3 className='title com-title-left'>新手攻略</h3>
                                <div className='card'>
                                    <h4 className='font14 fontC3 text-left'>
                                        仅需三步&nbsp;&nbsp;轻松借钱
                                        <Tap className='com-btn-border float-right' onTap={()=>{this.onGo('credit')}}>立即认证</Tap>
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
                                            {homeStore.tab==0?<span>借钱</span>:
                                            homeStore.tab==1?<span>出借</span>:
                                            homeStore.tab==2?<span>担保</span>:null}
                                            
                                        </div>
                                    </Flex>
                                    <div className='h-bottom text-right'>
                                        {homeStore.tab==0?<Link to="/strategy/borrow_ious">详细攻略</Link>:
                                        homeStore.tab==1?<Link to="/strategy/lend_ious">详细攻略</Link>:
                                        homeStore.tab==2?<Link to="/strategy/borrow_ious">详细攻略</Link>:null}
                                        <img src='/imgs/home/arrow-r.svg'/>
                                    </div>
                                </div>
                            </div>:null}
                        <Tap className='right' onTap={()=>{this.onGo('faqs')}}>
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
                        <Anchor id="anchor_faqs"></Anchor>
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
