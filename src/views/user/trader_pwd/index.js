
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tap } from 'COMPONENT'
import { Modal, Loading } from 'SERVICE'

export default class InputValid extends React.Component {
    static defaultProps = {
        length: 6,
        type: 'password',
        visible: false,
    }
    static propTypes = {
        className: React.PropTypes.string,
        length: React.PropTypes.number,//长度
        type: React.PropTypes.string,//类型
    }
    constructor(props) {
        document.title = '交易密码'
        super(props);
        let { state } = this.props.location;
        this.state = {
            values: '',//存储值
            tips: '重新发送（60）',//验证码提示信息
        };
    }

    componentDidMount() {
     

    }
    //提交表单
    onSetVal = (value) => {
        let _this = this;
        let { values } = this.state;
        let { length, onEnd, location } = this.props;
        values += value;

        this.setState({
            values
        })
        setTimeout(() => {
            if (values.length == length) {
            //    处理逻辑
            }
        }, 200)
    }

    onDeltVal = (type) => {
        let { values } = this.state;
        if (values == '') return
        if (type == 'all') {
            values = ''
        } else {
            values = values.substr(0, values.length - 1)
        }
        this.setState({ values })
    }
    //发送验证码
    onSendValid = () => {
        let that = this
        if (!this.state.enableVoice) {
            return;
        }

        // //发送验证码
        // $.ajaxE({
        //     type: 'GET',
        //     url: '/user/info/getTelCode',
        //     data: {
        //         telephone: this.state.telephone,
        //         telCodeType: 0
        //     }
        // }).then((data) => {
        //     Modal.infoX('请输入您的注册手机号收到的短信验证码');
        //     this.setState({
        //         enableVoice: false,
        //         ntipsLeft: 60,
        //         interval: window.setInterval(that.getVoiceTips, 1000)
        //     })

        // }).catch((msg) => {
        //     Modal.infoX(msg);
        // })
    }


 
    // 销毁
    componentWillUnmount() {
        window.clearInterval(this.state.interval);
    }

    render() {
        let { values } = this.state,
            { className, length, type } = this.props,
            inputs = [];
        for (let i = 0; i < length; i++) {
            inputs.push(i)
        }
        return (
            <div className='view-input-trader-code'>
                <div className="login-jjd">
                    请输入交易密码
                </div>
                {/* <h4 className="al-send pt57">已发送验证码到</h4> */}
                <h4 className="al-send">{this.state.telephone}</h4>


                <div className={className ? className + ' common-inputvalid' : 'common-inputvalid'}>
                    {inputs.map((ele, index) => {
                        return <input readOnly ref={'input' + index} type={type && values[index] ? type : 'number'} value={values[index] || ''}
                            key={'valid' + index} />
                    })}
                </div>
                

                <div className='input-board'>
                    <Tap onTap={() => { this.onSetVal(1) }}>1</Tap>
                    <Tap onTap={() => { this.onSetVal(2) }}>2</Tap>
                    <Tap onTap={() => { this.onSetVal(3) }}>3</Tap>
                    <Tap onTap={() => { this.onSetVal(4) }}>4</Tap>
                    <Tap onTap={() => { this.onSetVal(5) }}>5</Tap>
                    <Tap onTap={() => { this.onSetVal(6) }}>6</Tap>
                    <Tap onTap={() => { this.onSetVal(7) }}>7</Tap>
                    <Tap onTap={() => { this.onSetVal(8) }}>8</Tap>
                    <Tap onTap={() => { this.onSetVal(9) }}>9</Tap>
                    <Tap onTap={() => { this.onDeltVal('all') }}>
                        <img src={'/imgs/com/rev-num_del.png'} />
                    </Tap>
                    <Tap onTap={() => { this.onSetVal(0) }}>0</Tap>
                    <Tap onTap={() => { this.onDeltVal('one') }}>
                        <img src={'/imgs/com/rev-num_cha.png'} />
                    </Tap>
                </div>
            </div>
        );
    }
}