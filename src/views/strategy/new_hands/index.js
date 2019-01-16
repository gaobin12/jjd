
// 反馈借款人信息
import './index.less';
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tabs, Badge, Button } from "antd-mobile"
import {Link} from 'react-router-dom';

@withRouter
export default class App extends Component {
    constructor(props, context) {
        document.title = "攻略";
        super(props, context)
        this.state = {
            
        };
    }
    
    render() {
        
        return (

            <div className='view_new_hands'>
                <img src="/imgs/com/xyjh-new-hand.png" className="gl-banner" />
                <div className="strategy">
                    <img src="/imgs/com/xyjh-strat_1.png" className="str_1" />
                    <div className="str_title">
                        <span className="strtt_span"></span>	
                        <span>1、提交订单，支付</span>
                        <span className="strtt_span"></span>	
                    </div>
                    <p>下单，根据商品要求提交订单，进行相应支付。</p>
                    <img src="/imgs/com/xyjh-strat_2.png" className="str_2" />
                    <div className="str_title">
                        <span className="strtt_span"></span>	
                        <span>2、选择配送方式</span>
                        <span className="strtt_span"></span>	
                    </div>
                    <p>根据商品支持的配送方式进行选择</p>
                    <p className="yello">注：目前平台仅支持收货和还货配送方式一致</p>
                    <img src="/imgs/com/xyjh-strat_3.png" className="str_3" />
                    <div className="str_title">
                        <span className="strtt_span"></span>	
                        <span>租期计算</span>
                        <span className="strtt_span"></span>	
                    </div>
                    <p>从您确认收货的第二天开始计算租期</p>
                    <img src="/imgs/com/xyjh-strat_4.png" className="str_4" />
                    <div className="str_title">
                        <span className="strtt_span"></span>	
                        <span>收货 验收</span>
                        <span className="strtt_span"></span>	
                    </div>
                    <p>收货后</p>
                    <p>1.拍照留存（包装、产品、配件等）</p>
                    <p>2.保留出借方要求的包装和配件</p>
                    <p>避免后续可能产生的纠纷</p>
                    <p className="yello">注：请及时点击“确认收货”，若物流显示到达，而您2天后未确认</p>
                    <p className="yello">则以物流到达时间为准，物流显示签收的第二天开始计算租期</p>
                    <img src="/imgs/com/xyjh-strat_5.png" className="str_5" />
                    <div className="str_title">
                        <span className="strtt_span"></span>	
                        <span>使用</span>
                        <span className="strtt_span"></span>	
                    </div>
                    <p>正常使用租赁商品，如丢失损坏请及时联系对方</p>
                    <img src="/imgs/com/xyjh-strat_6.png" className="str_6" />
                    <div className="str_title">
                        <span className="strtt_span"></span>	
                        <span>归还</span>
                        <span className="strtt_span"></span>	
                    </div>
                    <p>租赁结束后的2天内为正常归还时间</p>
                    <p className="yello">注：逾期后将计算逾期费用，上限为15天</p>
                    <p className="yello">超过15天判定为用户买断</p>
                    <img src="/imgs/com/xyjh-strat_7.png" className="str_7" />
                    <div className="str_title">
                        <span className="strtt_span"></span>	
                        <span>出借方验收，完成订单</span>
                        <span className="strtt_span"></span>	
                    </div>
                    <p>1.确认无误，交易完成</p>
                    <p>2.存在破损，可申请租后流程</p>
                    <p>（双方协商—平台介入—确定赔偿—交易完成）</p>
                    <p className="yello">注：借物方还货后10日内出借方必须完成验收</p>
                    <p className="yello">超过10天，视为借物方归还成功，交易完成</p>
                </div>
            </div>
        )
    }
}
