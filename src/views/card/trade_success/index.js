
//提现 => 操作成功
import '../card.less'
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import {Tap} from 'COMPONENT'
import { List,Flex} from 'antd-mobile';

const Item = List.Item;

@withRouter
@inject('bankStore')
@observer
export default class App extends Component {
    constructor(props, context) {
        document.title = "支付成功";
        super(props, context)
        //设置组件状态
        this.state = {
        };
    }
    componentDidMount() {
    }
    gotoPage=(v)=>{
        if(v=='cach'){
            this.props.history.push({
                pathname: '/card/cash',
            });
        }
        else if(v=='charge'){
            this.props.history.push({
                pathname: '/card/charge',
            });
        }
        else if(v=='all'){
            window.history.go(-2);
        }
    }
   
    render() {
        let {paySuccess}=this.props.bankStore;
        return (
            <div className='trade_success view-card' style={{paddingBottom:'50px'}}>
                <div style={{height: '100%',overflow:'auto'}}>		
                    <img src={'/imgs/iou/loan-success.svg'} className="succ-img" />
                    <p className="succ-font">交易详情</p>
                    {paySuccess.tradeType=='charge'?<p className="succ-font">已提交，支付结果请关注消息推送</p>:null}
                    {paySuccess.tradeType=='cash'?<p className="succ-font">预计24小时之内到账</p>:null}
                    <p className="succ-font big">{paySuccess.amount}<span>元</span></p>

                    {paySuccess.tradeType=='charge'?<List className="my-list">
                        <Item>
                            <span className="wid50">支付方式</span>
                            <span className="wid50">{paySuccess.bankCard==0?"余额":null}
                        {paySuccess.tradeType==1?"银行卡":null}
                        {paySuccess.tradeType==2?"线下":null}
                        {paySuccess.tradeType==3?"银联":null}
                        {paySuccess.tradeType==4?"微信(app类)":null}</span>
                        </Item>
                    </List>:null}
                    {paySuccess.tradeType=='cash'?<List className="my-list">
                        <Item extra={paySuccess.bankCard}>储蓄卡</Item>
                    </List>:null}

                </div>

                <div className='common-btn_box'>
                    {paySuccess.tradeType=='cash'?<Tap className='span font16 active' onTap={()=>{this.gotoPage('cach')}}>继续提现</Tap>:null}
                    {paySuccess.tradeType=='charge'?<Tap className='span font16 active' onTap={()=>{this.gotoPage('charge')}}>继续充值</Tap>:null}
                    <Tap className='c-black span font16 active' onTap={()=>{this.gotoPage('all')}}>完成</Tap>
                </div>
            </div>
        )
    }
}