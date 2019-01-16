

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Tappable from 'react-tappable'

export default class Tap extends Component {
    //属性
    static propTypes = {
        className: PropTypes.string,
        onTap: PropTypes.func
    }
    constructor() {
        super()
    }

    render() {
        return (
            <Tappable className={this.props.className} activeDelay={100}
             stopPropagation={true} onTap={this.props.onTap}>
                {this.props.children}
            </Tappable>      
        )
    }
}