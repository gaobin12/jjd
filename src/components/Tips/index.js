
import './style.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Loading, Modal } from 'SERVICE'
import Tap from 'COMPONENT/Tap'

export default class Tips extends React.Component {
    static defaultProps = {
        title: '提示',
        footer: '知道了',
        className: '',
    }
    static propTypes = {        
		className: PropTypes.string,
		title: PropTypes.string,
		footer: PropTypes.string,
    }
    constructor(props,context) {
        super(props,context);
        this.state = {
            visible: false//显示隐藏
        };
    }
    componentDidMount(){
        
    }
    onGoCreditReportRevision=() =>{
        this.props.history.push({
            pathname: '/credit'
        })
    }
    onOpen=() =>{
        let { title, footer, className } = this.props;
        Modal.alertX(title, this.props.children)
        // this.setState({
        //     visible: true
        // })
    }
    // onClose=()=>{
    //     this.setState({
    //         visible: false
    //     })
    // }
    render() {
        let { title, footer, className } = this.props;
        let { visible } = this.state;
        return (
            <div className={'common-icon-tips'}>
                <Tap onTap={this.onOpen}><img className='icon-tip' src={'/imgs/com/feedback.svg'} /></Tap>
                {/* <Modal 
                    transitionName='fade'
                    className='common-tips-modal'
                    transparent
                    maskClosable={false}
                    visible={visible}
                    title={title}
                    footer={[{ text: footer, onPress: this.onClose }]}>
                    <div className={className}>
                        {this.props.children}
                    </div>
                </Modal> */}
            </div>
        );
    }
}

