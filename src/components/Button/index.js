import './index.less'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Tap } from 'COMPONENT'

export default class Btn extends Component {
    
    static propTypes = {
        editable: PropTypes.bool,
        form:PropTypes.object,
        fields:PropTypes.array,
        onBtn: PropTypes.func,
        onValid: PropTypes.func,
        className: PropTypes.string,
    }

    static defaultProps = {
        editable: true,
        fields:[]
    }

    constructor(props) {
        super(props);
        this.state = {
            //验证
            valid:false
        };
    }

    componentDidMount() {
    }

    getFieldsError=()=>{
        let ret = true,fields=this.props.fields,
        values = this.props.form.getFieldsValue(),
        errs = this.props.form.getFieldsError();
        fields.forEach((i)=>{
            if(!ret){
                return;
            }
            if(errs[i] || !values[i]){
                ret = false;
            }
        })
        return ret;
    }

    onButton=()=>{
        this.props.form.validateFields((error, values) => {            
            if (!error) {
                for(var i in values){
                    if(!values[i]) values[i] = '';
                }
                this.props.onBtn && this.props.onBtn(values);
            }
        });
    }

    onValid=()=>{
        this.props.onValid && this.props.onValid();
    }

    render() {
        if(!this.props.form || (this.props.editable && this.getFieldsError())){
            return (
                <div className='common-btn_box'>
                    <Tap className={"c-black span font16 active "+this.props.className} onTap={this.onButton}>
                        {this.props.children}
                    </Tap>
                </div>
            );
        }else{
            return (
                <div className='common-btn_box'>
                    <Tap className={"c-black span font16 "+this.props.className} onTap={this.onValid}>
                        {this.props.children}
                    </Tap>
                </div>
            );
        }
        
    }
}