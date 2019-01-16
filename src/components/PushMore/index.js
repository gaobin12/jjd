import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Tap from '../Tap'
import ReactDOM from 'react-dom'
import { ListView } from 'antd-mobile';
import './style.less'
  
export default  class Demo extends React.Component {
    static defaultProps = {
        getData:()=>{},//滚动触底时触发函数,初始化时触发一次
        row:(item,sectionID, rowID)=>{}, //一个函数，用于渲染行数据，返回列element。参数为list的每个数据
        dataList: [], //list数据
        isLoading: false, //是否正在加载
        hasMore: true, //是否有更多数据
        onScroll: ()=>{},//列表滚动事件
        pageSize: 8,
    }
    constructor(props) {
      super(props);
  
      const dataSource = new ListView.DataSource({
        //getRowData: (dataBlob, sectionID, rowID) => dataBlob[sectionID],
        rowHasChanged: (row1, row2) => row1 !== row2,
        //sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      });
  
      this.state = {
        dataSource,
        isLoading: true,
        hasMore: true,
        height: document.documentElement.clientHeight * 3 / 4,
      };
    }
  
    componentDidMount() {
      // you can scroll to the specified position
      // setTimeout(() => this.lv.scrollTo(0, 120), 800);
  
        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
        this.setState({
            height: hei,
        });
    }
  
    // If you use redux, the data maybe at props, you need use `componentWillReceiveProps`
    // componentWillReceiveProps(nextProps) {
    //   if (nextProps.dataSource !== this.props.dataSource) {
    //     this.setState({
    //       dataSource: this.state.dataSource.cloneWithRowsAndSections(nextProps.dataSource),
    //     });
    //   }
    // }
  
    onEndReached = (event) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.props.isLoading || !this.props.hasMore) {
            return;
        }
        this.props.getData(true)//true  加载更多
    }
  
    render() {
        let { row, dataList, isLoading, hasMore, onScroll, pageSize, } = this.props;
        if(!dataList)dataList=[]
        let dataSource = this.state.dataSource.cloneWithRows(dataList);
        return (
            <ListView
            ref={el => this.lv = el}
            initialListSize={pageSize}
            pageSize={pageSize}
            dataSource={dataSource}
            renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                {isLoading ? '加载中...' : hasMore?'加载完毕':'已无更多'}
            </div>)}
            renderRow={row}
            style={{
                height: this.state.height,
                overflow: 'auto',
            }}
            onScroll={() => { console.log('scroll');onScroll&&onScroll() }}
            scrollRenderAheadDistance={500}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
            />
        );
    }
  }