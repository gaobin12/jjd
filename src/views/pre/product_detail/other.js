//首页 => 出借产品列表详情（别人看）
import '../detail.less'
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Flex, List } from 'antd-mobile'
import { Loading, Modal, util } from 'SERVICE'
import { Tap } from 'COMPONENT'

//分期次数
const c_times1 = [
	{label:'2天',value: '2_0'},
	{label:'3天',value: '3_0'},
	{label:'7天',value: '7_0'},
	{label:'15天',value: '15_0'},
	{label:'21天',value: '21_0'},
	{label:'1个月',value: '1_1'},
	{label:'3个月',value: '3_1'},
	{label:'6个月',value: '6_1'},
	{label:'12个月',value: '12_1'},
	{label:'24个月',value: '24_1'},
	{label:'36个月',value: '36_1'}
];
const c_times2 = [
	{label:'3期',value: '3_1'},
	{label:'6期',value: '6_1'},
	{label:'12期',value: '12_1'},
];


@withRouter
@inject('userStore','preProductStore','preLoanStore')
@observer
export default class Page extends Component {

	constructor (props, context) {
		document.title = "借条详情"; 
		super(props, context)
        const query = util.getUrlParams(props.location.search);
		this.state = { 
			id:query.id,
			//是否显示密码框
			//关注公众号弹窗
			atten:false,   
			popupPwd:false,
			info:{
				uid:'', //String 用户id
                fullName:'', //String 用户名
                avatarUrl:null, //String 用户头像地址
                telephone:'', //String 登陆手机号
                idCardNo:'',//String 身份证号
                toReceiveAmount:'', //Double 用户待收总额
                toRepayAmount:'', //Double 用户待还总额
                borrowAmount:'', //Double 用户借入总额
                guaranteeAmount:'', //Double 用户担保总额
                product:{
                    originalId:'',
                    createDate:'',
                    minAmount:'',
                    maxAmount:'',
                    minTm:'',
                    minTxt:'',
                    maxTm:'',
                    maxTxt:'',
                    repayTypeText:'',
                    interestRate:'',
                    creditInfo:'',
                    memo:''
                },
                statisProduct:{
                    applyCount:'',
                    passCount:''
                }
			}
		};
	}
	
	componentDidMount(){
        this.props.preLoanStore.clearInfo();
		this.getPageInfo();
		// if(this.props.userStore.userInfo.subscribe){
		// 	this.setState({
		// 		atten:true
		// 	})
		// }
	}

	//获取页面数据
	getPageInfo=()=>{
        Loading.show();
        const { userStore,preProductStore } = this.props;
		$.ajaxE({
			type: 'GET',
			url: '/loanpre/product/getProductInfo',
			data:{
                id:this.state.id,
                openId:this.props.userStore.userInfo.openId,
            }
		}).then((data)=>{
			let { product,statisProduct } = data;
            let creditInfo = [];
            if(product.requireXuexinInfo) creditInfo.push("学信");
            if(product.requireZhengxinInfo) creditInfo.push("征信");
            if(product.requireCarInfo) creditInfo.push("车辆");
            if(product.requireHouseInfo) creditInfo.push("房产");
            if(product.requireIncomeInfo) creditInfo.push("收入");
            if(product.requireJobInfo) creditInfo.push("工作");
            if(product.requireGjjInfo) creditInfo.push("公积金");
            if(product.requireJdInfo) creditInfo.push("京东");
			if(product.requireSbInfo) creditInfo.push("社保");
			product.creditInfo = creditInfo.join(',');
            product.repayTypeText = $.repayType(product.repayType);
            
            product.id = this.state.id;
            product.fullName = data.fullName;
            product.telephone = data.telephone;
            product.avatarUrl = data.avatarUrl;
            product.applyCount = statisProduct.applyCount;
            product.passCount = statisProduct.passCount;
			product.createDate = (new Date(product.createDate*1000)).Format('yyyy-MM-dd hh:mm:ss');
			this.props.preProductStore.setTimeText(product);
            
            let arr = [],flag = false;
            if(product.repayType){
                c_times2.forEach((item)=>{
                    if(item.value==(product.minTm+'_'+product.minTimeUnit)){
                        flag = true;
                    }
                    if(item.value==(product.maxTm+'_'+product.maxTimeUnit)){
                        flag = false;
                        arr.push(item);
                    }
                    if(flag){
                        arr.push(item);
                    }
                })
            }else{
                c_times1.forEach((item)=>{
                    if(item.value==(product.minTm+'_'+product.minTimeUnit)){
                        flag = true;
                    }
                    if(item.value==(product.maxTm+'_'+product.maxTimeUnit)){
                        flag = false;
                        arr.push(item);
                    }
                    if(flag){
                        arr.push(item);
                    }
                })
            }
            product.timesArea = arr;
			product.toReceiveAmount = $.toYuan(data.toReceiveAmount);
			product.toRepayAmount = $.toYuan(data.toRepayAmount);
			product.borrowAmount = $.toYuan(data.borrowAmount);
			product.currentGuaranteeAmount = $.toYuan(data.currentGuaranteeAmount);
			product.guaranteeAmount = $.toYuan(data.guaranteeAmount);
            
            // this.setState({
            //     info:data
			// });
            preProductStore.setDetailOther(product);            

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
		}).catch((msg)=>{
            Modal.infoX(msg);
		}).finally(()=>{
            Loading.hide();
        })
    }
    
