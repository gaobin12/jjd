import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import './style.less'
import Tap from 'COMPONENT/Tap'

export default class Tips extends Component {
    static defaultProps = {
        title: '提示',
        footer: '知道了',
        className: '',
    }
    static propTypes = {        
		className:  PropTypes.string,
        list:  PropTypes.array, //展示数据
        onSelect:  PropTypes.func,
        onOpen:  PropTypes.func,
        onClose:  PropTypes.func,
        selected:  PropTypes.number,//默认选中
        visible:  PropTypes.bool,//显示隐藏
    }
    static contextTypes = {
        router: PropTypes.object.isRequired,
    }
    constructor(props,context) {
        super(props,context);
        this.state = {
            maskH: null,//蒙版高度
        };
    }
    componentDidMount(){
        let data = $(this.mask.parentNode).offset();
        //获取蒙版高度和位置
        this.setState({
            maskH: document.body.clientHeight - data.top - data.height + 1,
            contentT: data.top + data.height - 1
        })        
    }
    onOpen=()=>{   
        let { list, visible, onSelect } = this.props;
        let { maskH, contentT } = this.state;  
        if(visible){
            this.onClose()
            return
        }
        //判断是否有其他下拉组件在打开状态
        if($.navSelect){
            ReactDOM.unmountComponentAtNode($.navSelect);
        }else{
            $.navSelect = document.createElement('div');
            $.navSelect.className = 'common-nav-select-out'
            document.body.appendChild($.navSelect);
        }
        //插入
        ReactDOM.unstable_renderSubtreeIntoContainer(this, <span>
            <div onTouchEnd={this.onClose} className={'nav-select-mask'} style={{height:maskH}}></div>
                <ul className='nav-select' style={{top: contentT?contentT:0,height:list.length*45}}>
                    {list&&list.map((item,index)=>{
                        return<Tap key={item} onTap={()=>{onSelect&&onSelect(index,item),this.onClose()}}>
                            <li>{item}</li>
                        </Tap>
                    })}
                </ul>
        </span>, $.navSelect);
        this.props.onOpen&&this.props.onOpen();
    }
    onClose=(e)=>{
        if(e){
            e.stopPropagation();
            e.preventDefault();
        }
        let {  visible, } = this.props;
        if(visible==false){
            this.onOpen()
            return
        }
        //移除*
        if($.navSelect){
            ReactDOM.unmountComponentAtNode($.navSelect);
            document.body.removeChild($.navSelect);
            $.navSelect = null;
            this.props.onClose&&this.props.onClose()
        }
    }
    componentWillUnmount=()=>{
        //移除*
        if($.navSelect){
            ReactDOM.unmountComponentAtNode($.navSelect);
            document.body.removeChild($.navSelect);
            $.navSelect = null;
        }
    }
    render() {
        let { className, list, selected, children} = this.props;
        return (
            <Tap className={'common-nav-select '+className} onTap={this.onOpen}>
                {list[selected]}{children}
                <div ref={ref=>this.mask = ref}></div>
            </Tap>
        );
    }
}

