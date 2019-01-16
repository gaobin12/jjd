

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { List } from 'antd-mobile'
import Item from './Item'

class Index extends Component {
    //属性
    static propTypes = {
        className: PropTypes.string,
    }
    constructor() {
        super()
    }

    render() {
        return (
            <List className = {this.props.className}>
                {this.props.children}
            </List>      
        )
    }
}

Index.Item = Item;
Index.Brief = Item.Brief

export default Index