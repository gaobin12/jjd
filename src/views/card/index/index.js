
//银行卡
import '../card.less'
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { List } from 'antd-mobile'
import { Loading, Modal } from 'SERVICE'
import {Tap} from 'COMPONENT'

const bankMap = {
    '招商银行':{
        'logo':'zhaoshang.svg',
        'bgimg':'zhaoshang-bg.svg',
        'bgcolor':'red'
    },
    '中国银行':{
        'logo':'zhongguo.svg',
        'bgimg':'zhongguo-bg.svg',
        'bgcolor':'red'
    },
    '工商银行':{
        'logo':'gongshang.svg',
        'bgimg':'gongshang-bg.svg',
        'bgcolor':'red'
    },
    '华夏银行':{
        'logo':'huaxia.svg',
        'bgimg':'huaxia-bg.svg',
        'bgcolor':'red'
    },
    '中信银行':{
        'logo':'zhongxin.svg',
        'bgimg':'zhongxin-bg.svg',
        'bgcolor':'red'
    },
    '北京银行':{
        'logo':'beijing.svg',
        'bgimg':'beijing-bg.svg',
        'bgcolor':'red'
    },
    '农业银行':{
        'logo':'nongye.svg',
        'bgimg':'nongye-bg.svg',
        'bgcolor':'green'
    },
    '邮政银行':{
        'logo':'youzheng.svg',
        'bgimg':'youzheng-bg.svg',
        'bgcolor':'green'
    },
    '民生银行':{
        'logo':'minsheng.svg',
        'bgimg':'minsheng-bg.svg',
        'bgcolor':'green'
    },
    '建设银行':{
        'logo':'jianshe.svg',
        'bgimg':'jianshe-bg.svg',
        'bgcolor':'blue'
    },
    '兴业银行':{
        'logo':'xingye.svg',
        'bgimg':'xingye-bg.svg',
        'bgcolor':'blue'
    },
    '浦发银行':{
        'logo':'pufa.svg',
        'bgimg':'pufa-bg.svg',
        'bgcolor':'blue'
    },
    '光大银行':{
        'logo':'guangda.svg',
        'bgimg':'guangda-bg.svg',
        'bgcolor':'purple'
    },
    '平安银行':{
        'logo':'pingan.svg',
        'bgimg':'pingan-bg.svg',
        'bgcolor':'yellow'
    },
}

@withRouter
@inject('userStore','bankStore')
@observer
export default class App extends Component {
    constructor(props, context) {
        document.title = "银行卡";
        super(props, context)
        this.state = {
            //用户userid
            userId:'',
        };
    }
    componentDidMount(){
        this.getPageInfo();
    }

    //获取页面内容
    getPageInfo = () => {
        let _this = this;
        Loading.show();
        $.ajaxE({
            type: 'GET',
            //校验用户信用接口
            url: '/user/my/checkCredit',
        }).then((data) => { 
            _this.props.userStore.setCreditInfo(data);
        }).catch((msg) => {            
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }
    //跳转绑定银行卡页面
    onItemTap = (v) => {
        //判断用户是否身份认证
        if(this.props.userStore.creditInfo.idCardStatus){
            this.props.history.push({
                pathname: '/card/bind_card',
                query:{
                    payCredit:''
                }
            });
        }else{
            Modal.infoX('您还没有身份认证，去认证',()=>{
                this.props.history.push({
                    pathname: '/user/id_auth',
                    query:{
                        pathType:0,
                        payCredit:''
                    }
                });
            });
        }
    }
    
    //跳转银行卡详情页面
    onCardTap = (ele) => {
        Object.assign(ele,bankMap[ele.bankName]);
        this.props.bankStore.setCurrentBank(ele);
        this.props.history.push({
            pathname: '/card/bank_detail'
        });
    }

    render() {
        const { userBindBanks } = this.props.userStore.creditInfo;
        return (
            <div className='view-card'>
                <div style={{height: '100%',overflow:'auto',paddingBottom:'0.2rem'}}>
                    {userBindBanks?userBindBanks.map((ele,index)=>{ 
                        return <div key={'card' + index}>
                             <Tap onTap={() => { this.onCardTap(ele) }}>
                                <div className={"bank_card "+bankMap[ele.bankName].bgcolor}>
                                    <div className="name">
                                        <img src={'/imgs/bank/'+bankMap[ele.bankName].logo} className="bank-img"/>
                                        <span>{ele.bankName?ele.bankName:'银行卡'}</span>
                                    </div>
                                    <div className="number">
                                        *** **** **** {ele.bankAccount}
                                    </div>
                                    <div className="posi-font">储蓄卡</div>
                                    <div className="posi-img">
                                        <img src={'/imgs/bank/'+bankMap[ele.bankName].bgimg} />
                                    </div>
                                </div>
                            </Tap>
					</div>
                    }):null}
                </div>
                    
                <div className='common-btn_box'>
                    <Tap className='c-black font16 active' onTap={() => { this.onItemTap(1) }}>
                        <img src={'/imgs/bank/add.svg'} className="btn-img" />
                        <span className="btn-font">添加银行卡</span>
                    </Tap>
                </div>
                
            </div>
        )
    }
}
