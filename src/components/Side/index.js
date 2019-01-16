
import './style.less'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Tap from '../Tap'

export default class Side extends React.Component {
    static propTypes = {        
		titleText: PropTypes.string,
    }
    constructor(props,context) {
        super(props,context);
        this.state = {
            isSide:false
        };
    }
    componentDidMount(){
        
    }
    render() {
        return (
            <div>
                <div className={this.state.isSide?"com-tipe-div active":"com-tipe-div"}>
                    <div className="com-tipe">
                        <p>{this.props.children}</p>
                    </div>
                </div>
                <div className="com_side_up_div">
                    <Tap className={this.state.isSide?"com_side_up active":"com_side_up"} 
                        onTap={()=>{this.setState({isSide:!this.state.isSide})}}>
                        <img src={'/imgs/credit/side.svg'} />
                    </Tap>
                </div>
            </div>
        );
    }
}

