
//首页 => 出借产品列表详情（别人看）
import '../detail.less'
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Flex, List, Checkbox } from 'antd-mobile'
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
@inject('userStore','preDraftStore')
@observer
export default class Page extends Component {

	constructor (props, context) {
		document.title = "借条详情"; 
		super(props, context)
		const query = util.getUrlParams(props.location.search);
		this.state = { 
			id:query.id,
			pop1:false
		};
	}
	
	componentDidMount(){
		this.getPageInfo();
		this.props.userStore.checkUserAtten()
	}

	//获取页面数据
	getPageInfo=()=>{
        Loading.show();
        const { userStore,preDraftStore } = this.props;
		$.ajaxE({
			type: 'GET',
			url: '/loanpre/product/getProductInfo',
			data:{ 
                id:this.state.id,
                openId:userStore.userInfo.openId,
            }
		}).then((data)=>{	
			let { product } = data;
			let json = {};
			json.fullName = data.fullName;
			json.repayTypeText = $.repayType(product.repayType);
			json.id = this.state.id;
			json.createDate = (new Date(product.createDate*1000)).Format('yyyy-MM-dd hh:mm:ss');
			json.borrowTime = product.borrowTime;
			json.repayTime = product.repayTime;
			json.amout = $.toYuan(product.minAmount);
			json.interestRate = product.interestRate;
			json.purposeTxt = $.purpose(product.purpose);
			json.avatarUrl = data.avatarUrl;
			json.telephone = data.telephone;
			
			json.toReceiveAmount = $.toYuan(data.toReceiveAmount);
			json.toRepayAmount = $.toYuan(data.toRepayAmount);
			json.borrowAmount = $.toYuan(data.borrowAmount);
			json.currentGuaranteeAmount = $.toYuan(data.currentGuaranteeAmount);
			json.guaranteeAmount = $.toYuan(data.guaranteeAmount);
            
            preDraftStore.setDetailOther(json);
            
            //微信分享设置
			$.setItem('wx_share',{
				id:this.state.id,
				path:'/pre/iou_detail',
				amt:json.amout,
				rate:json.interestRate,
				purpose:product.purpose,
                param: {
                    loanType: 4,
                    loanTypeStr: '借条草稿',
                    creatorType: '出借人',
                    rate: json.interestRate,
                    creatorName: json.fullName,
                    repayDate: product.borrowDays+'天',
                    repayType: '还本付息',
                }
            });
            $.wxShare();
		}).catch((msg)=>{
            Modal.infoX(msg);
		}).finally(()=>{
            Loading.hide();
        })
    }
    
    //确定
    onConfirm=()=>{
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

        //检查人脸识别
        if(!userStore.checkUserFaceId()){
            Modal.infoX('您还没有在今借到实名，请先进行人脸识别',()=>{
                this.faceVerify()
            });
			return;
        }
		//支付
		userStore.setBox({
            pay:true,
            money:8,
            onPayEnd:this.onPayApply
        });
    }

