
//出借攻略
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { Tabs, Button } from "antd-mobile"
import { Tap } from 'COMPONENT'

const tabs = [ // tab数据
    {
        title: (
            <div className="top-img1">
                <img src='/imgs/com/rev-lend.png' alt="" />
                <img src='/imgs/com/rev-lend-active.png' alt="" />
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
                <img src='/imgs/com/rev-borrow.png' alt="" />
                <img src='/imgs/com/rev-borrow-active.png' alt="" />
            </div>
        )
    },
];

@withRouter
export default class App extends Component {
    constructor(props, context) {
        document.title = "出借攻略";
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
            if(v=='loan_mine'){
                sessionStorage.setItem('app_str',2);
                this.props.history.push({
                    pathname: '/'
                })
            }
        }
    }
    render() {
        return (
            <div className='view-lendIous'>

                <div className="page-title">
                    在今借到出借可以有3种姿势
                </div>

                <Tabs tabs={tabs}
                    initialPage={0}
                    onChange={(tab, index) => { console.log('onChange', index, tab); }}
                    onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                >
                    <div className="cont1">
                        <div className="cont-title">
                            一次性创建出借产品，好友无限次申请
                        </div>
                        <div className="title">
                            1. 创建出借产品
                        </div>
                        <div className="desc">
                            根据自身状况，设定金额、时长、利息等信息
                        </div>
                        <div className="title">
                            2. 分享获客
                        </div>
                        <div className="desc">
                            把出借产品分享出去
                        </div>
                        <div className="title">
                            3. 审核放款
                        </div>
                        <div className="desc">
                            审核后出借，借条立即生效
                        </div>
                    </div>
                    <div className="cont1">
                        <div className="cont-title">
                            私下出借后补张借条，有保障更安心
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
                            好友在借款，直接借款给TA就好了
                        </div>
                        <div className="title">
                            1. 筛选标的
                        </div>
                        <div className="desc">
                            在首页看到有好友在借款
                        </div>
                        <div className="title">
                            2. 审核放款
                        </div>
                        <div className="desc">
                            审核对方的资质后出借，借条立即生效
                        </div>
                    </div>
                </Tabs>

                <div className="cont1" style={{ marginTop: "0.1rem", paddingTop: "0.13rem", paddingLeft: "0.1rem", paddingBottom: "0.1rem", }}>
                    <div className="cont-title">
                        如何降低出借风险
                        </div>
                    <div className="title">
                        1. 配合信用报告，贷前三视
                        </div>
                    <div className="desc">
                        建议信用报告配合微信视频，判断对方是否是本人，借款用途是否真实，是否有还款意愿和能力
                        </div>
                    <div className="title">
                        2. 采用去出借/求借款，通过线上出借
                    </div>
                    <div className="desc">
                        通过平台走账，交易链更完整，可以提供更充分的证据
                    </div>
                    <div className="title">
                        3. 贷后及时申请催收
                    </div>
                    <div className="desc">
                        如遇逾期，可以通过今借到申请专业催收
                    </div>
                </div>

                <div className="bottom-btn">
                    <Tap onTap={()=>{this.gotoPage('loan_mine')}}>
                    {/* <Tap to="/pre/loan_mine"> */}
                        <Button>马上出借</Button>
                    </Tap>
                </div>

            </div>
        )
    }
}
