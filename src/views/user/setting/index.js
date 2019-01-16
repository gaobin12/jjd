
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'

@withRouter
export default class Page extends Component {
  constructor (props, context) {
      document.title = "设置";   
      super(props, context)
      this.state = {      
      };
  }
  render () {
    return (
      <div className="view-user-setting">
			<div className="text-cell" style={{ paddingRight: "0.35rem"}}>
				<span>更换手机号码</span>
				{/* <span>请选择所在城市</span> */}
				<i className="rightBtn" style={{ right: "0.2rem"}}></i>
			</div>
			<div className="text-cell" style={{ paddingRight: "0.35rem" }}>
				<span>修改登录密码</span>
				{/* <span>请选择所在城市</span> */}
				<i className="rightBtn" style={{ right: "0.2rem" }}></i>
			</div>
			<div className="text-cell last" style={{ paddingRight: "0.35rem" }}>
				<span>修改交易密码</span>
				{/* <span>请选择所在城市</span> */}
				<i className="rightBtn" style={{ right: "0.2rem" }}></i>
			</div>						
			
			<div className="text-cell last" style={{ paddingRight: "0.35rem",marginTop:"0.1rem" }}>
				<span>关于我们</span>
				{/* <span>请选择所在城市</span> */}
				<i className="rightBtn" style={{ right: "0.2rem" }}></i>
			</div>		
			

      </div>
    )
  }
}
