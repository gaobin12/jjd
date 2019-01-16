
//地址管理
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'

@withRouter
export default class App extends Component {
  constructor (props, context) {
    document.title = "地址管理";
    super(props, context)
    this.state = {
    };
    //this.renderTree = renderTree.bind(this)
  }

  render () {
    return (
      <div className='view-address'>
        <h1>地址管理</h1>
      </div>
    )
  }
}
