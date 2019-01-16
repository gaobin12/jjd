
import './index.less'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { InputItem } from 'antd-mobile'

export default class InputComt extends Component {
    
    static propTypes = {
        moneyKeyboardAlign: PropTypes.string,
        moneyKeyboardWrapProps: PropTypes.object,
        moneyKeyboardHeader: PropTypes.node,
        type: 'text' | 'bankCard' | 'phone' | 'password' | 'number' | 'digit' | 'money',
        editable: PropTypes.bool,
        disabled: PropTypes.bool,
        name: PropTypes.string,
        value: PropTypes.string,
        defaultValue: PropTypes.string,
        placeholder: PropTypes.string,
        clear: PropTypes.bool,
        maxLength: PropTypes.number,
        extra: PropTypes.node,
        error: PropTypes.bool,
        labelNumber: PropTypes.number,
        labelPosition: 'left' | 'top',
        textAlign: 'left' | 'center',
        updatePlaceholder: PropTypes.bool,
        locale: PropTypes.object,
        onChange: PropTypes.func,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
        onVirtualKeyboardConfirm: PropTypes.func,

        errorText: PropTypes.string,
        max: PropTypes.number,
        min: PropTypes.number,
    }

    static defaultProps = {
        type:'text',
        max:200000,
        min:0   
    }

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value, //存储值
            //是否获取焦点
            focus:false
        };
    }

    onLeft=()=>{
        let v = this.state.value-100;
        if(v<=this.props.min){
            v = this.props.min;
        }
        this.setState({
            value:v
        });
        this.props.onChange(v);
    }

    onRight=()=>{
        let v = this.state.value+100;
        if(v<=this.props.min){
            v = this.props.min;
        }
        if(v>=this.props.max){
            v = this.props.max;
        }
        this.setState({
            value:v
        });
        this.props.onChange(v);
    }

    onChange=(e)=>{
        //debugger;
        let v = parseInt(e);
        if(e.length==0){
            v = 0;
        }
        this.setState({
            value:v
        });
        this.props.onChange(v);
    }

    onBlur=()=>{
        this.setState({
            focus:false
        });
    }

    onFocus=()=>{
        this.setState({
            focus:true
        });
    }

    render() {
        return (
            <div className='comt-input-money'>
                <div className='cont'>
                    <div className='left' onTouchEnd={this.onLeft}>
                        <img src='/imgs/iou/minus.svg' />
                    </div>
                    <div className='center'>
                        <InputItem {...this.props}
                            className = {this.state.focus?'':'hide'}
                            value={this.state.value}
                            extra="元"
                            onChange = {this.onChange}
                            onBlur = {this.onBlur}
                            onFocus = {this.onFocus}>{this.props.children}</InputItem>
                        {this.state.focus?null:<span onTouchEnd={this.onFocus} className='text'>{this.state.value}<span className='yuan'>元</span></span>}
                        {this.props.errorText?<p className='error-txt'>* {this.props.errorText}</p>:null}
                    </div>
                    <div className='right' onTouchEnd={this.onRight}>
                        <img src='/imgs/iou/add.svg' />
                    </div>
                </div>
            </div>
        );
    }
}