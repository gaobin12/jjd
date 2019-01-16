
//首页 => 我的出借列表
import '../detail.less'
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Flex, List } from 'antd-mobile'
import { Loading, Modal, util, rules, math } from 'SERVICE'
import { Tap,Anchor } from 'COMPONENT'

@withRouter
@inject('userStore','preProductStore')
@observer
export default class Page extends Component {

	constructor (props, context) {
		document.title = "我的出借";
        super(props, context)
        let query = util.getUrlParams(this.props.location.search);
		this.state = { 
            uId:query.id?query.id:props.userStore.userInfo.userId,
            info:{
                toReceiveAmount:0,
                toRepayAmount:0,
                currentGuaranteeAmount:0,
                productList:[],
                invalidProductList:[],
                offlineProductList:[]
            }
		};
	}
	
	componentDidMount(){
        this.getPageInfo();
        this.props.preProductStore.clearInfo();

        setTimeout(()=>{
            $.anchorId = null;
        },500)
    }
    
    //获取用户的出借
    getPageInfo = () => {
        let _this = this;
        const { userStore,preProductStore } = this.props;
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/loanpre/product/getProductHomePage',
            data: {
                uid: this.state.uId,
                openId: this.props.userStore.userInfo.openId,
            }
        }).then((data) => {
            data.borrowAmount = $.toYuan(data.borrowAmount);
            data.currentGuaranteeAmount = $.toYuan(data.currentGuaranteeAmount);
            data.guaranteeAmount = $.toYuan(data.guaranteeAmount);
            data.toReceiveAmount = $.toYuan(data.toReceiveAmount);
            data.toRepayAmount = $.toYuan(data.toRepayAmount);
            data.productList.forEach((item) => {
                item.amount = $.toYuan(item.minAmount) + "-" + $.toYuan(item.maxAmount);
                if (item.repayType) {
                    item.time = item.minTm + "期 -" + item.maxTm + " 期";
                } else {
                    item.time = item.minTm + (item.minTimeUnit ? "个月 -" : "天 -") + item.maxTm + (item.maxTimeUnit ? "个月" : "天");
                }

                item.minAmt = $.toYuan(item.minAmount);
                item.maxAmt = $.toYuan(item.maxAmount);
                item.createTime = (new Date(item.createDate*1000)).Format('yyyy-MM-dd hh:mm');
                preProductStore.setTimeText(item);
            })
            data.invalidProductList.forEach((item) => {
                item.minAmt = $.toYuan(item.minAmount);
                item.maxAmt = $.toYuan(item.maxAmount);
                item.createTime = (new Date(item.createDate*1000)).Format('yyyy-MM-dd hh:mm');
                preProductStore.setTimeText(item);
            })
            
            data.offlineProductList.forEach((item) => {
                item.minAmt = $.toYuan(item.minAmount);
                item.maxAmt = $.toYuan(item.maxAmount);
                item.createTime = (new Date(item.createDate*1000)).Format('yyyy-MM-dd hh:mm');
            })

            _this.setState({
                info: data
            });
            
            //微信分享
            if(data.productList.length){                
                //分享给朋友
                $.setItem('wx_share',{
                    id:this.state.uid,
                    path:'/pre/loan_mine',
                    amt: data.productList[0].amount,
                    time: data.productList[0].time,
                    rate: data.productList[0].interestRate,
                    param: {
                        loanType: 2,
                        loanTypeStr: '去出借',
                        creatorType: '出借人',
                        rate: data.productList[0].interestRate,
                        creatorName: data.fullName,
                        repayDate: data.productList[0].time,
                        repayType: data.productList[0].repayType?'等额本息':'还本付息',
                    }
                });
            }else{
                //分享给朋友
                $.setItem('wx_share',{
                    id:this.state.uid,
                    path:'/pre/loan_mine',
                });
            }
            $.wxShare()

        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }

    onItemShare=(ob)=>{
        const { userStore } = this.props;
        userStore.setShareInfo({
            id:ob.id,
            path:'/pre/product_detail',
            amt:ob.amount,
            time:ob.time,
            rate:ob.interestRate,
        });
        this.props.history.push({
            pathname: '/user/share'
        });
    }

    onItemDetail=(ob)=>{
        $.anchorId = ob.id;
        this.props.history.push({
            pathname: '/pre/product_detail',
            search: '?id=' + ob.id
        });
    }

    onItemDraft=(ob)=>{
        $.anchorId = ob.id;
        this.props.history.push({
            pathname: '/pre/draft_detail',
            search: '?id=' + ob.id
        });
    }

    onDraft=()=>{
        this.props.history.push({
            pathname: '/pre/draft_form'
        });
    }

    onAdd=()=>{
        this.props.history.push({
            pathname: '/pre/product_form'
        });
    }

    onOpen=(id)=>{
        const _this = this;
        //打开
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/loanpre/product/updateProductStatus',
            data: {
                id: id,
                validStatus:true
            }
        }).then((data) => {
            Modal.infoX('操作成功!');
            _this.getPageInfo();
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }

    onDownload=()=>{
        
    }

    onShare=()=>{
        this.props.history.push({
            pathname: '/user/share'
        });
    }

	render () {
        const { info } = this.state;
		return (
			<div className="view-pre-detail" style={{paddingBottom:'50px'}}>		
                <div style={{height: '100%',overflow:'auto',paddingBottom:'0.2rem'}}>	
                    <Flex justify='start' direction='column' className='list-top'>
                        <div className='top'></div>
                        <div className='bottom'></div>
                        <div className='user-box' style={{width:document.body.offsetWidth-40}}>
                            <Flex justify='start' direction='row' className='user-msg'>
                                <span className='img'>
                                    <img src='/imgs/iou/user.svg' />
                                </span>
                                <span className='text'>
                                    <span className='name'>测试</span>
                                    <span className='tel num-font'>15010369189</span>
                                </span>
                                <span className='btn'>
                                    信用报告
                                </span>
                            </Flex>
                            <Flex justify='start' direction='row' className='user-money'>
                                <div className='money-1'>
                                    <span className='money num-font'>
                                        {info.toReceiveAmount}<span>元</span>
                                    </span>
                                    <span className='text'>
                                        待收金额
                                    </span>
                                </div>
                                <div className='money-2'>
                                    <span className='money num-font'>
                                        {info.toRepayAmount}<span>元</span>
                                    </span>
                                    <span className='text'>
                                        待还金额
                                    </span>
                                </div>
                                <div className='money-3'>
                                    <span className='money num-font'>
                                        {info.currentGuaranteeAmount}<span>元</span>
                                    </span>
                                    <span className='text'>
                                        正在担保
                                    </span>
                                </div>
                            </Flex>
                        </div>
                    </Flex>
                    {(!info.productList.length && !info.invalidProductList.length && !info.offlineProductList.length)?<div className='null' style={{display:'none'}}>
                        <img src={'/imgs/iou/loan-null.svg'} className="null-img" />
                        <p className="font14 fontC1">空空如也～</p>
                    </div>:null}
                    
                    {(info.productList.length || info.invalidProductList.length)?<Flex justify='start' className='list-title mar16'>
                        <span className='title'>我的出借</span>
                    </Flex>:null}
                    {info.productList.map((item) => {
                        return <div key={item.id} className='product-box' style={{width:document.body.offsetWidth-40}}>
                                <Anchor id={item.id} />
                                <Tap onTap={()=>{this.onItemShare(item)}}>
                                    <Flex justify="between" className="prod_top">
                                        <div className="font14 mainC2 num-font">{item.applyCount}人等待审核</div>
                                        <div className="prod-div font14 mainC2">
                                        <img src='/imgs/iou/share-icon.svg' className="share" /><span>分享</span></div>
                                    </Flex>
                                </Tap>
                                <Tap onTap={()=>{this.onItemDetail(item)}}>
                                    <Flex justify='start' direction='row' className='user-money'>                                    
                                        <div className='money-1'>
                                            <span className='money num-font'>
                                                {item.minAmt}-{item.maxAmt}<span>元</span>
                                            </span>
                                            <span className='text'>
                                                出借范围
                                            </span>
                                        </div>
                                        <div className='money-2'>
                                            <span className='money num-font'>
                                                {item.interestRate}<span>%</span>
                                            </span>
                                            <span className='text'>
                                                年利率
                                            </span>
                                        </div>
                                        <div className='money-3'>
                                            <span className='money num-font'>
                                                {item.minTm}<span>{item.minTxt}</span>-{item.maxTm}<span>{item.maxTxt}</span>
                                            </span>
                                            <span className='text'>
                                                借款时长
                                            </span>
                                        </div>
                                    </Flex>
                                    <Flex justify="between" className="prod_top bord_top">
                                        <div className="font14 mainC2 num-font">{item.createTime}</div>
                                        <div className="prod-div font14 mainC2">
                                            <span>出借详情</span>
                                            <img src='/imgs/credit/arrows-back.svg' className="arrow" />
                                        </div>
                                    </Flex>
                                </Tap>
                            </div>
                    })}

                    {info.invalidProductList.length?<div className="prd-close-font">已关闭的出借，其他人不可见，您可以重新开启</div>:null}
                    {info.invalidProductList.map((item) => {
                        return <div key={item.id} className='product-box prd-close-box' style={{width:document.body.offsetWidth-40}}>
                            <Anchor id={item.id} />
                            <Tap onTap={()=>{this.onItemDetail(item)}}>
                                <Flex justify="between" className="prod_top">
                                    <div className="font14 mainC2 num-font">{item.applyCount}人等待审核</div>
                                </Flex>
                                <Flex justify='start' direction='row' className='user-money'>
                                    <div className='money-1'>
                                        <span className='money num-font'>
                                            {item.minAmt}-{item.maxAmt}<span>元</span>
                                        </span>
                                        <span className='text'>
                                            出借范围
                                        </span>
                                    </div>
                                    <div className='money-2'>
                                        <span className='money num-font'>
                                            {item.interestRate}<span>%</span>
                                        </span>
                                        <span className='text'>
                                            年利率
                                        </span>
                                    </div>
                                    <div className='money-3'>
                                        <span className='money num-font'>
                                            {item.minTm}<span>{item.minTxt}</span>-{item.maxTm}<span>{item.maxTxt}</span>
                                        </span>
                                        <span className='text'>
                                            借款时长
                                        </span>
                                    </div>
                                </Flex>
                            </Tap>
                            <Tap onTap={()=>{this.onOpen(item.id)}}>                                
                                <Flex justify="center" className="prod_top bord_top">
                                    <div className="prod-div font14 mainC2">
                                        <span>重新开启</span>
                                        <img src='/imgs/credit/arrows-back.svg' className="arrow" />
                                    </div>
                                </Flex>
                            </Tap>                            
                        </div>
                    })}

                    {(info.offlineProductList.length)?<Flex justify='start' className='list-title mar16'>
                        <span className='title'>借条草稿</span>
                    </Flex>:null}
                    {info.offlineProductList.map((item) => {
                        return <div key={item.id} className='product-box' style={{width:document.body.offsetWidth-40}}>
                                <Anchor id={item.id} />
                                <Tap onTap={()=>{this.onItemShare(item)}}>
                                    <Flex justify="between" className="prod_top">
                                        <div className="font14 mainC2 num-font"></div>
                                        <div className="prod-div font14 mainC2">
                                        <img src='/imgs/iou/share-icon.svg' className="share" /><span>分享</span></div>
                                    </Flex>
                                </Tap>
                                <Tap onTap={()=>{this.onItemDraft(item)}}>
                                    <Flex justify='start' direction='row' className='user-money'>                                    
                                        <div className='money-1'>
                                            <span className='money num-font'>
                                                {item.minAmount}<span>元</span>
                                            </span>
                                            <span className='text'>
                                                借款金额
                                            </span>
                                        </div>
                                        <div className='money-2'>                                            
                                        </div>
                                        <div className='money-3'>
                                            <span className='money num-font'>
                                                {item.borrowDays}<span>天</span>
                                            </span>
                                            <span className='text'>
                                                借款时长
                                            </span>
                                        </div>
                                    </Flex>
                                    <Flex justify="between" className="prod_top bord_top">
                                        <div className="font14 mainC2 num-font">{item.createTime}</div>
                                        <div className="prod-div font14 mainC2">
                                            <span>草稿详情</span>
                                            <img src='/imgs/credit/arrows-back.svg' className="arrow" />
                                        </div>
                                    </Flex>
                                </Tap>
                            </div>
                    })}                  
                </div>
                <div className="common-btn_box">
                    <Tap onTap={this.onDraft} className="span font16">添加草稿</Tap>
                    <Tap onTap={this.onAdd} className="span font16">添加出借</Tap>
                    <Tap onTap={this.onDownload} className="span font16">下载素材</Tap>
                    <Tap onTap={this.onShare}className="span font16">分享出借</Tap>
                </div>
			</div>
		)
	}
}