import React, {Component} from 'react'
import Tap from './Tap'


export default class CountDown extends Component {
    static defaultProps = {
        time: 60
    }
    static defaultProps = {
		className: '',
        time: 60,
        onSend: ()=>{},
        auto: false,//是否自动倒计时
    }
    constructor(props) {
        super(props)
       
        this.state = {
            isPropsAuto: false,
            mark: Math.random(),  //标记倒计时组件
            run:false,   //倒计时进行中
            second: 0,//倒计时计数
            text:'获取验证码',  //按钮文字
        }
    }

    componentDidMount() {
        if(!this.state.isPropsAuto && this.props.auto){
            this.setState({
                isPropsAuto: true
            },()=>{this.onDown('auto')})
        }else if(this.state.isPropsAuto && !this.props.auto){
            this.setState({
                isPropsAuto: false
            })
        }
    }
    componentWillReceiveProps(nextProps){
        if(!this.state.isPropsAuto && nextProps.auto){
            this.setState({
                isPropsAuto: true
            },this.onDown)
        }else if(this.state.isPropsAuto && !nextProps.auto){
            this.setState({
                isPropsAuto: false
            })
        }
    }
    //销毁
    componentWillUnmount(){
        let mark = this.state.mark;
        clearInterval(window['VerifyCodeTime'+mark]);
        window.window['VerifyCodeTime'+mark] = null
    }
    onDown =(type)=>{
        let _self = this;
        let {run, text, mark, second} = _self.state;
        let {time,onSend} = _self.props;
        if(!run){
            this.state.run = true;
            if(type!='auto')onSend&&onSend();//不是自动倒计时需要触发事件            
            second = time;
            window['VerifyCodeTime'+mark] = setInterval(function () {
                if (second == 0) {
                    clearInterval(window['VerifyCodeTime'+mark]);
                    _self.setState({
                        text:'重新获取短信验证码',
                        run: false
                    });
                    return;
                }
                second--;
                _self.setState({
                    text:'剩余'+second+'秒',
                    run: true
                });
            },1000)  
        }    
    }

    render() {
        let { text, run } = this.state;
        let { className }= this.props;
        if(run){
            return <Tap className={className?className+' common-countdown common-countdown-disable':'common-countdown common-countdown-disable'}>{text}</Tap>
        }
        return (
            <Tap className={className?className+' common-countdown':'common-countdown'} onTap={this.onDown} >{text}</Tap>
        )
    }
}
