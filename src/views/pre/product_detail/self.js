
//首页 => 出借产品列表详情（别人看）
import '../detail.less'
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Flex,Progress } from 'antd-mobile'
import { Loading, Modal, util } from 'SERVICE'
import { Tap } from 'COMPONENT'

@withRouter
@inject('userStore','preProductStore')
@observer
export default class Page extends Component {
	constructor (props, context) {
		document.title = "借条详情"; 
        super(props, context)
        const query = util.getUrlParams(props.location.search);
		this.state = { 
            id:query.id,
            tab:0,
            statisProduct:{
                viewCount:0,
                applyCount:0,
                passCount:0,
                applyRate:0,
                passRate:0,
                totalAmount:0,
                dealHour:0,
            },
            productBids:[]
		};
	}
	
	componentDidMount(){
		this.getPageInfo();
	}

	//获取信息
    getPageInfo = () => {
        Loading.show();
        const { userStore,preProductStore } = this.props;
        $.ajaxE({
            type: 'GET',
            url: '/loanpre/product/getProductInfoBySelf',
            data: {
                id: this.state.id
            }
        }).then((data) => {            
            let { product,statisProduct,productBids } = data;
            product.id = this.state.id;
            // product.maxAmount = $.toYuan(product.maxAmount);
            // product.minAmount = $.toYuan(product.minAmount);
            product.createDate = (new Date(product.createDate*1000)).Format('yyyy-MM-dd hh:mm:ss');
            preProductStore.setTimeText(product);
            preProductStore.getXuexinInfo(product);
            
            preProductStore.setDetail(product);

            statisProduct.totalAmount = $.toYuan(statisProduct.totalAmount);

            //微信分享
            $.setItem('wx_share',{
                id: this.state.id,
				path: '/pre/product_detail',
                amt: product.minAmount/100+'-'+product.maxAmount/100,
                time: product.borrowTime,
                rate: product.interestRate,
                param: {
                    loanType: 2,
                    loanTypeStr: '去出借',
                    creatorType: '出借人',
                    rate: product.interestRate,
                    creatorName: data.fullName,
                    repayDate: product.borrowTime,
                    repayType: product.repayType?'等额本息':'还本付息',
                }
            });
        }).catch((msg) => {
            Modal.infoX(msg);   
        }).finally(()=>{
            Loading.hide();
        })
    }

    closeOrOpen=(op)=>{
        const _this = this;
        const { userStore,preProductStore } = this.props;
        //检查用户是否被举报
        if(!userStore.checkUserReport()){
            return;
		}
        if (op) {
            //打开
            Loading.show();
            $.ajaxE({
                type: 'GET',
                url: '/loanpre/product/updateProductStatus',
                data: {
                    id: _this.state.id,
                    validStatus:op
                }
            }).then((data) => {
                Modal.infoX('操作成功!');
                preProductStore.setDetail({
                    validStatus:true
                });
            }).catch((msg) => {
                Modal.infoX(msg);
            }).finally(()=>{
                Loading.hide();
            })
        } else {
            //关闭
            Modal.confirmX('您确定要关闭这个出借吗！', function () {
                Loading.show();
                $.ajaxE({
                    type: 'GET',
                    url: '/loanpre/product/updateProductStatus',
                    data: {
                        id: _this.state.id,
                        validStatus:op
                    }
                }).then((data) => {
                    Modal.infoX('操作成功!');
                    preProductStore.setDetail({
                        validStatus:false
                    });
                }).catch((msg) => {
                    Modal.infoX(msg);
                }).finally(()=>{
                    Loading.hide();
                })
            });
        }
    }

    onDownload=()=>{
        
    }

    onShare=()=>{
        
    }

