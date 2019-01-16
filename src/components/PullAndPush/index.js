
import './style.less'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Tap from '../Tap'
import { PullToRefresh } from 'antd-mobile';

//必须给高度
export default class Tips extends React.Component {
    static defaultProps = {
        refreshing: false, //显示刷新中  状态
        showMoring: true,  //显示加载更多 状态
        showMore: false,  //显示  加载更多按钮
        className: '',
    }
    static propTypes = {        
		refreshing: PropTypes.bool,
		onRefresh: PropTypes.func,
		showMoring: PropTypes.bool,
        onShowMore: PropTypes.func,
        showMore: PropTypes.bool,
    }
    constructor(props,context) {
        super(props,context);
        this.state = {
        };
    }
    componentDidMount(){
        
    }
    onShowMore = ()=>{
        this.props.onShowMore&&this.props.onShowMore();
    }
    render() {
        let { refreshing, onRefresh, showMoring, onShowMore, showMore, className, children, style } = this.props;
        return (
                <PullToRefresh
                    damping={40}  //距离
                    style={{
                        overflow: 'auto',
                    }}
                    className={className?className+' common-pull-refresh':'common-pull-refresh'}
                    indicator={{activate:'松开刷新', deactivate: '下拉刷新', release: '已刷新' }}
                    direction={'down'}
                    refreshing={refreshing}
                    onRefresh={() => {
                        onRefresh&&onRefresh()
                    }}
                >
                    {children}
                    {showMore?<Tap onTap={()=>{this.onShowMore()}}><p style={{textAlign:'center',paddingTop:'10px'}}>{showMoring?'加载中':'加载更多'}</p></Tap>:null}
                </PullToRefresh>
        );
    }
}

