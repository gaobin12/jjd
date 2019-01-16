
//主页 => 好友
import '../common.less'
import './index.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { List } from 'antd-mobile'
import { Tap,Tips } from 'COMPONENT'
import { Loading, Modal } from 'SERVICE'

const Item = List.Item;
const Brief = Item.Brief;

@withRouter
export default class Page extends Component {
    constructor(props, context) {
        document.title = "好友";
        super(props, context)
        
        this.state = {
            switchIndex: 1
        };
    }

    componentDidMount() {
         
    }
    onSwitch=(v)=>{
        this.setState({
            switchIndex: v
        })
    }
    render() {
        const { switchIndex } = this.state;
        return (
            <div className="view-friend view-friend-index" style={{paddingBottom:'50px'}}>
                <div className='common-view-in'>
                    <List className="f-header">
                        <Item extra={<img src='/imgs/friend/le1.png' />} align="top" thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine>
                            琚城<img src='/imgs/friend/girl.svg' />
                            <Brief>超级认证<span>136 2356 3562</span></Brief>
                        </Item>
                    </List>
                    <Link to="/friend/remarks" className='go-remake font12 mainC2'>
                        <img src='/imgs/friend/pen.svg' />
                        添加备注
                    </Link>
                    <div className='nav-tab'>
                        <Tap className={switchIndex==1?'active':null} onTap={()=>{this.onSwitch(1)}}>主页</Tap>
                        <Tap className={switchIndex==2?'active':null} onTap={()=>{this.onSwitch(2)}}>信用</Tap>
                        <Tap className={switchIndex==3?'active':null} onTap={()=>{this.onSwitch(3)}}>交易</Tap>
                    </div>

                    
                    <div className='f-tip'>
                        <img src='/imgs/friend/notice.svg'/> 该用户当前有预期借条
                    </div>
                    {switchIndex==1?<span>
                        <List className="friend-list">
                            <Item className='header'>动态</Item>
                            <Item extra={<span>共<font className='mainC1'>2</font>笔</span>} arrow="horizontal">进行中的借款</Item>
                            <Item extra={<span>共<font className='mainC1'>2</font>笔</span>} arrow="horizontal">进行中的出借</Item>

                            <Item className='header'>基础信息</Item>
                            <Item extra={'xxxxxx'}>身份证号</Item>
                            <Item extra={'xxxxxx'}>常用手机号</Item>
                            <Item extra={'xxxxxx'}>微信号</Item>
                            <Item extra={'xxxxxx'}>现居地</Item>
                            <Item extra={<span>10个(<font className='mainC1'>5</font>个共同好友)</span>}>好友数量</Item>
                            <Item extra={'xxxxxx'}>注册时间</Item>

                            <Item className='header'>数字证书</Item>
                            <Item extra={'xxxxxx'}>执行情况描述</Item>
                        </List>
                        <div className='explain'>
                            <p>个人数据脱敏处理规则</p>
                            <p>首页关于本人的手机号、身份证号、微信号、常住地，一但借条发生逾期，借条完结前将对逾期的出借人全部展示。</p>
                        </div>
                    </span>:switchIndex==2?<span>
                        <List className="credit-tip">
                            <Item extra={<span>已认证<font className='mainC1'>13/13</font>项</span>} arrow="horizontal">信用认证</Item>
                        </List>
                        <List className="friend-list credit-list">
                            <Item className='header'>概况预览</Item>
                            <div className='line-space'>
                                反欺诈
                            </div>
                            <Item extra={'xxxxxx'}>身份匹配校验</Item>
                            <div className='user-valid'>
                                 {[1,2,3,4,5].map(item=>{
                                     return <p><img src={true?'/imgs/friend/right.png':'/imgs/friend/wrong.png'}/>学信</p>
                                 })}
                            </div>
                            <Item extra={'xxxxxx'}>运营商入网时长</Item>
                            <Item extra={'xxxxxx'}>风险联系人</Item>
                            <Item extra={'xxxxxx'}>高法失信</Item>
                            <div className='line-space'>
                                还款意愿
                            </div>
                            <Item extra={'xxxxxx'}>报告完整度</Item>
                            <Item extra={'xxxxxx'}>当前逾期金额</Item>
                            <Item extra={'xxxxxx'}>平台逾期次数占比</Item>
                            <Item extra={'xxxxxx'}>恶意举报次数</Item>
                            <div className='line-space'>
                                还款能力
                            </div>
                            <Item extra={'xxxxxx'}>当前平台负债</Item>
                            <Item extra={'xxxxxx'}>互通联系人</Item>
                            <Item extra={'xxxxxx'}>月均消费水平</Item>
                            <Item extra={<div className='user-valid' style={{paddingRight:'0'}}>
                                 {[1,2].map(item=>{
                                     return <p><img src={true?'/imgs/friend/right.png':'/imgs/friend/wrong.png'}/>学信</p>
                                 })}
                            </div>}>社保公积金</Item>
                            
                            <Item className='header'>认证详情</Item>
                            <div className='grid-box'>
                                <figure>
                                    <img src='/imgs/friend/valid1.svg' />
                                    <figcaption>
                                        基础信息
                                        {true?<p className='green'>维护中</p>:
                                        true?<p className='blue'>认证中</p>:
                                        true?<p className='mainC1'>待完善</p>:
                                        true?<p className='fontC1'>已过期</p>:
                                        true?<p className='red'>认证失败</p>:null}
                                    </figcaption>
                                </figure>
                                <figure>
                                    <img src='/imgs/friend/valid2.svg' />
                                    <figcaption>
                                        数据更新
                                    </figcaption>
                                </figure>
                                <figure>
                                    <img src='/imgs/friend/valid3.svg' />
                                    <figcaption>
                                        高法失信
                                    </figcaption>
                                </figure>
                                <figure>
                                    <img src='/imgs/friend/valid4.svg' />
                                    <figcaption>
                                        借贷数据
                                    </figcaption>
                                </figure>
                                <figure>
                                    <img src='/imgs/friend/valid5.svg' />
                                    <figcaption>
                                        运营商
                                    </figcaption>
                                </figure>
                                <figure>
                                    <img src='/imgs/credit/sel-jingdong.svg' />
                                    <figcaption>
                                        京东认证
                                    </figcaption>
                                </figure>
                                <figure>
                                    <img src='/imgs/credit/sel-location-gray.svg' />
                                    <figcaption>
                                        定位
                                    </figcaption>
                                </figure>
                                <figure>
                                    <img src='/imgs/credit/sel-shebao-gray.svg' />
                                    <figcaption>
                                        社保
                                    </figcaption>
                                </figure>
                                <figure>
                                    <img src='/imgs/credit/sel-gjj.svg' />
                                    <figcaption>
                                        公积金
                                    </figcaption>
                                </figure>
                                <figure>
                                    <img src='/imgs/credit/sel-xuexin.svg' />
                                    <figcaption>
                                        学信
                                    </figcaption>
                                </figure>
                                <figure>
                                    <img src='/imgs/credit/sel-job-gray.svg' />
                                    <figcaption>
                                        职业认证
                                    </figcaption>
                                </figure>
                                <figure>
                                    <img src='/imgs/credit/sel-income.svg' />
                                    <figcaption>
                                        收入认证
                                    </figcaption>
                                </figure>
                                <figure>
                                    <img src='/imgs/credit/sel-car.svg' />
                                    <figcaption>
                                        车产
                                    </figcaption>
                                </figure>
                                <figure>
                                    <img src='/imgs/credit/sel-house-gray.svg' />
                                    <figcaption>
                                        房产
                                    </figcaption>
                                </figure>
                            </div>
                        </List>
                        <div className='explain'>
                            <p>个人数据脱敏处理规则</p>
                            <p>首页关于本人的手机号、身份证号、微信号、常住地，一但借条发生逾期，借条完结前将对逾期的出借人全部展示。</p>
                        </div>
                    </span>:switchIndex==3?<span>
                        <List className="friend-list credit-list">
                            <Item className='header'>我们之间的交易</Item>
                            <div className='line-space'>
                                借入
                            </div>
                            <Item extra={'xxxxxx'}>当前笔数</Item>
                            <Item extra={'xxxxxx'}>当前金额</Item>
                            <Item extra={'xxxxxx'}>累计笔数</Item>
                            <Item extra={'xxxxxx'}>累计金额</Item>
                            <Item extra={'xxxxxx'}>已偿清金额</Item>
                            <div className='line-space'>
                                借出
                            </div>
                            <Item extra={'xxxxxx'}>当前笔数</Item>
                            <Item extra={'xxxxxx'}>当前金额</Item>
                            <Item extra={'xxxxxx'}>累计笔数</Item>
                            <Item extra={'xxxxxx'}>累计金额</Item>
                            <Item extra={'xxxxxx'}>已偿清金额</Item>
                            <div className='line-space'>
                                担保
                            </div>
                            <Item extra={'xxxxxx'}>当前笔数</Item>
                            <Item extra={'xxxxxx'}>当前金额</Item>
                            <Item extra={'xxxxxx'}>累计笔数</Item>
                            <Item extra={'xxxxxx'}>累计金额</Item>
                            <Item extra={'xxxxxx'}>已偿清金额</Item>
                        </List>
                        <div className='explain'>
                            <p>个人数据脱敏处理规则</p>
                            <p>首页关于本人的手机号、身份证号、微信号、常住地，一但借条发生逾期，借条完结前将对逾期的出借人全部展示。</p>
                        </div>
                    </span>:null}
                </div>
                <div className='common-btn_box'>
                    <Tap className='span'>向TA借款</Tap>
                    <Tap className='c-black span active'>
                        出借给TA
                    </Tap>
                </div>
            </div>
        )
    }
}