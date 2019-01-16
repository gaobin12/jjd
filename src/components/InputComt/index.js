
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
    }

    static defaultProps = {
        type:'text',
        clear:true
    }

    constructor(props) {
        super(props);
        this.state = {
            values: '', //存储值
            blue:false
        };
    }

    onBlur=()=>{
        //this.props.onBlur();
        //debugger;
        // this.setState({
        //     blue:true
        // });
    }

    render() {
        return (
            <div className='comt-input-item'>
                <InputItem {...this.props} clear></InputItem>
                {(this.props.errorText)?<span>{this.props.errorText}</span>:null}
            </div>
        );
    }
}