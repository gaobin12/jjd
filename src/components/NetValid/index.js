import './index.less'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class NetValid extends Component {
    
    static propTypes = {
        show: PropTypes.bool,
        onNetValid: PropTypes.func,
    }

    static defaultProps = {
        show:false
    }

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    componentDidUpdate(){
        let _this = this;
        if(!_this.props.show){
            return;
        }
        initNECaptcha({
            captchaId: $.jjd.captchaId,
            element: '#captcha_div',
            //mode: 'float', // 如果要用触发式，这里改为float即可
            mode: 'embed',
            onVerify: function (err, ret) {
                if (!err) {
                    _this.props.onNetValid && _this.props.onNetValid(ret.validate)
                }
            }
        }, function (instance) {
            // 初始化成功后得到验证实例instance，可以调用实例的方法
        }, function (err) {
            errBack(err);
        })
    }

    render() {
        if(!this.props.show){
            return null;
        }
        return (
            <div className='cont-net-valid' >
                <div id="captcha_div" />
            </div>
        );
    }
}