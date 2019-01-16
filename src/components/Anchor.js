
import React, {Component} from 'react'
import PropTypes from 'prop-types'

class Anchor extends Component {
    //属性
    static propTypes = {
        id: PropTypes.string
    }
    constructor() {
        super()
    }

    componentDidMount() {
        if($.anchorId && $.anchorId===this.props.id){
            let ele = document.getElementById(this.props.id);
            if(ele){
                //页面定位到相应的锚点
                ele.scrollIntoView();
            }
        }
    }

    render() {
        return (
            <span id={this.props.id} style={{width:0,height:0}}>
            </span>
        )
    }
}

export default Anchor
