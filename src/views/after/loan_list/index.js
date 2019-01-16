
//首页 => 借出
import '../borrow_list/index.less'
import React, { Component,  } from 'react'
import {Tap, PullAndPush,NavSelect,PushMore} from 'COMPONENT'
import { SearchBar, List, Tag, Card, } from 'antd-mobile'
import { Modal, Loading, math, } from 'SERVICE'

const list1 = ['全部','待处理','全部待收','未逾期待收','已逾期待收','已完结','有争议',<span className='select-more'>自定义 <img src='imgs/com/arrows.svg' /></span>]
const list2 = ['还款时间从早到晚','还款时间从晚到早','借条金额从少到多','借条金额从多到少']
export default class Page extends Component {
    
    constructor(props, context) {
        document.title = "借出";
        super(props, context)
        this.state = {
            data: null,//借出
            isLoading: true,
            hasMore: true,
            pageInfo: {
                loanStatus: 3,
                sortType: 0,
                limit: 8,//pagesize
                start: 1,//pagenumber
            },
            visible1: false,//下拉选择展开
            visible2: false,//下拉选择展开
            selected1: 3,//下拉选择
            selected2: 0,//下拉选择
            listScrollTop: 0,//列表滚动距离
        };
    }
    componentDidMount() {
        let {pageInfo,selected1,selected2,listScrollTop} = this.state;
        //筛选页面回来，显示自定义
        let query = sessionStorage.getItem('list_filter')&&JSON.parse(sessionStorage.getItem('list_filter'));
        if(query){
            query = Object.assign(pageInfo,query);
            if(query.loanStatusList!==undefined){
                selected1 = list1.length-1
            }
            sessionStorage.removeItem('list_filter');
        }else{
            query = pageInfo
        }
        //详情页回来
        let order = sessionStorage.getItem('list_order')&&JSON.parse(sessionStorage.getItem('list_order'));
        if(order){
            selected1 = order.selected1
            selected2 = order.selected2
            query.start = 1
            query.limit = order.nowListLength
            listScrollTop = order.listScrollTop
            sessionStorage.removeItem('list_order');
        }
        this.setState({
            pageInfo: query,
            selected1,selected2,
            listScrollTop,
        },function(){
            this.getPageInfo()
        })        
    }
    getPageInfo=(more)=>{
        let {pageInfo,selected1,selected2,isLoading} = this.state;
        pageInfo.loanStatus = selected1;
        pageInfo.sortType = selected2;
        if(more){
            pageInfo.start += 1
        }else{
            pageInfo.start = 1
        }
        if(pageInfo&&pageInfo.loanStatus==0||pageInfo.loanStatus==list1.length-1){
            //若借条状态为全部，删除参数
            delete pageInfo.loanStatus
        }else if(pageInfo.loanStatus){
            pageInfo.loanStatus -= 1
        }
        isLoading = true;
        Loading.show();
        //loanStatusList和loanStatus只能存在一个
        if(pageInfo.loanStatusList&&pageInfo.loanStatusList.length){
            delete pageInfo.loanStatus
        }
        //列表
        $.ajaxE({
            type: 'POST',
            contentType: 'application/json',
            url: '/loanlater/loaninfo/getLendAccount',
            data: pageInfo
        }).then((data) => {
            let myData = this.state.data;
            let {hasMore,listScrollTop} = this.state;
            if(data&&myData){
                if(more){
                    data.loanInfoList = myData.loanInfoList.concat(data.loanInfoList);
                }
            }
            if(listScrollTop){
                setTimeout(()=>{
                    let _box = this.scrollList.lv.listviewRef.ListViewRef.ScrollViewRef;
                    _box.scrollTop = listScrollTop
                })
            }
            if(data&&data.loanCount > data.loanInfoList.length){
                hasMore = true
            }else{
                hasMore = false
            }
            this.setState({
                data,hasMore,isLoading: false
            })
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
            //Loading.show();
            Loading.hide();
        })
    }
    onItemTap=(id)=>{
        let { selected1, selected2, pageInfo, } = this.state,
            nowListLength = pageInfo.start*pageInfo.limit;//当前条数，用于详情页返回时，还原列表用
        sessionStorage.setItem('list_order',JSON.stringify({selected1,selected2,nowListLength,listScrollTop:this.scrollList.lv.listviewRef.ListViewRef.ScrollViewRef.scrollTop}));
        
        this.props.history.push({
            pathname: '/after/loan_detail',
            search: '?id=' + id
        })
    }
    onJSFilter=(val)=>{
        let {pageInfo} = this.state;
        pageInfo.start = 1;
        if(val){
            pageInfo.userName = val
        }else{
            delete pageInfo.userName
        }
        delete pageInfo.minAmount
        delete pageInfo.maxAmount
        this.setState({
            pageInfo
        },function(){
            this.getPageInfo()
        })
    }
    onSelect=(key,index,item)=>{
        let {pageInfo} = this.state;
        //条件变换，起始页初始化
        pageInfo.start = 1;
        if(key=='selected1'&index==list1.length-1){
            //更多筛选
            this.props.history.push({
                pathname: '/after/common_list_filter',
                query:{
                    type: '待收'
                }
            })
            return;
        }
        //loanStatusList和loanStatus只能存在一个
        if(pageInfo.loanStatusList&&pageInfo.loanStatusList.length){
            delete pageInfo.loanStatusList
        }
        this.setState({
            [key]: index,
            pageInfo
        },this.getPageInfo)
    }
    render() {
        let { data,selected1,selected2,visible1,visible2} = this.state;
        return (
            <div className="view-common-list">

                <div className="search-box martt">
                    <SearchBar onChange={this.onJSFilter} placeholder="可搜索姓名"  />    
                </div>
                <div className='filter-select'>
                    <NavSelect className='s-item' list={list1} 
                        onOpen={()=>{this.setState({visible1:true,visible2:false})}} visible={visible1} onClose={()=>{this.setState({visible1:false,visible2:false})}} selected={selected1}
                        onSelect={(index,item)=>{this.onSelect('selected1',index,item)}}>
                        <span className={visible1?'qualid active':'qualid'}></span>
                    </NavSelect>
                    <NavSelect className='s-item' list={list2} 
                        onOpen={()=>{this.setState({visible1:false,visible2:true})}} visible={visible2} onClose={()=>{this.setState({visible1:false,visible2:false})}} selected={selected2}
                        onSelect={(index,item)=>{this.onSelect('selected2',index,item)}}>
                        <span className={visible2?'qualid active':'qualid'}></span>
                    </NavSelect>
                </div>
                <div className="top-yellow">
                    <div className="one half">
                        <div className="top">借条总额(元)</div>
                        <div className="bot">{data&&$.to2( $.toYuan(data.totalAmount)) ||0.00}</div>
                    </div>
                    <div className="one half">
                        <div className="top">待收总额(元)</div>
                        <div className="bot">{data&& $.toYuan(data.repayAndReceiveAmount) ||0.00}</div>
                    </div>
                    <div className="one half">
                        <div className="top">借条数</div>
                        <div className="bot">{data&&data.loanCount ||0}</div>
                    </div>
                </div>
                <div className="list-box">
                    <PushMore getData={this.getPageInfo} dataList={data&&data.loanInfoList} hasMore = {this.state.hasMore} isLoading={this.state.isLoading} ref={ref=>{this.scrollList = ref}}
                    pageSize = {this.state.pageInfo.limit}
                    row={
                        (item,sectionID, rowID)=>{
                            return <Tap onTap={() => { this.onItemTap(item.loanIdE ) }} key={Math.random()}>
                                        <div className='card'>
                                            {item.loanStatus==2||item.loanStatus==4?<div className='c-top'>
                                                <p><span className='bold'>{item.name}</span></p>
                                                <p>线{item.onlineStatus?'上':'下'}出借
                                                    <span className='red'>
                                                        {item.leftTime>0?<font className='fontC4'>已完结曾逾{item.leftTime}天</font>:
                                                        <font className='fontC4'>已完结未逾期</font>}
                                                    </span>
                                                </p>
                                            </div>:
                                            <div className='c-top'>
                                                <p>待收
                                                    <span className='color'>
                                                    <font className='font24'>{ $.toYuan(item.repayAndReceiveAmount)}</font>元</span>
                                                    {item.waitConfirmRepayStatus?<span className='tag tag-yellow'>还</span>:null}
                                                    {item.reportStatus?<span className='tag tag-green'>举</span>:null}
                                                    {item.waitConfirmExceedStatus?<span className='tag tag tag-blue'>展</span>:null}
                                                    {item.waitConfirmWriteOffStatus?<span className='tag tag-red'>销</span>:null}
                                                </p>
                                                <p>{item.name} 线{item.onlineStatus?'上':'下'}出借
                                                    <span className='red'>
                                                    {   item.loanStatus==1&&item.leftTime==0?'今天到期':
                                                        item.loanStatus==1&&item.leftTime>0?<font style={{color:'#4E8CEE'}}>剩余{item.leftTime}天</font>:
                                                        item.loanStatus==3?'已逾期'+item.leftTime+'天':
                                                        null//'有争议'//item.loanStatus==4
                                                    }</span>
                                                </p>
                                            </div>}
                                            <div className='c-bottom'>
                                                <p>
                                                    <span className='left'>总额 { $.toYuan(item.amount)}</span>
                                                    <span className='right'>出借日期 {new Date(item.borrowTime*1000).Format("yyyy-MM-dd")}</span>
                                                </p>
                                                <p>
                                                    <span className='left'>利率 {item.interestRate}%</span>
                                                    <span className='right'>还款日期 {new Date(item.repayTime*1000).Format("yyyy-MM-dd")}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </Tap>
                        }
                    }/>
                </div>
            </div>
        )
    }
}
