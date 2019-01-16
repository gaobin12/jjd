// =>重置密码1

import './index.less'
import React, { 
  Component,PropTypes 
} from 'react'
import { 
  List, InputItem, Toast, Button, WhiteSpace, WingBlank   
} from 'antd-mobile';
import { 
  createForm 
} from 'rc-form';
import { Tap } from 'COMPONENT'


class Page extends Component {
  
  constructor (props, context) {
      document.title = "重置密码";   
      super(props, context)
      this.state = {      
      };
  }
  //点击事件
  onTapp = (v) => {

  }


  render () {
    const { getFieldProps, getFieldError  } = this.props.form;
    return (
      <div className="view-user-password">
        {/* 重置密码1 */}
                <div className="top-title">
                    您正在重置密码
                </div>
              {/* 输入手机号和密码 */}
              <List >
                  <InputItem
                    {...getFieldProps('photo', {
                      // initialValue: this.state.c_house_address,
                      rules: [{ required: true, message: '*请输入11位手机号码' }],
                      validateTrigger:'onBlur'
                    })}
                    onFocus = {$.clearErrors.bind(this,'photo')}
                    type="number"
                    clear
                    placeholder="请输入手机号"
                  ></InputItem>
                  <div className='common-jc-error'>{getFieldError('photo') && getFieldError('photo').join(',')}</div>

                  <div className="pic-code-box">
                    <InputItem
                      {...getFieldProps('pic_code', {
                        // initialValue: this.state.c_house_address,
                        rules: [{ required: true, message: '*请输入正确的图片验证码' }],
                        validateTrigger:'onBlur'
                      })}
                      onFocus = {$.clearErrors.bind(this,'pic_code')}
                      type="number"
                      clear
                      placeholder="请输入图片验证码"
                    ></InputItem>
                    <div className="img">
                      <img src={'/imgs/com/2018-04-19_132707.jpg'} alt="" />
                    </div>
                </div>
                <div className='common-jc-error'>{getFieldError('pic_code') && getFieldError('pic_code').join(',')}</div>
              </List>
              {/* 按钮 */}
            <Tap onTap={() => { this.onTapp(123) }}>
                  <WingBlank>
                    <Button type="primary">获取手机验证码</Button><WhiteSpace />  
                  </WingBlank>
            </Tap>     
           
      </div>
    )
  }
}

export default createForm()(Page);
