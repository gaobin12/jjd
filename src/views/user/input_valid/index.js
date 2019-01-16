
import './style.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Tap } from 'COMPONENT'
import { Modal } from 'SERVICE'

@withRouter
export default class InputValid extends React.Component {
    
    static defaultProps = {
        length: 6,
        type: 'password',
        visible: false,
    }
    static propTypes = {
        className: PropTypes.string,
        length: PropTypes.number,//长度
        type: PropTypes.string,//类型
    }
    constructor(props) {
        document.title = '交易密码'
        super(props);
        this.state = {
            values: '' //存储值
        };
    }

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
                // 校验交易密码
                $.ajaxE({
                    type: 'GET',
                    url: '/user/info/checkPaypwdBeforeModifyTel',
                    data: {
                        password: $.md5($.md5(values)),
                    }
                }).then((data) => {
                    _this.props.history.push({
                        pathname: location.query.pathname,
                        query: { pwd: $.md5($.md5(values)) }
                    })
                }).catch((msg) => {
                    Modal.infoX(msg)
                })
                //清空            
                _this.setState({
                    values: ''
                })
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

    render() {
        let { values } = this.state,
            { className, length, type } = this.props,
            inputs = [];
        for (let i = 0; i < length; i++) {
            inputs.push(i)
        }
        return (
            <div className='view-input-valid-sp'>
                <h4>请输入您的交易密码</h4>
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