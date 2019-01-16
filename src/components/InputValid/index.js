
import './style.less'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

import { WingBlank } from 'antd-mobile';
import { Loading, Modal } from 'SERVICE'
import Tap from '../Tap'

export default class InputValid extends Component {
    static defaultProps = {
		length: 6,
        type: 'password',
        visible: false,
        onClose: null,
    }
    static propTypes = {
		className: PropTypes.string,
		length: PropTypes.number,//长度
        type: PropTypes.string,//类型
        onEnd: PropTypes.func,//输入完成   返回输入密码    
        visible: PropTypes.bool,//显示隐藏
        onClose: PropTypes.func,//输入完成   返回输入密码    
    }
    constructor(props) {
        super(props);
        
        this.state = {
            values: '' //存储值
        };
    }
    componentDidMount(){
       var ls = document.getElementById("blurInput");
       ls&&ls.focus();

    }
    onSetVal = (value)=>{
        let {values} = this.state;
        let { length, onEnd } = this.props;
        values+=value;
        this.setState({
            values
        })
        if(values.length==length){
            let _this = this;
            setTimeout(function(){                
                //返回
                onEnd&&onEnd($.md5($.md5(values)));
                //清空            
                _this.setState({
                    values:''
                })
            },200)
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
    onGoReset(){        
        this.props.history.push({
            pathname: '/setting/change_trade_pwd',
        });
    }
    render() {
        let { values } = this.state,
            { className, length, type, visible }= this.props,
            inputs = [];
        for(let i=0;i<length;i++){
            inputs.push(i)
        }
        return (
        <WingBlank>
            <Modal
                popup
                onClose={()=>{this.props.onClose()}}
                closable = {this.props.onClose?true:false}
                visible={visible}
                animationType="slide-up"
                className='common-inputvalid-p'
            >
                <h4>请输入交易密码</h4>
                <div className={className?className+' common-inputvalid':'common-inputvalid'}>
                    {inputs.map((ele,index)=>{
                        return <input readOnly ref={'input'+index} type={type&&values[index]?type:'number'} value={values[index]||''} 
                        key={'valid'+index} />
                    })}
                    <Tap onTap={()=>{this.onGoReset()}}><a>忘记交易密码？</a></Tap>
                </div>

                <input type = 'checkbox' style={{position:'fixed',top:'-100vh'}} id='blurInput' />

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