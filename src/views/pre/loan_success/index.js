//首页 => 申请出借 =>申请成功
import '../form.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { List,Flex } from 'antd-mobile'
import { Tap } from 'COMPONENT'

@withRouter
@inject('userStore','preLoanStore')
@observer
export default class Page extends Component {

	constructor (props, context) {
		document.title = "申请成功";
		super(props, context)
		this.state = {
		};
	}

	componentDidMount(){
    }

    onTap=()=>{
        this.props.history.push('/');
    }
  
	render() {
        const { preLoanStore:{form} } = this.props;
		return (
            <div className="view-iou-form" style={{paddingBottom:'50px'}}>
                <div style={{height: '100%',overflow:'auto'}}>		
                    <img src={'/imgs/iou/loan-success.svg'} className="succ-img" />
                    <p className="succ-font">申请成功</p>

                    <Flex className="succ-table-flex" justify="between">
                        <Flex.Item>借款金额</Flex.Item>
                        <Flex.Item>{form.amount}元</Flex.Item>
                    </Flex>
                    <Flex className="succ-table-flex" justify="between">
                        <Flex.Item>剩余有效期</Flex.Item>
                        <Flex.Item>3天</Flex.Item>
                    </Flex>
                    <Flex className="succ-table-flex no-line" justify="center">
                        <span className="font12 fontC4">5秒后自动跳转</span>
                    </Flex>
                </div>
                <div className="common-btn_box">         
                    <Tap className='c-black span font16 active' onTap={this.onTap}>
                        完成
                    </Tap>
                </div>
            </div>
		);
	}
}
