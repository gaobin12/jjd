//更换交易密码
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { List, InputItem, Toast } from 'antd-mobile'
import { createForm } from 'rc-form';
import {Tap} from 'COMPONENT'
import { Loading, Modal,util } from 'SERVICE'

@withRouter
@inject('userStore')
@observer
class BasicInput extends Component {
	constructor (props, context) {
        document.title = "校验身份信息";
        super(props, context)
        let query=this.props.location.query;
		this.state = {
			value: 1,
			account_name:'',
			account_ID:'',
            account_bank_ID:'',
            pathType:query.pathType||"",
            pathname:query.pathname||"",
		};
    }
    
    componentDidMount() { 
     
    }

   

	//点击认证
	onNextStep=()=>{
		this.props.form.validateFields({ force: true }, (error,values) => {
			if (!error) {
                 if (this.check_data(values)){
                    this.checkUser(values);
                }
			}
		});
    }
    //检查数据的合法性
    check_data=(v)=>{
        if(v.account_name.length == 0){
            this.show_toast('请输入有效姓名！');
            return false;
        }else if(v.account_ID.length != 18){
            this.show_toast('身份证号码长度有误！');
            return false;
        }else if(v.account_bank_ID == 0){
            this.show_toast('银行卡号长度有误！');
            return false;
        }
        return true;

    }

	//修改支付密码之前校验用户
    checkUser=(v)=>{
        let account_banks="";
        let account_phones="";
        if(v.account_bank_ID){
            account_banks=v.account_bank_ID
        }
        if(v.account_phone){
            account_phones=v.account_phone
        }
        $.ajaxE({
            type: 'POST',
            url: '/user/info/checkBeforeModifyPayPass',
            data: {
                fullname:v.account_name,
                idcardNo:v.account_ID,
                bankCard:account_banks,
                telephone:account_phones,
            }
        }).then((data)=>{
            if(this.state.pathname){
                //组件inputvalid  跳转过来
                this.props.history.push({
                    pathname: '/setting/valid/2',
                    query: {
                        pathname: this.state.pathname
                    }
                })
                return
            }

            if(this.state.pathType){
                this.props.history.push({
                    pathname: '/user/input_valid2',
                    query: {
                        pathType: 4
                    }
                });
            }else{
                //验证成功
                this.props.history.push({
                    pathname: '/setting/valid/2'
                });
            }
			
        }).catch((msg)=>{
            Modal.infoX(msg);
        })
    }

//提示框
  show_toast=(title)=>{
    Toast.info(title, 2)
  }
	render() {		
		const { getFieldProps, getFieldError } = this.props.form;
		return (
			<div className="view-setting-changeTrade" >
		
			<List renderHeader={() => ''}>
				<InputItem
                    type="text"
					{...getFieldProps('account_name', {
						initialValue: this.state.account_name,
						rules: [
							{ required: true, message: '请输入姓名' },
                        ],
                        validateTrigger:'onBlur'
                    })}
                    
					clear
					placeholder="请输入姓名">姓名</InputItem>
				<div className='common-jc-error'>{getFieldError('account_name') && getFieldError('account_name').join(',')}</div>

                <InputItem 
                    type="text"
					{...getFieldProps('account_ID',{
						initialValue:this.state.account_ID,
						rules:[
							{ required: true, message: '请输入身份证号' },
                        ],
                        validateTrigger:'onBlur'
                    })} 
					clear
					placeholder="请输入身份证号" >
					身份证号
				</InputItem>
				<div className='common-jc-error'>{getFieldError('account_ID') && getFieldError('account_ID').join(',')}</div>


				</List>  
                <List renderHeader={() => ''}>
                    <InputItem 
                    type="text"
                    {...getFieldProps('account_phone',{
                        rules:[
                        { required: true, message: '请输入手机号' },
                        ],
                        validateTrigger:'onBlur'
                    })} 
                    clear
                    placeholder="请输入手机号" >
                    手机号
                    </InputItem>
                    <div className='common-jc-error'>{getFieldError('account_phone') && getFieldError('account_phone').join(',')}</div>
                </List>
				
				
                
                <div className='common-btn_box'>
                    <Tap className='c-black span font16 active' onTap={this.onNextStep}>下一步</Tap>
                </div>
			</div>
		);
	}
}

export default createForm()(BasicInput)
