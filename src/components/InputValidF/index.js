
import './style.less'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { WingBlank } from 'antd-mobile'
import { Loading, Modal } from 'SERVICE'
import Tap from '../Tap'

let timer=null;

export default class InputValidF extends Component {
    static defaultProps = {
		length: 6,
        type: 'password',
        visible: false,
        onClose: ()=>{},
    }
    static propTypes = {
		className: PropTypes.string,
		length: PropTypes.number,//长度
        type: PropTypes.string,//类型
        onEnd: PropTypes.func,//输入完成   返回输入密码    
        visible: PropTypes.bool,//显示隐藏
    }
    constructor(props) {
        super(props);
        this.state = {
            values: '', //存储值

            timerSeconds:30, // 计时秒数
            lastSeconds:30, // 还剩多少秒
            isTimerShow:true,
        
        };
    }

    componentDidMount() {

        // this.startTimer();

    }

    // 开定时器
    startTimer=()=>{
        timer = setInterval(() => {
            let { timerSeconds,lastSeconds } = this.state;
            this.setState({
                lastSeconds: lastSeconds - 1,
            }, () => {
                if (this.state.lastSeconds === 0) {
                    this.setState({
                        lastSeconds: timerSeconds,
                        isTimerShow: false,
                    });
                    clearInterval(timer);
                }
            });

        }, 1000);
    }

    // 重新获取验证码
    reGetCode=()=>{
        this.props.onGetSMSCode();
        this.setState({
            isTimerShow:true,
        },()=>{
            this.startTimer();
        });
    }

    onSetVal = (value)=>{
        let values= this.state.values;
        let length = this.props.length;
        
        if(values.length==length){
            console.log(this.state.values);
            return
        }else{
            this.setState({
                values: values + value
            });            
        }

    }
    
    onSubmit=()=>{
        let { values } = this.state;
        let { length, onEnd } = this.props;   
        if (values.length == length) {
            //返回
            onEnd && onEnd(values);
            //清空            
            // this.setState({
            //     values: ''
            // });
            return
        }             

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

    render() {
        let { values, lastSeconds, isTimerShow } = this.state,
        { className, length, type, visible, onClose }= this.props,
        inputs = [];
        for(let i=0;i<length;i++){
            inputs.push(i)
        }
        return (
        <WingBlank>
            <Modal
                popup
                onClose={onClose}
                closable = {true}
                visible={visible}
                animationType="slide-up"
                className='common-inputvalid-pf'
            >
                <h4>请输入验证码</h4>
                <div className={className?className+' common-inputvalid':'common-inputvalid'}>
                    {inputs.map((ele,index)=>{
                        return <input readOnly ref={'input'+index} type={"input"} value={values[index] || ""} 
                        key={'valid'+index} />
                    })}
                    <a style={{ color:"rgba(0, 0, 0, 0.5)"}} hidden={!isTimerShow}>
                        {lastSeconds}秒后重新获取
                    </a>
                    <a hidden={isTimerShow} onClick={this.reGetCode}>重新获取验证码</a>
                    <div className="submit-btn" onClick={this.onSubmit}>
                        提交
                    </div>
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
            </Modal>
        </WingBlank>
        );
    }
}