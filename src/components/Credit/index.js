
import './style.less'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { Button } from 'antd-mobile'
import { Loading, Modal } from 'SERVICE'
import Tap from '../Tap'

@withRouter
export default class Credit extends Component {
    static propTypes = {        
        className: PropTypes.string,
        visible: PropTypes.bool,//如果传入visible  ，则state  无用
        onSlide: PropTypes.func,//如果传入点击事件，触发
    }
    constructor(props,context) {
        super(props,context);
        this.state = {
            visible: false//显示隐藏
        };
    }
    componentDidUpdate(){
        this.setBtn()
    }
    componentDidMount(){
        this.setBtn()
    }
    setBtn=()=>{
        let { visible } = this.state;
        if(this.props.visible===false||this.props.visible===true) visible = this.props.visible
        if(visible&&!document.getElementById('credit-close')){
            let btn = document.createElement('img');
            btn.id='credit-close';
            btn.className='credit-close';
            btn.style.top='2.80rem';
            btn.src='/imgs/com/rev-upxy-btn1.png';
            btn.ontouchend = this.onClose;
            document.getElementById('jCredit').appendChild(btn);
        }
        // <Tap onTap={this.onClose}>
        //     <img className='credit-close' style={{top: '2.77rem'}} src={'/imgs/com/rev-upxy-btn1.png'} />
        // </Tap>
    }
    onGoCreditReportRevision=()=>{
        this.props.history.push({
            pathname: '/credit'
        })
    }
    onOpen=()=>{
        if(this.props.onSlide)this.props.onSlide()
        this.setState({
            visible: true
        })
    }
    onClose=()=>{
        if(this.props.onSlide)this.props.onSlide()
        this.setState({
            visible: false
        })
    }
    render() {
        let { visible } = this.state;
        if(this.props.visible===false||this.props.visible===true) visible = this.props.visible
        return (
            <div className='common-credit-report'>
                <Modal className='common-credit-box common-credit-report'
                    popup
                    visible={visible}
                    animationType="slide-down"
                >
                    <div className='common-credit-report-in'>
                        <div ref={ref=>{this.box=ref}} id='jCredit'>
                            <p>为了保证借贷安全，请您在借款和出借前完成</p>
                            <img src={'/imgs/com/rev-home-page7.png'} />
                            <h3>信用报告认证</h3>
                            <p>用于展示您的信用状况，提高借贷效率</p>
                            <Tap onTap={this.onGoCreditReportRevision}><Button type="primary">去认证</Button></Tap>
                        </div>
                    </div>
                </Modal>
                {visible?null:<Tap onTap={this.onOpen}>
                    <img className='credit-close' style={{top: 0}} src={'/imgs/com/rev-upxy-btn2.png'} />
                </Tap>}
            </div>
        );
    }
}