    onApply=()=>{
        const { userStore } = this.props;

        //检查用户是否关注过今借到
        if(!userStore.checkUserAtten()){
            return;
        }

        //检查用户是否存在 让用户去注册
        if(!userStore.checkUserExist(()=>{
            this.props.history.push('/user/login_pwd');
        })){
            return;
        }

        //检查用户是否被举报
        if(!userStore.checkUserReport()){
            return;
        }

        this.props.history.push({
            pathname: '/pre/loan_apply'
		});
    }

    // 关闭关注公众号弹窗
    onTapatten=()=>{
        this.setState({
            atten:false
        })
    }
	render () {
		const { info,info:{product,statisProduct}} = this.state;
        const { userStore,preProductStore:{ detailOther } } = this.props;
		return (
			<div className="view-pre-detail" style={{paddingBottom:'50px'}}>
                <div style={{height: '100%',overflow:'auto',paddingBottom:'0.2rem'}}>					
                    <Flex justify='start' direction='column' className='list-top'>
                        <div className='top-prd-sel'></div>
                        <div className='bottom-prd-sel'></div>
                        <div className='user-box' style={{width:document.body.offsetWidth-40}}>
                            <Flex justify='start' direction='row' className='user-msg'>
                                <span className='img'>
                                    <img src={detailOther.avatarUrl?detailOther.avatarUrl:'/imgs/iou/user.svg'} />
                                </span>
                                <span className='text'>
                                    <span className='name'>{detailOther.fullName}</span>
                                    <span className='tel num-font'>{detailOther.telephone}</span>
                                </span>
                            </Flex>
                            <Flex justify='start' direction='row' className='user-money prd-com'>
                                <div className='money-1'>
                                    <span className='money num-font'>
                                        {detailOther.toReceiveAmount}<span>元</span>
                                    </span>
                                    <span className='text'>
                                        待收金额
                                    </span>
                                </div>
                                <div className='money-2'>
                                    <span className='money num-font'>
                                        {detailOther.toReceiveAmount}<span>元</span>
                                    </span>
                                    <span className='text'>
                                        待还金额
                                    </span>
                                </div>
                                <div className='money-3'>
                                    <span className='money num-font'>
                                        {detailOther.toReceiveAmount}<span>元</span>
                                    </span>
                                    <span className='text'>
                                        正在担保
                                    </span>
                                </div>
                            </Flex>
                            <Flex justify="between"  className='prd-btn'>
                                <Tap className="com-btn-border--big">全部产品</Tap>
                                <Tap className="com-btn-solid--big">信用报告</Tap>
                            </Flex>
                        </div>
                    </Flex>
                    <Flex justify='start' className='list-title'>
                        <span className='title'>借款内容</span>
                    </Flex>
                    <List className="detail_list">
                        <List.Item>
                            <img className='time-img' src='/imgs/iou/time.svg'/>
                            <span className='time-text num-font'>{detailOther.createDate}</span>
                            <span className="time-prd-bor">{detailOther.applyCount}人申请 &nbsp;{detailOther.passCount}人已成功借款</span>
                        </List.Item>
                        <List.Item extra={detailOther.originalId}>产品编号</List.Item>
                        <List.Item extra={$.toYuan(detailOther.minAmount)+'至'+$.toYuan(detailOther.maxAmount)+'元'}>借款金额</List.Item>
                        <List.Item extra={detailOther.minTm+detailOther.minTxt+'至'+detailOther.maxTm+detailOther.maxTxt}>借款时长</List.Item>
                        <List.Item extra={detailOther.repayTypeText}>还款方式</List.Item>
                        <List.Item extra={detailOther.interestRate+'%'}>年化利率</List.Item>
                        <List.Item extra={detailOther.creditInfo}>必备信息</List.Item>
                        <List.Item extra={detailOther.memo}>补充说明</List.Item>
                        <List.Item extra={<Link to="/agree/iou" className="link">点击查看/下载</Link>}>
                        借款协议</List.Item>
                    </List>
                </div>             
                <div className="common-btn_box">
                    <Tap onTap={this.onApply} className='c-black span font16 active'>
                      	马上申请  
                    </Tap>
                </div>
            </div>
		)
	}
}