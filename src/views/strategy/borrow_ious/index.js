
// 反馈借款人信息
import './index.less';
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { Tabs, Badge, Button } from "antd-mobile"
import { Tap } from 'COMPONENT'
import { Modal, Loading } from 'SERVICE'


const tabs = [ // tab数据
    {
        title: (
            <div className="top-img1">
                <img src='/imgs/com/rev-borrow.png' alt="" />
                <img src='/imgs/com/rev-borrow-active.png' alt="" />
            </div>
        )
    },
    {
        title: (
            <div className="top-img1">
                <img src='/imgs/com/rev-fill-ious.png' alt="" />
                <img src='/imgs/com/rev-fill-ious-active.png' alt="" />
            </div>
        )
    },
    {
        title: (
            <div className="top-img1">
                <img src='/imgs/com/rev-lend.png' alt="" />
                <img src='/imgs/com/rev-lend-active.png' alt="" />
            </div>
        )
    },
];

@withRouter
export default class App extends Component {
    constructor(props, context) {
        document.title = "攻略";
        super(props, context)
        this.state = {
            
        };
        //this.renderTree = renderTree.bind(this)
    }
    // 跳转页面
    gotoPage=(v)=>{
        if(!$.isUserExist()){
            this.props.history.push({
                pathname: '/user/wy_valid/0'
            })
        }else{
            if(v=='borrow_form'){
                sessionStorage.setItem('app_str',1);
                this.props.history.push({
                    pathname: '/'
                })
            }
        }
    }
    
    render() {
        
        return (

            <div className='view-borrowIous'>
                <div style={{overflow:'auto',height:'100%'}}>
                    <div className="page-title">
                        在今借到借钱可以有3种姿势
                    </div>

                    <Tabs tabs={tabs}
                        initialPage={0}
                        onChange={(tab, index) => { console.log('onChange', index, tab); }}
                        onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                    >
                        <div className="cont1">
                            <div className="cont-title">
                                急用钱，快速向好友发起求借款
                            </div>
                            <div className="title">
                                1. 发起求借款
                            </div>
                            <div className="desc">
                                设定金额、时长、利息等信息，然后发送给好友
                            </div>
                            <div className="title">
                                2. 好友出借
                            </div>
                            <div className="desc">
                                被邀请的好友通过今借到出借，借条立即生效
                            </div>
                            <div className="title">
                                3. 提现到卡
                            </div>
                            <div className="desc">
                                好友出借后，您可以立即提现到银行卡
                            </div>
                        </div>
                        <div className="cont1">
                            <div className="cont-title">
                                给老熟人补张借条，突显咱诚意
                            </div>
                            <div className="title">
                                1. 私下达成交易
                            </div>
                            <div className="desc">
                                您和好友私下已经商定好，并且您收到了欠款
                            </div>
                            <div className="title">
                                2. 发起补借条
                            </div>
                            <div className="desc">
                                设定金额、时长、利息等信息，发送给对方
                            </div>
                            <div className="title">
                                3. 对方确认
                            </div>
                            <div className="desc">
                                对方确认信息无误，借条立即生效
                            </div>
                        </div>
                        <div className="cont1">
                            <div className="cont-title">
                                有好友在出借，直接申请就好啦
                            </div>
                            <div className="title">
                                1. 向好友申请借款
                            </div>
                            <div className="desc">
                                在首页看到有好友在出借，直接发起申请
                            </div>
                            <div className="title">
                                2. 对方出借
                            </div>
                            <div className="desc">
                                好友通过今借到出借，借条立即生效
                            </div>
                            <div className="title">
                                3. 提现到卡
                            </div>
                            <div className="desc">
                                好友出借后，您可以立即提现到银行卡
                            </div>
                        </div>
                    </Tabs>

                    <div className="cont1" style={{ marginTop: "0.1rem", paddingTop: "0.13rem", paddingLeft: "0.1rem", paddingBottom: "0.1rem", }}>
                        <div className="cont-title">
                            如何提高借款成功率
                            </div>
                        <div className="title">
                            1. 证明还款意愿和能力
                            </div>
                        <div className="desc">
                            详细说明你的借款用途，并证明你可以按时还款
                            </div>
                        <div className="title">
                            2. 提高信用报告完成度
                        </div>
                        <div className="desc">
                            尽可能多得完善认证项，让出借人了解你的信用状况
                        </div>
                        <div className="title">
                            3. 适当提高借款利率
                        </div>
                        <div className="desc">
                            用有诚意的利率回报朋友的及时帮助
                        </div>
                        <div className="title">
                            4. 邀请更多好友
                        </div>
                        <div className="desc">
                            把借款信息分享给更多有能力有意愿的好友
                        </div>
                    </div>
                </div>
                {/* <Link to="/pre/borrow_form"> */}
                <Tap onTap={()=>{this.gotoPage('borrow_form')}}>
                    <div className="bottom-btn">
                        <Button>马上借钱</Button>
                    </div>
                </Tap>

            </div>
        )
    }
}