    //人脸识别
    faceVerify = () => {
        let _this = this
        // 未进行过人脸认证或者认证失败
        $.ajaxE({
            type: 'GET',
            url: '/credit/faceVerify/getToken',
            data: {
                sourceType: 5//1九宫格2极速借条//3借条草稿5//草稿详情
            }
        }).then((data) => {
            if (data != null) {
                $.setItem('fastId', _this.state.id)
                if (data.token != null) {
                    window.location.href = 'https://api.megvii.com/faceid/lite/do?token=' + data.token
                }
                if (data.ocrParam != null) {
                    window.location.href = data.ocrParam;
                }
            }
        }).catch((msg) => {
            Modal.alert('提示', msg, [
                { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
                {
                    text: '继续实名', onPress: () => {
                        this.props.history.push({
                            pathname: '/user/id_auth',
                            search:"?pathType="+JSON.stringify({ pathname: '/pre/loan_draft', query: { id: that.state.id } })                            
                        })
                    }
                },
            ]);
        })
    }
    
    //支付
	onPayApply=(data)=>{
        debugger;
        const _this = this;
        const { userStore,preDraftStore:{detailOther} } = this.props;
        let postData = {
            bindBankId:data.bindBankId, // 绑卡id(银行卡绑定表ID)
			productId:_this.state.id, // 加密后的极速借条id
			amount:800, // 极速借条手续费
			payPassword: data.payPassword, // 密码
            payMethod: data.payMethod, // 支付方式 ：0.余额 1.银行卡 2.线下 3.银联(收银台类) 4.微信(app类)
            borrowTime: detailOther.borrowTime,//确认时间
		}
		if($.isWeixin && data.payMethod==0){
            _this.state.payData = postData;
            userStore.setBox({
                pay:false,
                code:false
            })
            _this.onPayComfirm();
        }else{
			Loading.show();
			$.ajaxEX({
				type: 'POST',
				url: '/loanpre/product/payOfflineProduct',
				data:postData
			}).then((res)=>{
                if(res.status == 200){
                    res = res.data
                    if(data.payMethod==2){
                        //不需要确认
                        userStore.setBox({
                            pay:false
                        })
                        Modal.infoX('支付成功！',()=>{
                            _this.props.history.push({
                                pathname: '/'
                            }); 
                        })
                    }else if(data.payMethod==3){
                        //银联支付
                        $.payYinLian(res.payToken);
                    }else if(data.payMethod==4){//微信支付
                        //history.pushState(null, null, '/');
                        localStorage.setItem('loan_draft_back',1)
                        let payToken = JSON.parse(res.payToken)
                        $.payWeiXin(payToken);
                    }else{
                        //确认支付   余额和银行卡需要
                        //orderNo:22,payChannelType:1,payOrderNo:22,payToken:22 
                        let payData = {
                            productId:_this.state.id, //Long 求借款id
                            amount:$.toFen(data.amount),
                            orderNo:res.orderNo,//Long 商户订单号（交易id）
                            payOrderNo:res.payOrderNo, //支付订单号或协议支付绑卡流水号(第三方支付公司返回)
                            payMethod:data.payMethod,//Byte 支付方式 ：0.余额  1.银行卡  2-线下 3.银联(收银台类) 4.微信(app类)
                            payChannelType:res.payChannelType, //银行卡支付通道：0-掌上汇通P2P通道；1-掌上汇通快捷通道；2-余额支付通道；4-易联插件通道；5-易联代收代付通道；7-合利宝支付通道；8-易宝支付通道；17-富友-协议支付(代收)；18-银联WAP支付(代收)；19-联拓
                            payToken:res.payToken,//支付令牌(第三方支付公司返回)
                            payPassword: data.payPassword, // 密码
                            protocolBind:res.protocolBind,//Boolean 是否协议绑卡
                        };
                        _this.state.payData = payData;
                        userStore.setBox({
                            pay:false,
                            code:true,
                            onCodeEnd:_this.onPayComfirm
                        })
                    }
                }else if(res.status == 203 ){
                    userStore.setBox({
                        pay:false,
                        code:false
                    })
                    Modal.infoX(res.msg)
                    //日期过期，重新获取数据
                    setTimeout(() => {
                        _this.getPageInfo()
                    }, 500);
                }else{
                    Modal.infoX(res.msg)
                }
			}).catch((msg)=>{
                userStore.setBox({
                    pay:false,
                    code:false
                })
                Modal.infoX(res.msg)
			}).finally(()=>{
				Loading.hide();
			})
		}
    }
    
	//验证码确认支付
    onPayComfirm=(valus)=>{
		const _this = this;
        const { userStore,preDraftStore:{detailOther} } = this.props;
        let payData = _this.state.payData;
        if($.isWeixin && payData.payMethod==0){
            //微信环境 余额支付直接走确认
            payData.payChannelType = 2;//这个值本来应该从申请支付后台返回，现在直接走确认，所以写死
        }else{
            //接收验证码
            payData.authCode = valus;
		}
		Loading.show();
        $.ajaxE({
            type: 'POST',
            url: '/loanpre/product/payOfflineProductConfirm',
            data: payData,
        }).then((data)=>{
            userStore.setBox({
                pay:false,
                code:false
            })
			Modal.infoX('支付成功！',()=>{
				_this.props.history.push({
					pathname: '/'
				}); 
            })
        }).catch((msg)=>{
            userStore.setBox({
                pay:false,
                code:false
            })
            Modal.infoX(msg);
        }).finally(()=>{
			Loading.hide();
		})
    }
    
    onNoAgain(e){
        localStorage.setItem('iouDraftOther',e.target.checked);
    }
	
	render () {
		const { preDraftStore:{ detailOther } } = this.props;
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
                                        {detailOther.toRepayAmount}<span>元</span>
                                    </span>
                                    <span className='text'>
                                        待还金额
                                    </span>
                                </div>
                                <div className='money-3'>
                                    <span className='money num-font'>
                                        {detailOther.guaranteeAmount}<span>元</span>
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
                        </List.Item>
                        <List.Item extra={detailOther.borrowerName}>借款人</List.Item>
                        <List.Item extra={detailOther.fullName}>出借人</List.Item>
                        <List.Item extra={detailOther.amout+"元"}>借款金额</List.Item>
                        <List.Item extra={detailOther.borrowTime}>借款时间</List.Item>
                        <List.Item extra={detailOther.repayTime}>还款时间</List.Item>
                        <List.Item extra={detailOther.interestRate+"%"}>借款利率</List.Item>
                        <List.Item extra={detailOther.purposeTxt}>借款用途</List.Item>
                        <List.Item extra={<Link to="/agree/iou" className="link">点击查看/下载</Link>}>
                        借款协议</List.Item>
                    </List>
                </div>
                <div className="common-btn_box">
                    <Tap onTap={this.onConfirm} className='c-black span font16 active'>
                      	确定  
                    </Tap>
                </div>

				<Modal visible={this.state.pop1}
                        transparent
                        maskClosable={false}
                        footer={[
                            { text: '知道了', onPress: () => {this.setState({pop1:false})}}
                        ]}>
                            <div className="model_common">
                                <img src={'/imgs/iou/model-error.svg'} className="model_img" />
                                <div className="model_tit">补借条有风险，推荐求借款</div>
                                <div className="model_font mart16 marb0">
                                补借条不能通过平台走账，存在较大的欺诈风险，请确保已经收到钱再来补借条，
                                如果不是非常亲密的关系，建议您使用<span>求借款</span></div>
                                <Checkbox.AgreeItem onChange={this.onNoAgain} className="checkbox_comm_div">
                                    不在提示
                                </Checkbox.AgreeItem>
                            </div>
                    </Modal>
            </div>
		)
	}
}