	render () {
        const { statisProduct, productBids } = this.state; 
		const { userStore, preProductStore:{detail} } = this.props;
		return (
			<div className="view-pre-detail"  style={{paddingBottom:'50px'}}>
                <div style={{height: '100%',overflow:'auto',paddingBottom:'0.2rem'}}>	
                    <Flex justify='start' className='list-title mar16'>
                        <span className='title'>出借指标</span>
                    </Flex>
                    <div className="product-box" style={{width:document.body.offsetWidth-40}}>
                        <Flex justify='start' direction='row' className='user-money'>
                            <div className='money-1'>
                                <span className='money num-font'>
                                    {statisProduct.viewCount}
                                </span>
                                <span className='text fontC4'>
                                    总浏览量
                                </span>
                            </div>
                            <div className='money-2'>
                                <span className='money num-font'>
                                    {statisProduct.applyCount}
                                </span>
                                <span className='text fontC4'>
                                    申请量
                                </span>
                            </div>
                            <div className='money-3'>
                                <span className='money num-font'>
                                    {statisProduct.passCount}
                                </span>
                                <span className='text fontC4'>
                                    通过量
                                </span>
                            </div>
                        </Flex>

                        <div className="pass-rate-div">
                            <div className="show-number-div"><span className="show-number">浏览量 {statisProduct.viewCount}</span></div>
                            <div className="show-info">
                                <div aria-hidden="true" className="show_label font14 fontC1">申请率</div>
                                <div className="progress">
                                    {statisProduct.applyRate?<Progress percent={statisProduct.applyRate} position="normal" />
                                    :<div className="no-data-pass"></div>}
                                </div>
                                
                                <div className={statisProduct.applyRate?"pass-data":"pass-data no-data"}>
                                    <i></i>
                                    <p>{statisProduct.applyRate}%</p>
                                </div>
                                
                            </div>
                            <div className="show-number-div mart20"><span className="show-number">申请量 {statisProduct.applyCount}</span></div>
                            <div className="show-info">
                                <div aria-hidden="true" className="show_label font14 fontC1">通过率</div>
                                <div className="progress">
                                    {statisProduct.passRate?<Progress percent={statisProduct.passRate} position="normal" />
                                    :<div className="no-data-pass"></div>}
                                </div>
                                <div className={statisProduct.passRate?"pass-data":"pass-data no-data"}>
                                    <i></i>
                                    <p>{statisProduct.passRate}%</p>
                                </div>
                            </div>
                            </div>
                            <Flex justify="between" className="prod_top bord_bot">
                                <div className="font12 fontC1">出借总额 {statisProduct.totalAmount/10000}万元</div>
                                <div className="prod-div font12 fontC1">
                                <span>处理速度  {statisProduct.dealHour}小时</span>
                                </div>
                            </Flex>
                        </div>
                    <Flex justify="center" className="prd-sel-detail">
                        <div className="prod-div font14 fontC4">
                            <span>查看出借内容</span>
                            <img src='/imgs/credit/arrows-gray.svg' className="arrow" />
                        </div>
                    </Flex>
                    <div className="com-br"></div>      

                    <Flex justify='center' className='tab'>
                        <Tap onTap={()=>{this.setState({tab:0})}}>
                            <span className={this.state.tab==0?'selected':''}>已申请</span>
                        </Tap>
                        <Tap onTap={()=>{this.setState({tab:1})}}>
                            <span className={this.state.tab==1?'selected':''}>已出借</span>
                        </Tap>
                    </Flex>
                    {this.state.tab==0?<div>
                        <Flex className="table_flex table-tit mart20" >
                            <Flex.Item className="head">借款人</Flex.Item>
                            <Flex.Item>借款金额</Flex.Item>
                            <Flex.Item>出借时长</Flex.Item>
                            <Flex.Item  className="arrow"></Flex.Item>
                        </Flex>
                        <Flex className="table_flex" >
                            <Flex.Item className="head">
                                <img src={'/imgs/iou/user.svg'} />
                                <span>小明</span>
                            </Flex.Item>
                            <Flex.Item>
                                <span className="font14 mainC1">500元</span>
                            </Flex.Item>
                            <Flex.Item>
                                <span className="font14 mainC1">4个月</span>
                            </Flex.Item>
                            <Flex.Item className="arrow">
                                <img src='/imgs/credit/arrows-gray.svg' className="arrow" />
                            </Flex.Item>
                        </Flex>
                        <Flex className="table_flex" >
                            <Flex.Item className="head">
                                <img src={'/imgs/iou/user.svg'} />
                                <span>小明</span>
                            </Flex.Item>
                            <Flex.Item>
                                <span className="font14 mainC1">500元</span>
                            </Flex.Item>
                            <Flex.Item>
                                <span className="font14 mainC1">5期</span>
                            </Flex.Item>
                            <Flex.Item className="arrow">
                                <img src='/imgs/credit/arrows-gray.svg' className="arrow" />
                            </Flex.Item>
                        </Flex>
                    </div>:null}
                    {this.state.tab==1?<div>
                        <Flex className="table_flex table-tit mart20" >
                            <Flex.Item className="head">出借人</Flex.Item>
                            <Flex.Item>借款金额</Flex.Item>
                            <Flex.Item>出借时长</Flex.Item>
                            <Flex.Item  className="arrow"></Flex.Item>
                        </Flex>
                        <Flex className="table_flex" >
                            <Flex.Item className="head">
                                <img src={'/imgs/iou/user.svg'} />
                                <span>小明</span>
                            </Flex.Item>
                            <Flex.Item>
                                <span className="font14 mainC1">500元</span>
                            </Flex.Item>
                            <Flex.Item>
                                <span className="font14 mainC1">4个月</span>
                            </Flex.Item>
                            <Flex.Item className="arrow">
                                <img src='/imgs/credit/arrows-gray.svg' className="arrow" />
                            </Flex.Item>
                        </Flex>
                        <Flex className="table_flex" >
                            <Flex.Item className="head">
                                <img src={'/imgs/iou/user.svg'} />
                                <span>小明</span>
                            </Flex.Item>
                            <Flex.Item>
                                <span className="font14 mainC1">500元</span>
                            </Flex.Item>
                            <Flex.Item>
                                <span className="font14 mainC1">5期</span>
                            </Flex.Item>
                            <Flex.Item className="arrow">
                                <img src='/imgs/credit/arrows-gray.svg' className="arrow" />
                            </Flex.Item>
                        </Flex>
                    </div>:null}
                </div>   
                    
                {detail.validStatus?<div className="common-btn_box">
                    <Tap onTap={()=>{this.closeOrOpen(false)}} className="span font16">关闭出借</Tap>
                    <Tap onTap={this.onDownload} className="span font16">下载素材</Tap>
                    <Tap onTap={this.onShare}className="span font16">分享出借</Tap>
                </div>:<div className="common-btn_box">
                    <Tap onTap={()=>{this.closeOrOpen(true)}} className="span font16">打开出借</Tap>
                </div>}

            </div>
		)
	}
}