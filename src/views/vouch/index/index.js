
//担保
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { List, InputItem, Checkbox, Button } from 'antd-mobile'
import { createForm } from 'rc-form'

const AgreeItem = Checkbox.AgreeItem

@withRouter
const page = class App extends Component {
  constructor (props, context) {
    document.title = "作担保";   
    super(props, context)
    this.state = {      
    };
    //this.renderTree = renderTree.bind(this)
  }

  render () {
	const { getFieldProps } = this.props.form;
    return (
		<div className='view-vouch'>
			<List>
			<InputItem
        {...getFieldProps('corpus', {
            rules: [{ required: true, message: '请输入整数' }],
            validateTrigger:'onBlur'
        })}
        onFocus = {$.clearErrors.bind(this,'corpus')}
        type="text"
        placeholder="请输入整数"
        clear
        extra="元">借款金额
      </InputItem>
      <div className="money">预计收益<span>0</span>元</div>
			</List>
      <div className="mat10">
        <List>
            <Link to="/iou/use">
              <List.Item arrow="horizontal" extra="点击选择出借人">
              帮找出借人
              </List.Item>
            </Link>          
        </List>
      </div>
			<AgreeItem>
				已阅读并同意 <Link to="/agree/iou">《今借到借款协议》</Link>
			</AgreeItem>
      <div className="hint">
					提示
          <p> 1、请务必确保借款人是您熟知并信得过的人；</p>
					<p>  2、如果借款人逾期不还，您需要为其垫付；</p>
					<p>  3、扩散消息给您的好友，帮TA借到才能获得担保收益。</p>
			</div>

			<List className="bottom-btn">
			<Button type="primary">确定</Button>
			</List> 
		</div>
    )
  }
}

export default createForm()(page);
