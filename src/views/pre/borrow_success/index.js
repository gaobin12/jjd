//首页 => 我要借款=>创建成功
import '../form.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { List,Flex } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Tap,Side } from 'COMPONENT'

@withRouter
@inject('userStore','preBorrowStore')
@observer
class Page extends Component {
	constructor (props, context) {
		document.title = "创建成功";
		super(props, context)
		this.state = {
		};
	}

	componentDidMount(){
        const { preBorrowStore:{form} } = this.props;
        // //设置分享数据
        // userStore.setShareInfo({
        //     id:this.state.id,
        //     path:'/pre/borrow_detail',
        //     amt:Math.round(form.amount/100),
        //     purpose: form.purposeTxt,
        //     date:form.createTimeTxt+'-'+form.repayTimeTxt,
        //     rate:form.interestRate,
        // });

        debugger;
        //微信分享
        $.setItem('wx_share',{
            id:this.state.id,
            path:'/pre/borrow_detail',
            amt:form.amount,
            purpose: form.use.value,
            time:'',
            rate:form.rate,
            param: {
                loanType: 1,
                loanTypeStr: '求借款',
                creatorType: '借款人',
                rate: form.rate,
                creatorName: '',
                repayDate: '',
                repayType: $.repayType(form.repayType),
            }
        });
    }

    onShare=()=>{
        this.props.history.push({
            pathname: '/user/share'
        });
    }
  
	render() {
        const { userStore,preBorrowStore:{form}} = this.props;
		return (
            <div className="view-iou-form" style={{paddingBottom:'50px'}}>
                <div style={{height: '100%',overflow:'auto'}}>		
                    <img src={'/imgs/iou/borrow-success.svg'} className="succ-img" />
                    <p className="succ-font">创建成功</p>

                    <Flex className="succ-table-flex" justify="between">
                        <Flex.Item>借款金额</Flex.Item>
                        <Flex.Item>{form.amount}元</Flex.Item>
                    </Flex>
                    <Flex className="succ-table-flex" justify="between">
                        <Flex.Item>剩余有效期</Flex.Item>
                        <Flex.Item>3天</Flex.Item>
                    </Flex>

                    <Side>
                        <p>为什么要邀请出借人/担保人</p>
                        <p>正常情况下提现后立即到账;如遇特殊情况,请耐心等待银行结果</p>
                        <p>如果求借款筹满/筹款超过3天/还款时间到期,借款将自动关闭</p>
                        <p>当前求借款未关闭,不得发起新的求借款</p>
                        <p>平台收取手续费=借款金额*1%,用于支付借款期间产生的转账</p>
                    </Side>

                </div>
                <div className="common-btn_box">         
                    <Tap className='span font16' onTap={this.onShare}>
                        邀请担保人
                    </Tap>	
                    <Tap className='c-black span font16 active'>
                        邀请出借人
                    </Tap>
                </div>
            </div>
		);
	}
}

export default createForm()(Page)
