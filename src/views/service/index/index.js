
//客服
import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class App extends Component {
  constructor (props, context) {
    document.title = "客服";
    super(props, context)
    this.state = {
    };
    //this.renderTree = renderTree.bind(this)
  }

  render () {
    return (
      <div className='view-service'>
        <h1>客服</h1>
      </div>
    )
  }
}
