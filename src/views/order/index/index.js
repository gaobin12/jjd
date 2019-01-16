
//订单
import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class App extends Component {
  constructor (props, context) {
    document.title = "订单";   
    super(props, context)
    this.state = {      
    };
    //this.renderTree = renderTree.bind(this)
  }

  render () {
    return (
      <div className='view-order'>
        <h1>订单</h1>
      </div>
    )
  }
}
