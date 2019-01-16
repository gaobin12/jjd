
// 银行卡主页（列表） => 银行卡详情
import '../index/index.less'
import '../card.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List, Button, Flex } from 'antd-mobile';
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Loading, Modal } from 'SERVICE'
import { InputValid, Tap } from 'COMPONENT'
const Item = List.Item;

@withRouter
@inject('userStore','bankStore')
@observer
export default class App extends Component {
	constructor(props, context) {
		document.title = "银行卡详情";
		super(props, context)
		let query = this.props.location.query;
		this.state = {
			isPayPasswdShow:false, // 是否显示支付密码组件
		};
	}

	componentDidMount() {

	}
	
	//解绑银行卡
	unbundle=()=>{
		let that=this;
		Modal.alertX('提醒', '确认删除尾号' + this.props.bankStore.currentBank.bankAccount + '的银行卡吗', [
			{ text: '不删除', onPress: () => console.log('cancel') },
			{ text: '删除', onPress: () => {

				that.setState({
					isPayPasswdShow: true, // 显示支付密码组件
				});

			} },
		])
		
    }
    //删除银行卡
	verifyPasswd=(value)=>{
		let _this=this;
		$.ajaxE( {
			type: 'POST',
			url: '/user/bindCard/delBindCard',
			data: {
				bindBankId: this.props.bankStore.currentBank.id,
				payPassword: value,
			}
		}).then((data) => {
			//解绑成功，进入列表页
			_this.props.history.push({
				pathname: '/card',
			});			

		}).catch((msg) => {
            Modal.infoX(msg);
		});

	}
	render() {
        let {currentBank}=this.props.bankStore;
		return (
			<div className='view-card'>
                <div className={'bank_card '+currentBank.bgcolor}>
                    <div className="name">
                        <img src={'/imgs/bank/'+currentBank.logo} className="bank-img"/>
                        <span>{currentBank.bankName}</span>
                    </div>
                    <div className="number">
                        *** **** **** {currentBank.bankAccount}
                    </div>
                    <div className="posi-font">储蓄卡</div>
                    <div className="posi-img">
                        <img src={'/imgs/bank/'+currentBank.bgimg} />
                    </div>
                </div>
                {currentBank.validState?<List renderHeader={() => '管理银行卡'} className="my-list">
					<Link to={'/card/change_bankphone'}>
						<Item arrow="horizontal" >更换预留手机号</Item>
					</Link>
					<Link to={'/card/cash'}>
						<Item arrow="horizontal" >提现</Item>
					</Link>
                    <Tap onTap={this.unbundle}>
						<Item arrow="horizontal" >解绑</Item>
					</Tap>
				</List>:null}

				{/*支付密码组件*/}
				{/* <InputValid 
						visible={isPayPasswdShow} 
					onEnd={(e) => { this.setState({ isPayPasswdShow: false }); this.verifyPasswd(e) }} 
						onClose={() => { this.setState({ isPayPasswdShow: false }); }} 
				/> */}


			</div>
		)
	}
}


