

import React, {Component} from 'react'
import { List } from 'antd-mobile'
import './index.less'

let Item = List.Item;
let Brief = Item.Brief;

const colors = ['#ff8800','#ff8800','#ff8800','#ff8800','#ff8800',]

class Index extends Component {
    
    constructor() {
        super()
    }

    render() {
        if(this.props.thumb&&this.props.thumb.length==1){
            this.props.thumb = <span className='com-font-img' style={{background: colors[Math.ceil(Math.random()*colors.length)]}}>
                {this.props.thumb}
            </span>
        }
        return (
            <Item {...this.props}>
                {this.props.children}
            </Item>      
        )
    }
}

Index.Brief = Brief;

export default Index;