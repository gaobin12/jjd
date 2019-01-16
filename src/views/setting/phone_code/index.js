//手机号验证码
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { List, InputItem, Button, Toast } from 'antd-mobile'
import { createForm } from 'rc-form'
import { CountDown } from 'COMPONENT'
import { Modal } from 'SERVICE'

@withRouter
class App extends Component {
	constructor (props, context) {
		document.title = "手机号验证码";
		super(props, context)
		const userInfo = $.getUserInfo();
		this.state = {
			phoneNumber:userInfo.telephone,
			tips:'收不到短信 ? 获取语音验证码',
			tips1:'语音验证码',
			getVoice_msg_staus:false,
			phone_code_number:''			
		};
	}
	componentDidMount(){
   
	}

	//下一步//获取手机验证码	
	nextStep=()=>{
       let {phone_code_number ,phoneNumber,  tips,tips1 } = this.state;
		this.props.form.validateFields((error,values) => {
			if (!error) {
				$.ajaxE({
					type: 'GET',
					url: '/user/info/checkSMSCodeBeforeModifyPayPass',					
					data: {
						mobileCode:values.phone_code_number
					}
				}).then((data)=>{
					this.props.history.push({
						pathname: '/user/input_valid2',
						query: {
							pathname: '/setting/phone_code',
							mobileCode:values.phone_code_number
						}
					});			

				}).catch((msg)=>{
					//输入的验证码有误，重新输入
					Modal.infoX(msg);
					
				})
			}
		});
	
	}

	//获取音频验证码
	getVoiceMsg=()=>{
		///user/info/getVoiceCode
		this.setState({
			getVoice_msg_staus:true,
			tips:'语音验证码'
		})

	}

	//获取验证码
	onSendMsg=()=>{
        const userInfo = $.getUserInfo();
		//修改支付密码之前校验用户的短信验证码
        //验证码状态修改
		$.ajaxE({
            type: 'GET',
			url: '/user/info/getTelCode',			
            data: {
				telephone :userInfo.telephone,//手机号
                telCodeType:3 //获取验证码类型 0.注册 1.修改手机号 2.修改交易密码 3.重置密码                
            }
        }).then((data)=>{
        }).catch((msg)=>{
        //获取验证码失败，请重新获取！ 
		 Modal.infoX(msg); 
        })
	}

	render () {
		let {phoneNumber ,tips,InputValid_staus,getVoice_msg_staus,tips1 } = this.state;
		const { getFieldProps, getFieldError } = this.props.form;
		return (
		
		<div className='view-setting'>
			{/* <h1>手机号验证码</h1> */}
			
			{/* <div className='tip' style={{marginLeft:10,color: '#999'}}>验证码已发送至尾号 {this.state.phoneNumber} 的手机</div> */}
			<div className='tip' >验证码已发送至尾号 {phoneNumber?phoneNumber.slice(7,11):null} 的手机</div>
			<div className="yzm-code">
				<InputItem
                   type="text"
                   onFocus = {$.clearErrors.bind(this,'phone_code_number')}
					{...getFieldProps('phone_code_number',{
						initialValue: this.state.phone_code_number,
						rules: [
							{ required: true, message: '请输入验证码' },
                        ],
                        validateTrigger:'onBlur'
					})}
					clear
					type="number"
					placeholder="请输入验证码">
					验证码
				</InputItem>
				
				<div className="getCode">
					<CountDown  onSend={this.onSendMsg} />
				</div>
			</div>
            <div className='common-jc-error'>{getFieldError('phone_code_number') && getFieldError('phone_code_number').join(',')}</div>

			{
				
				getVoice_msg_staus?
                <div > <div className="clear dispaly-test"><p className="test_verigy"   ><span onClick={this.getVoiceMsg}>{tips1}<div className=""> <CountDown  onSend={this.onSendMsg} /></div></span></p></div></div>
				 :
				<div> <div className="clear dispaly-test"><p className="test_verigy" ><span onClick={this.getVoiceMsg}>{tips}</span></p></div></div>
			}
			<Button type="primary" onClick={this.nextStep}>下一步</Button>
			 {/* <div>
             <InputValid visible={InputValid_staus} onEnd={this.onPwdConfirm}/>
             </div> */}
				
		</div>


			// {/* <div className="group first">
			// <div className="row no_befroe">
			//     <div className="flex">验证码</div>
			//     <div className="right_input">
			//         <input v-model="code" type="text" placeholder="请输入验证码" className="toched dirty" />
			//         <button  className="get_code next margin " v-if="allow" onClick={this.getCode} style = {with:3 3.3%} >获取验证码</button>

			//         <button  className="get_code next margin disabled" v-else onClick={this.getCode} style={width: 33.3%}>{{text }}</button>
			//     </div>
			//     </div> */}
			
		)
	}
}

export default createForm()(App);