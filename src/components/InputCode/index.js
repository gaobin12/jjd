
import './style.less'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Button, WingBlank, Icon  } from 'antd-mobile'
import { Loading, Modal } from 'SERVICE'
import Tap from 'COMPONENT/Tap'
import CountDown from 'COMPONENT/CountDown'

export default class InputCode extends React.Component {
    static defaultProps = {
		length: 6,
        type: 'text',
        visible: false,
        showTip: false,
        onClose: ()=>{},
    }
    static propTypes = {
		className: PropTypes.string,
		length: PropTypes.number,//长度
        type: PropTypes.string,//类型
        onEnd: PropTypes.func,//   回调   参数true则验证成功 
        visible: PropTypes.bool,//显示隐藏
        showTip: PropTypes.bool,//显示验证交易密码界面，定时结束
    }
    constructor(props) {
        super(props);
        this.state = {
            values: '' //存储值
        };
    }
    
    onSetVal = (value)=>{
        let {values} = this.state;
        let { length } = this.props;
        values+=value;
        this.setState({
            values
        },()=>{
            if(values.length==length){
                this.onValidCode()
            }
        })
    }
    
    onDeltVal=(type)=>{
        let {values} = this.state;
        if(values=='')return
        if(type=='all'){
            values = ''
        }else{
            values=values.substr(0,values.length-1)
        }
        this.setState({values})
    } 
    onSendValid(){  
    }
    //验证验证码
    onValidCode=()=>{
        let { values } = this.state;
        if(values.length<6){
            Modal.infoX('请输入验证码！')         
            this.setState({
                values:'',
                next: false
            })
            return
        }        
        this.setState({
            values,
            showTip: true,
            next: false,
        })
    }
    render() {
        let { values, showTip } = this.state,
            { className, type, length, visible, onClose, }= this.props,
            inputs = [];
        for(let i=0;i<length;i++){
            inputs.push(i)
        }
        return (
        <WingBlank>
            <Modal
                popup
                onClose={onClose}
                closable = {onClose?true:false}
                visible={visible}
                animationType="slide-up"
                className='common-inputvalid-p-code'>
                {showTip?
                    <span className={'modal-pay-tip'}>
                        <h4>验证交易密码</h4>
                        {this.state.next?
                            <span>
                                <img className='tips-loading' src='imgs/pay/right.svg' />
                                <p className='tip'>验证成功</p>
                                <span style={{display:'none'}}>{setTimeout(()=>{
                                    let { onEnd } = this.props,
                                        values = this.state.values;
                                    if(values == '')return
                                    onEnd&&onEnd(values);  //返回验证码
                                    this.setState({values:''})
                                },500)}</span>
                            </span>
                            :<span>
                                <img className='tips-loading' src='imgs/pay/wait.svg' />
                                <p className='tip'>正在验证，请不要离开</p>
                                <span style={{display:'none'}}>{setTimeout(()=>{
                                    this.setState({
                                        next: true
                                    })
                                },2000)}</span>
                            </span>}
                        <div>
                            <p className='tips'>今借到平台自身不放款，只提供信息服务</p>
                            <p className='tips'>您需要把自己的借贷信息分享给他人知道</p>
                        </div>
                    </span>
                :<span>
                    <h4>请输入验证码</h4>
                    <div className={className?className+' common-inputvalid':'common-inputvalid'}>
                        {inputs.map((ele,index)=>{
                            return <input readOnly ref={'input'+index} type={type&&values[index]?type:'number'} value={values[index]||''} 
                            key={'valid'+index} />
                        })}
                        
                        <CountDown className="verigy_span" onSend={this.onSendValid} auto={visible}/>
                    </div>
                    <div className='input-board'>
                        <Tap onTap={()=>{this.onSetVal(1)}}>1</Tap>
                        <Tap onTap={()=>{this.onSetVal(2)}}>2</Tap>
                        <Tap onTap={()=>{this.onSetVal(3)}}>3</Tap>
                        <Tap onTap={()=>{this.onSetVal(4)}}>4</Tap>
                        <Tap onTap={()=>{this.onSetVal(5)}}>5</Tap>
                        <Tap onTap={()=>{this.onSetVal(6)}}>6</Tap>
                        <Tap onTap={()=>{this.onSetVal(7)}}>7</Tap>
                        <Tap onTap={()=>{this.onSetVal(8)}}>8</Tap>
                        <Tap onTap={()=>{this.onSetVal(9)}}>9</Tap>
                        <Tap onTap={()=>{this.onDeltVal('all')}}>
                            <img src={'/imgs/com/rev-num_del.png'} />
                        </Tap>
                        <Tap onTap={()=>{this.onSetVal(0)}}>0</Tap>
                        <Tap onTap={()=>{this.onDeltVal('one')}}>
                            <img src={'/imgs/com/rev-num_cha.png'} />
                        </Tap>
                    </div>
                </span>}
            </Modal>
        </WingBlank>
        );
    }
}