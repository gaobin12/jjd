
//借条详情 => 借条内容
import '../form.less';
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { List,Flex } from "antd-mobile"
import { Tap,Tips } from 'COMPONENT'
import { Loading, Modal, util, math } from 'SERVICE'

@withRouter
@inject('userStore','afterIouStore')
@observer
export default class App extends Component {
    constructor(props, context) {
        document.title = "借条内容";
        super(props, context)
        let query = util.getUrlParams(this.props.location.search);
        this.state = {
            id: query.id,
            showList:[]
        };
    }

    componentDidMount() {
        //this.getPageInfo();
        this.getShowStatus();    
    }

    //获取页面内容
    getPageInfo = () => {
        const _this = this;
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/loanlater/loaninfo/getLoan',
            data: {
                loanId: _this.state.id
            }
        }).then((data) => {
            data.borrowTime = (new Date(data.borrowTime * 1000)).Format('yyyy-MM-dd');
            data.repayTime = (new Date(data.repayTime * 1000)).Format('yyyy-MM-dd');
            data.createTime = (new Date(data.createTime)).Format('yyyy-MM-dd hh:mm:ss');
            data.amount = $.toYuan(data.amount);
            data.purposeType = $.purpose(data.purposeType);
            data.picList = data.imgList?data.imgList:[];
            _this.setState({
                userInfo: data
            });
        }).catch((msg,res) => {
            if(res.status == 202){
                Modal.infoX(msg,()=>{
                    _this.props.history.push({
                        pathname: '/'
                    });
                });
            }else{
                Modal.infoX(msg);
            }
        }).finally(()=>{
            //Loading.show();
            Loading.hide();
        })
    }

    //获取是否需要确认展期
    getShowStatus = ()=>{
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/loanlater/loanExceeding/getLoanExceedingList',
            data: {
                loanId: this.state.id
            }
        }).then((data) => {
            data.forEach((item)=>{
                item.createTime = (new Date(item.createTime)).Format('yyyy-MM-dd hh:mm'); 
                item.endTm = (new Date(item.endTm * 1000)).Format('yyyy-MM-dd');
                item.confirmTm = (new Date(item.confirmTm * 1000)).Format('yyyy-MM-dd hh:mm:ss');
                item.startTm  = (new Date(item.startTm * 1000)).Format('yyyy-MM-dd');
            });
            this.setState({
                showList:data
            });
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })      
    }

    // 查看协议
    viewAgreement=()=>{
        this.props.history.push({
            pathname: '/agree/iou',
            query: {
                id: this.state.id,
            }
        });
    }
    // 展期协议
    ZhanqiAgreement=(ob)=>{
        $.setItem('exceeding_info', ob);
        this.props.history.push({
            pathname: '/agreement/extend_agreement',
            query: {
                id: this.state.id,
            }
        });
    }
    // 补充说明
    additionalRemarks = () => {
        let { userInfo } = this.state
        // 缓存补充说明
        $.setItem('pre_remarks',{
            memo:userInfo.memo,
            picList:userInfo.picList
        });
        this.props.history.push({
            pathname: '/pre/iou_remark',
        });
    }
    render() {
        const { afterIouStore:{detail} } = this.props;
        const { showList } = this.state;
        return (
            <div className='view-form'>
                <Flex justify='start' className='list-title mar16'>
                    <span className='title'>借款内容</span>
                </Flex>
                <List className="detail_list">
                    <List.Item extra={detail.borrowerName}>借款人</List.Item>
                    <List.Item extra={detail.lenderName}>出借人</List.Item>
                    <List.Item extra={$.toYuan(detail.amount)}>借款金额</List.Item>
                    {detail.onlineStatus ? <List.Item extra={'线上出借'}>出借方式</List.Item>:
                    <List.Item extra={'线下出借'}>出借方式</List.Item>}  
                    <List.Item extra={$.repayType(detail.repayType)}>还款方式</List.Item>:null}
                    <List.Item extra={detail.borrowTimeTxt}>借款日期</List.Item>
                    <List.Item extra={detail.repayTimeTxt}>还款日期</List.Item>
                    <List.Item extra={detail.interestRate+'%'}>借款利率</List.Item>
                    <List.Item extra={$.toYuan(detail.guaranteeAmount)}>担保费</List.Item>
                    <List.Item extra={detail.purposeTypeTxt}>借款用途</List.Item>
                    
                    {(detail.memo.length || detail.imgList.length) ? <List.Item extra={<Tap className="colorff9900" onTap={() => { this.additionalRemarks() }}>点击查看</Tap>}>补充说明</List.Item>:
                     <List.Item extra={'无'}>补充说明</List.Item>}

                    <List.Item extra={detail.originalId}>借条ID</List.Item>
                    <List.Item extra={detail.createTimeTxt}>创建时间</List.Item>
                    <List.Item extra={<Tap className="colorff9900" onTap={()=>{ this.viewAgreement()}}>点击查看</Tap>}>借款协议</List.Item>
                </List> 
                {showList.length>0 && showList.map((item)=>{
                    return <div>
                        <Flex justify='start' className='list-title mar16'>
                            <span className='title'>展期内容</span>
                        </Flex>
                        <List className="detail_list">
                            <List.Item extra={item.endTm}>展期还款日期</List.Item>
                            <List.Item extra={item.amtExtend/100+'元'}>展期本金</List.Item>
                            <List.Item extra={item.interestRateExtend+'%'}>展期利率</List.Item>
                            <List.Item extra={item.createTime}>创建时间</List.Item>
                            <List.Item extra={<Tap className="colorff9900" onTap={()=>{ this.ZhanqiAgreement(item)}}>点击查看</Tap>}>展期协议</List.Item>
                        </List>
                    </div>
                })}
            </div>
        )
    }
}