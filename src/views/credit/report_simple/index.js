
//简版信用报告
import './index.less'
import React, { Component} from 'react'
import PropTypes from 'prop-types'
import { Loading, Modal } from 'SERVICE/popup'
import { createForm } from 'rc-form'
import { Link, withRouter } from 'react-router-dom'
import { Flex,List,Radio, Toast } from 'antd-mobile'
import { inject, observer } from 'mobx-react'
import {Tap, Tips,PullAndPush } from 'COMPONENT'
import {util } from 'SERVICE'
const RadioItem = Radio.RadioItem;

const qrcode = process.env.NODE_ENV === 'production'?'/imgs/com/yyj_qr_small.jpg':'/imgs/iou/qrcode.jpg';//二维码
@withRouter
@inject('creditStore', 'userStore')
@observer
class Page extends Component{
    static contextTypes = {
        router: PropTypes.object.isRequired
    };
    constructor(props, context) {
        document.title = "简版信用报告";
        super(props, context)
        this.state = {
            data:'',//简版信用报告
            userId:'',
            creditSimpleReport:'',
            b_self:false,
            atten:false,  //关注公众号弹窗
            attenAct:false,
            alipay:'', //支付宝数据
            modal: false, //我要标记TA弹框
            value:'',//我要标记TA选择项
            loanList:[],//借出列表
            showMore: false,//显示加载更多按钮
            showpack: false,//显示收起全部
            showMoring: false,//正在加载中
            listLeng:5,
            totaLeng:0,
            pageInfo: {
                userId:'',
            }
        }
    };
    componentDidMount(){
        // 没有关注公众号
        if($.isWeiXin && !$.getUserInfo().subscribe){
            this.setState({
                atten:true
            })
            return;
        }
		// // 二维码用户没有注册
		// if(!$.isUserExist()){
		// 	this.setState({
        //         attenAct:true
        //      })
		// 	return;
        // }
        this.getReportSimpleInfo();
        this.getPageInfo();   //借条详情文档
    }
    
    //获取基础信息
    getReportSimpleInfo=()=>{
        // Loading.show();
        let query = util.getUrlParams(this.props.location.search);
        let _query="";
        if(query.userId){
            _query = query.userId
            if (query.userId == this.props.userStore.userInfo.userId){
                this.setState({
                    b_self:true
                })
            }else{
                this.setState({
                    b_self:false
                })
            }
        }else{
            _query=$.getUserInfo().userId
            
        }
        
        $.ajaxEX({
            type: 'GET',
            url: '/user/my/getSimpleReport',
            data:{
                userId: _query
            }
        }).then((json) => {
                switch (json.status) {
                case 200: {
                    
                    this.setState({
                        data:json.data,
                        creditSimpleReport:json.data.creditSimpleReport,
                        userId:_query,
                    })
                    if(json.data.userInfo.skipMobileAuthStatus&&json.data.creditOverdueStatus&&!this.state.b_self){
                        //如果同时出现两个弹框
                        Modal.infoX('该报告已失效（生成时间超过30天），如果需要您可以要求对方再次认证。',()=>{
                            Modal.infoX('由于通道原因，该用户缺失了运营商数据，如果该项数据是您审核的必要数据，您可以要求其重新认证。')
                        })
                    }else{
                        if(json.data.userInfo.skipMobileAuthStatus&& !this.state.b_self){//查看他人信用报告，并且对方跳过了运营商认证
                            Modal.infoX('由于通道原因，该用户缺失了运营商数据，如果该项数据是您审核的必要数据，您可以要求其重新认证。')
                        }
                        if(json.data.creditOverdueStatus&& !this.state.b_self){//查看他人信用报告，并且对方跳过了运营商认证
                            Modal.infoX('该报告已失效（生成时间超过30天），如果需要您可以要求对方再次认证。')
                        }
                    }
                    this.queryData();
                    break;
                }
                case 201: {
                    Modal.alertX('提醒', json.msg, [
                        {
                            text: '再试试', onPress: () => {
                            }
                        }]
                    )
                    break;
                }
                case 203: {
                    let tern="<p class='tit'>此用户设置信用报告仅自己可见</p>出借总额大于100万元，借款好友大于50人的用户，可对其他用户隐藏信用报告"
                    Modal.alertX('提醒', <div dangerouslySetInnerHTML={{ __html:tern }}></div>, [
                        {
                            text: '确定', onPress: () => {
                                history.back();
                            }
                        }]
                    )
                    break;
                }
            }
        }).catch((msg) => {
        }).finally(()=>{
            Loading.hide();
        })
    }

    // getPageInfo=(type)=>{
    //     Loading.show();
    //     let { query } = this.props.location;
    //     let _query="";
    //     if(query.userId){
    //         _query=query.userId
    //     }else{
    //         _query=$.getUserInfo().userId
    //     }
    //     let {pageInfo} = this.state;
    //     pageInfo.userId=_query;
    //     //列表
    //     $.ajaxE({
    //         type: 'GET',
    //         contentType: 'application/json',
    //         url: '/user/my/getBorrowList',
    //         data:pageInfo
    //     }).then((data) => {
            
    //         let {showMore, loanList, pageInfo, } = this.state;
    //         pageInfo.pageSize+=5
    //         // loanList = loanList.concat(data.list);
    //         loanList = data.list;
    //         if(data.totalRecord > loanList.length){
    //             showMore = true
    //         }else{
    //             showMore = false
    //         }
    //         this.setState({
    //             pageInfo,
    //             loanList,showMore,showMoring: false,
    //         })
    //     }).catch((msg) => {
    //         Modal.infoX(msg);
    //     }).finally(()=>{
    //         Loading.hide();
    //     })
    // }
    // onGetMore = (type)=>{
    //     let {pageInfo, loanList, } = this.state;
    //     if(type=='refresh'){
    //         loanList = [],
    //         pageInfo.pageNum = 0
    //     }
    //     this.setState({
    //         loanList,
    //         pageInfo,
    //     },function(){
    //         this.getPageInfo()
    //     })
    // } 


    getPageInfo=(type)=>{
        Loading.show();
        let query = util.getUrlParams(this.props.location.search);
        let _query="";
        console.log(query)
        if(query.userId){
            _query=query.userId
        }else{
            _query=$.getUserInfo().userId
        }
        let {pageInfo} = this.state;
        pageInfo.userId=_query;
        //列表
        $.ajaxE({
            type: 'GET',
            contentType: 'application/json',
            url: '/user/my/getBorrowList',
            data:pageInfo
        }).then((data) => {
            let {showMore, loanList,totaLeng,showpack } = this.state;
            loanList = data.list;
            totaLeng=data.totalRecord;
            if(totaLeng > 5){
                showMore = true;
                showpack=false;
            }else{
                showMore = false;
                showpack=false;
            }
            this.setState({totaLeng,loanList,showMore,showMoring: true,showpack,})
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }
    onGetMore = (type)=>{
        let {loanList, listLeng,totaLeng,showMore,showpack} = this.state;
        if(listLeng+5>totaLeng){
            showMore=false
            showpack=true;
        }else{
            showMore=true;
            showpack=false;
        }
        if(type=='refresh'){
            loanList = [],
            listLeng=0,
            this.getPageInfo();
        }
        this.setState({
            listLeng:listLeng+=5,
            loanList,showMore,showpack
        })
    } 

    //获取支付宝信息
    queryData = () =>{
        $.ajaxE({
            type: 'POST',
            url: '/credit/accredit/alipay/queryData',
            data:{
                user_id:this.state.userId
            }
        }).then((data) => {
            this.setState({
                alipay:data
            })
        }).catch((msg) => {
            console.log(msg);
        })
    }
    gotoPage=(v)=>{
        if(v=='certificate'){
            this.props.history.push({
                pathname: '/credit/certificate',
                search: '?userId=' + this.state.userId,
            });
        }else if(v=='detail'){
            this.props.history.push({
                pathname: '/credit/report_info',
                search: '?userId=' + this.state.userId
            });
        }else if(v=="memo"){
                this.props.history.push({
                    pathname: '/credit/set_remarks',
                    search: '?memo=' + this.state.data.memo+'&userId=' + this.state.userId,
                })
        }else if(v=="borrow"){
            this.props.history.push({
                pathname: '/credit/borrow_record',
                search: '?memo=' + this.state.data.memo + '&userId=' + this.state.userId,
            })
        }
        else if (v == 'alipay_record' || v =='alipay_negative'){
            this.props.history.push({
                pathname: '/credit/' + v,
                search: '?userId=' + this.state.userId,
            })
        }
        
    }
    
    // 关闭关注公众号弹窗
    onTapatten=()=>{
        this.setState({
            atten:false
        },()=>{           
            window.history.go(-1); 
        })
    }
    // 关闭关注公众号弹窗
    onTapattenAct=()=>{
        this.setState({
            attenAct:false
        },()=>{ 
            this.props.history.push({
                pathname: '/user/wy_valid/0'
            });
        })
    }

    onChangeSign = (value) => {
        this.setState({
            value: value,
        });
    }
    onOpenSign =() => {
        let { data:{userInfo} } = this.state;
        if(userInfo.signReportUserStatus){
            this.setState({
                modal: true,
            });
        }else{
            Modal.infoX('您已标记过该借款人，不可重复提交')
        }
    }
    onCloseSignState =() => {
        this.setState({
            modal: false,
        });
    }
    onCloseSign =() => {
        this.setState({
            modal: false,
        });
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/loanlater/preventDefraud/getSignUserInfo',
            data:{
                uidE:this.state.userId
            }
        }).then((data) => {
            this.getSignUserInfo(data);
        }).catch((msg) => {
            console.error(msg);
            history.back();
        }).finally(()=>{
            Loading.hide();
        })
    }
    getSignUserInfo=(val)=>{
        $.ajaxE({
            type: 'POST',
            url: '/loanlater/preventDefraud/addUserPreventDefraudSign',
            data: {
                signType:this.state.value, // 骗贷类型（黑中介、刷单出借人、刷单借款人、恶意撸款、中介操作）
                signName:(val && val.name), // 被标记的姓名
                signTelephone:(val && val.telephone), // 被标记的手机号
                signIdCardNo:(val && val.idCardNo), // 被标记的身份证号
                signWechatId:(val && val.wechatId), // 被标记的微信号
            }
        }).then((data)=>{
            // Toast.info('标记成功', 2);
            Modal.infoX('标记成功');
        }).catch((msg)=>{
            Modal.infoX( <div dangerouslySetInnerHTML={{ __html:msg }}></div>);
        }).finally(()=>{
            Loading.hide();
        })
    }
    //申请查看骗贷
    onApplyLook=()=>{
        if(this.state.data.userInfo.lendCnt==0){
            Modal.infoX('您没有出借记录，暂不能申请开通。出借人开通后，可查看平台所有骗贷标记信息！')
        }else{
            Modal.alertX('提示','骗贷标记权限仅向审核通过的出借人开放。您可以申请开通，并通过信用报告查看借款人被所有出借人标记次数', 
            [{ text: '取消', onPress: null,},
             { text: '申请', onPress: ()=>{
                $.ajaxE({
                    type: 'POST',
                    url: '/loanlater/preventDefraud/addUserPreventDefraudRequest',
                    data: {},
                }).then((data)=>{
                    Modal.infoX('提交成功，请耐心等待审核结果。');
                }).catch((msg)=>{
                    Modal.infoX(msg);
                }).finally(()=>{
                    Loading.hide();
                })
             } },]
            )
        }
    }

    render() {
        const { getFieldProps } = this.props.form;
        let {data,userId,creditSimpleReport,alipay,loanList} = this.state;
        let userInfo = data.userInfo;
        const data2 = [
            {label:'黑中介',value: 5},
            {label:'刷单出借人',value: 6},
            {label:'刷单借款人',value: 0},
            {label:'恶意撸款',value: 1},
            {label:'中介操作',value: 2},
            // {label:'资料作假',value: 3},
            // {label:'其他',value: 4},
         ];
        return (
            <div className='creditReportSimple'>
                {/* 没有关注弹窗 */}
                {this.state.atten?<div className='atten_div'>
                    <div className="atten_bg"></div>
                    <div className='atten_content'>
                        <div className='atten_detail'>
                            <p>你还没有关注【今借到】公众号</p>
                            <span>长按下方图片</span>
                            <span>点击【识别图中二维码】</span>
                            <span>点击关注即可关注</span>
                            <img src={qrcode} alt="" />
                        </div>
                        <div className='atten_footer'>
                            <Tap className="footer_btn1"  onTap={this.onTapatten}>知道了</Tap>
                        </div>
                    </div>
                </div>:null}
                <Modal
                    visible={this.state.attenAct}
                    transparent
                    maskClosable={false}
                    title="提示"
                    footer={[{ text: '去注册', onPress: () => { this.onTapattenAct() } }]}
                >
                    <p className='tip'>您还没有今借到的账号,请先去注册!</p>
                </Modal> 
                <div style={{height:'100%',overflow:'auto'}}>
                    <div className="top-header">       
                        <div className="img">
                            {data.userInfo && data.userInfo.avatarUrl?
                                <img src={data.userInfo.avatarUrl} />:
                                <img src={'/imgs/com/default_icon.svg'} />}
                            {/* <img src={data.userInfo&&data.userInfo.avatarUrl} alt=""/> */}
                        </div>
                        <div className="text">
                            <div className="name">{data.userInfo&&data.userInfo.fullName }</div>
                            <div className="phone">
                                <img src={'/imgs/com/rev-my_phone.png'} alt=""/>
                                {data.userInfo && data.userInfo.telephone}
                            </div>
                            <div className="tags">
                            {data.userInfo&&data.userInfo.bindCardStatus?<span>银行卡</span>:null}
                            {data.creditSimpleReport && data.creditSimpleReport.creditBaseInfo.baseInfo_credit_status==3?<span>基础</span>:null}
                            {data.creditSimpleReport && data.creditSimpleReport.creditBaseInfo.mobile_credit_status==3?<span>运营商</span>:null}
                            {data.creditSimpleReport && data.creditSimpleReport.creditBaseInfo.zhima_credit_status==3?<span>芝麻分</span>:null}
                            {data.creditSimpleReport && data.creditSimpleReport.creditBaseInfo.jingdong_credit_status==3?<span>京东</span>:null}
                            {data.creditSimpleReport && data.creditSimpleReport.creditBaseInfo.xuexi_credit_status==3?<span>学信</span>:null}
                            {data.creditSimpleReport && data.creditSimpleReport.creditBaseInfo.zhengxi_credit_status==3?<span>征信</span>:null}
                            {data.creditSimpleReport && data.creditSimpleReport.creditBaseInfo.house_credit_status==3?<span>房产</span>:null}
                            {data.creditSimpleReport && data.creditSimpleReport.creditBaseInfo.car_credit_status==3?<span>车产</span>:null}
                            {data.creditSimpleReport && data.creditSimpleReport.creditBaseInfo.income_credit_status==3?<span>收入</span>:null}
                            {data.creditSimpleReport && data.creditSimpleReport.creditBaseInfo.job_credit_status==3?<span>工作</span>:null}
                            {data.creditSimpleReport && data.creditSimpleReport.creditBaseInfo.shebao_credit_status==3?<span>社保</span>:null}
                            {data.creditSimpleReport && data.creditSimpleReport.creditBaseInfo.gjj_credit_status==3?<span>公积金</span>:null}
                            {data.creditSimpleReport && data.creditSimpleReport.creditBaseInfo.location_credit_status==3?<span>定位</span>:null}
                            </div>
                        </div>
                    </div>
                    {this.state.b_self?null:<div className="text-c3 two topline">
                        <span>设置备注</span>
                        <span className="white_ell">{data.memo?<Tap onTap={() => { this.gotoPage('memo') }}>{data.memo}</Tap>:<Tap onTap={() => { this.gotoPage('memo') }}>马上设置<img className="arrows" src={'/imgs/home/arrow.svg'} /></Tap>}</span>
                    </div>}
                    <div className="bgfff">
                        <div className="mat10 text-tit">骗贷风险
                        {userInfo&&userInfo.fraudStatus?null:<span className="tit_ell"><Tap onTap={() => {this.onApplyLook()}} >申请查看</Tap><img className="arrows" src={'/imgs/home/arrow.svg'} /></span>}
                        </div>
                        {userInfo&&userInfo.preventDefraudScore?<div className="text-pian">
                            <div className="left">当前骗贷分
                                <Tips className="text-left">
                                    <p style={{textAlign: 'left'}}>1.骗贷分数越高，骗贷风险越大。</p>
                                    <p style={{textAlign: 'left'}}>2.骗贷分是基于用户最新注册认证信息、操作行为及交易关系，所进行的骗贷可能性评估。</p>
                                    <p style={{textAlign: 'left'}}>3.骗贷分仅向人工审核通过的出借人展示，其它用户不可见！</p>
                                </Tips>
                            </div>
                            <div className="rig">
                                <div>
                                    <span className="yello">{userInfo&&userInfo.preventDefraudScore}分({userInfo.fraudLevel})</span>
                                    <span>风险高于平台{userInfo.fraudLevelRate}的用户</span>
                                </div>
                            </div>
                            <span className="line"></span>
                        </div>:null}
                        <div className="text-c3 two">
                            <span>骗贷标记
                                <Tips className="text-left">
                                    <p style={{textAlign: 'left'}}>1.骗贷标记来源于出借人，标记越多，骗贷可能性越大。</p>
                                    <p style={{textAlign: 'left'}}>2.仅审核通过的出借人可上传骗贷嫌疑人信息，上传信息包括姓名(选填）、手机号/身份证号/微信号中任意一项或多项。</p>
                                    <p style={{textAlign: 'left'}}>3.由于存在重名用户，建议重点参考手机号、身份证号、微信号标记次数。</p>
                                </Tips>
                            </span>
                            {userInfo && userInfo.fraudStatus && !this.state.b_self?<span className="white_ell"><Tap onTap={this.onOpenSign}>我要标记TA<img className="arrows" src={'/imgs/home/arrow.svg'} /></Tap></span>:null}
                        </div>
                        <Modal
                        popup
                        visible={this.state.modal}
                        animationType="slide-up"
                        >
                            <List className="report_model">
                                <div className="report_motit">
                                <p>选择举报原因</p>
                                <img src={'/imgs/iou/close_rep.svg'} onClick={this.onCloseSignState} />
                                </div>
                                {data2.map(i => (
                                    <RadioItem key={i.value} checked={this.state.value === i.value} onChange={() => this.onChangeSign(i.value)}>
                                    {i.label}
                                    </RadioItem>
                                ))}
                                <Tap className="report_btn" onTap={this.onCloseSign}>确定</Tap>
                            </List>
                        </Modal>
                        {userInfo?<div className="text-box">
                            <div>
                                <span>{userInfo&&userInfo.signNameCount}次</span>
                                <span className="bot">姓名</span>
                            </div>
                            <div>
                                <span>{userInfo&&userInfo.signIdCardNoCount }次</span>
                                <span className="bot">身份证号</span>
                            </div>
                            {userInfo.signTelephoneCount!==null?<div>
                                <span>{userInfo&&userInfo.signTelephoneCount}次</span>
                                <span className="bot">手机号</span>
                            </div>:null}
                            {userInfo.signWechatIdCount!==null?<div>
                                <span>{userInfo&&userInfo.signWechatIdCount }次</span>
                                <span className="bot">微信号</span>
                            </div>:null}
                        </div>:null}
                    </div>
                    <div className="bgfff">
                        <div className="mat10 text-tit">借入明细</div>
                        <div className="tab-box">
                            <div className="">
                                <span className="blod">待还</span>
                                <span>{data.creditLoanInfo && $.toYuan(data.creditLoanInfo.toRepayAmount)}元</span>
                                <img src={'/imgs/credit/report-jin.svg'} className="bg" />
                            </div>
                            <div className="blok">
                                <span className="blod">已还</span>
                                <span>{data.creditLoanInfo && $.toYuan(data.creditLoanInfo.paidAmount)}元</span>
                                <img src={'/imgs/credit/report-jin-b.svg'} className="bg" />
                            </div>
                        </div>
                        <div className="box">
                            <div className="text-c3 four">
                                <span className="big">总计
                                <Tips className="text-left">
                                    <p style={{textAlign: 'left'}}>1.总计借条包含待还、已还和有争议的借条。</p>
                                    <p style={{textAlign: 'left'}}>2.由于今借到支持分期借条和部分还款，单张借条可能计数到多种状态中。若各状态借条数相加大于借条总计，请以金额为准。</p>
                                </Tips>
                                </span>
                                <span className="yel">{data.creditLoanInfo && $.toYuan(data.creditLoanInfo.borrowTotalAmount)}元</span>
                                <span>{data.creditLoanInfo && data.creditLoanInfo.borrowTotalCount}张</span>
                                <span>{data.creditLoanInfo && data.creditLoanInfo.borrowTotalUserCount}人</span>
                            </div>
                            <div className="text-c3 four">
                                <span>今日到期</span>
                                <span className="yel">{data.creditLoanInfo && $.toYuan(data.creditLoanInfo.expireAmount)}元</span>
                                <span>{data.creditLoanInfo && data.creditLoanInfo.expireCount}张</span>
                                <span>{data.creditLoanInfo && data.creditLoanInfo.expireUserCount}人</span>
                                <span className="line"></span>
                            </div>
                            <div className="text-c3 four">
                                <span>逾期待还</span>
                                <span className="yel">{data.creditLoanInfo && $.toYuan(data.creditLoanInfo.overdueToRepayAmount)}元</span>
                                <span>{data.creditLoanInfo && data.creditLoanInfo.overdueToRepayCount}张</span>
                                <span>{data.creditLoanInfo && data.creditLoanInfo.overdueToRepayUserCount}人</span>
                            </div>  
                            <div className="text-c3 four hei">
                                <span>未逾期待还</span>
                                <span className="yel">{data.creditLoanInfo && $.toYuan(data.creditLoanInfo.normalToRepayAmount)}元</span>
                                <span>{data.creditLoanInfo && data.creditLoanInfo.normalToRepayCount}张</span>
                                <span>{data.creditLoanInfo && data.creditLoanInfo.normalToRepayUserCount}人</span>
                                <span className="line"></span>
                            </div> 
                            <div className="text-c3 four">
                                <span>逾期已还</span>
                                <span className="yel">{data.creditLoanInfo && $.toYuan(data.creditLoanInfo.overduePaidAmount)}元</span>
                                <span>{data.creditLoanInfo && data.creditLoanInfo.overduePaidCount}张</span>
                                <span>{data.creditLoanInfo && data.creditLoanInfo.overduePaidUserCount}人</span>
                            </div> 
                            <div className="text-c3 four hei">
                                <span>未逾期已还</span>
                                <span className="yel">{data.creditLoanInfo && $.toYuan(data.creditLoanInfo.normalPaidAmount)}元</span>
                                <span>{data.creditLoanInfo && data.creditLoanInfo.normalPaidCount}张</span>
                                <span>{data.creditLoanInfo && data.creditLoanInfo.normalPaidUserCount}人</span>
                                <span className="line"></span>
                            </div>
                            <div className="text-c3 four">
                                <span>有争议</span>
                                <span className="yel">{data.creditLoanInfo && $.toYuan(data.creditLoanInfo.disputeAmount)}元</span>
                                <span>{data.creditLoanInfo && data.creditLoanInfo.disputeCount}张</span>
                                <span>{data.creditLoanInfo && data.creditLoanInfo.disputeUserCount}人</span>
                            </div>
                            <div className="text-c3 four hei">
                                <span>待确认借条</span>
                                <span className="yel">{data.creditLoanInfo && $.toYuan(data.creditLoanInfo.pendingAmount)}元</span>
                                <span>{data.creditLoanInfo && data.creditLoanInfo.pendingCount}张</span>
                                <span>{data.creditLoanInfo && data.creditLoanInfo.pendingUserCount}人</span>
                            </div>  
                            <div className="text-c3 two hei">
                                <span>发起举报：{data.creditLoanInfo && data.creditLoanInfo.toReportedCount}次(接受<span className="yel">{data.creditLoanInfo && data.creditLoanInfo.toReportedSuccessCount}次</span>)</span>
                            </div>                  
                        </div>
                        {loanList.length>0?
                        <div>
                        <div className="pad10 text-tit">借条列表</div>
                        <PullAndPush
                            showMoring={this.state.showMoring}
                            showMore = {this.state.showMore}
                            pullRefresh = {false}
                            packUp = {this.state.showpack}
                            onShowMore = {()=>{
                                this.setState({ showMoring: true },()=>{this.onGetMore()})
                            }}
                            packUpFn = {()=>{
                                this.setState({ showMoring: true },()=>{this.onGetMore('refresh')})
                            }}
                            className='cont'
                        >
                            {loanList.map((item,index) => {
                                if(index>=this.state.listLeng) return
                                return (
                                    <div className="father_div mat0">
                                    <Flex key={Math.random()}>
                                        <Flex.Item>跟{item.name}借款{$.toYuan(item.amount) }元</Flex.Item>
                                        <Flex.Item>{item.borrowTime}~{item.repayTime }</Flex.Item>
                                    </Flex>
                                    <Flex className="father_bot">
                                        <Flex.Item className="col66">ID：{item.loanShowId}</Flex.Item>
                                        <Flex.Item>
                                        <span className="auxiC1">{item.status==1?`逾期待还(已逾期${item.overdueDays}天)`:null}</span>
                                        <span className="auxiC2">{item.status==2?"今日到期":null}</span>
                                        <span className="auxiC2">{item.status==3?"未逾期待还":null}</span>
                                        <span className="col66">{item.status==4?`逾期已结清(曾逾期${item.overdueDays}天)`:null}</span>
                                        <span className="col66">{item.status==5?"未逾期已结清":null}</span>
                                        <span className="mainC1">{item.status==6?"有争议":null}</span>
                                        </Flex.Item>
                                    </Flex>
                                    </div>
                                )
                            })}
                        </PullAndPush>
                        </div>:null}
                    </div> 

                    <div className="text-s big">
                        <span>个人数据脱敏处理规则
                        <Tips className="text-left">
                            <p style={{textAlign: 'left'}}>信用报告里有关本人的身份证号、居住地址、好友姓名和联系方式等敏感信息，平台都做了脱敏处理，非本人不能看到完整信息。</p>
                            <p style={{textAlign: 'left'}}>除非逾期，出借人可以看到借款人紧急联系人的完整手机号码。</p>
                        </Tips>
                        </span>
                        <span></span>
                    </div> 
                    <div className="img-text-cell active" style={{ marginTop: "0" }}>
                        <div className="img" style={{ width: "0.18rem", height: "0.18rem" }}>
                            <img src={'/imgs/com/simpleIouRecord.svg'} alt="" />
                        </div>
                        <div className="text">
                            <span>
                                借贷记录（数据源于今借到）
                            </span>
                        </div>
                        <span className="line"></span>
                    </div>
                    <div className="hidden-box">
                        <div className="text-c3 four">
                            <span>类型</span>
                            <span>借入</span>
                            <span>借出</span>
                            <span>担保</span>
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 four">
                            <span>最大金额</span>
                            <span>{data.userInfo&& $.toYuan(data.userInfo.borrowMaxAmount)}</span>
                            <span>{data.userInfo&& $.toYuan(data.userInfo.lendMaxAmount) }</span>
                            <span>{data.userInfo&& $.toYuan(data.userInfo.guaranteeMaxAmount) }</span>
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 four">
                            <span>累计笔数</span>
                            <span>{data.userInfo&&data.userInfo.borrowCnt	}</span>
                            <span>{data.userInfo&&data.userInfo.lendCnt	}</span>
                            <span>{data.userInfo&&data.userInfo.guaranteeCnt}</span>
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 four">
                            <span>累计人数</span>
                            <span>{data&&data.borrowFromPersonCount		}</span>
                            <span>{data&&data.lendToPersonCount	 }</span>
                            <span>{data&&data.guaranteeToPersonCount		}</span>
                            <span className="line"></span>
                        </div>       
                        <div className="text-c3 four row2">
                            <span>
                                <span>当天借当天</span>
                                <span>还笔数占比</span>
                                <Tips>
                                    <p style={{textAlign: 'left'}}>该指标是指您生效的所有借条中在借款日当天就还款的借条占您所有借条的比例</p>
                                </Tips>
                                {/* <img  src={'/imgs/com/info.svg'} alt=""/> */}
                            </span>
                            <span>{data&&data.borrowTodayRepayPercent	}</span>
                            <span>{data&&data.lendTodayRepayPercent	}</span>
                            <span>--</span>
                            <span className="line"></span>
                        </div>                                                          
                        <div className="text-c3 four">
                            <span>当前金额</span>
                            <span>{data.userInfo&& $.toYuan(data.userInfo.currentBorrowAmount) }</span>
                            <span>{data.userInfo&& $.toYuan(data.userInfo.currentLendAmount) }</span>
                            <span>{data.userInfo&& $.toYuan(data.userInfo.currentGuaranteeAmount) }</span>
                            <span className="line"></span>
                        </div>                     
                    </div> 

                    <div className="img-text-cell active">
                        <div className="img" style={{ width: "0.18rem", height: "0.18rem" }}>
                            <img src={'/imgs/com/simpleOverdue.svg'} alt="" />
                        </div>
                        <div className="text">
                            <span>
                                逾期记录（数据源于今借到）
                            </span>
                        </div>
                        <span className="line"></span>
                    </div>
                    <div className="hidden-box">
                        <div className="text-c3 ">
                            <span>类型</span>
                            <span>金额</span>
                            <span>次数</span>
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 ">
                            <span>逾期占比</span>
                            <span>{data&&data.overdueAmtPercent}</span>
                            <span>{data&&data.overdueCntPercent}</span>
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 ">
                            <span>最大逾期</span>
                            <span>{data.userInfo&& $.toYuan(data.userInfo.overdueAmount) }</span>
                            <span>{data.userInfo&&data.userInfo.overdueCnt}</span>
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 ">
                            <span>≥7天逾期</span>
                            <span>{data.userInfo&& $.toYuan(data.userInfo.overdue7daysAmount) }</span>
                            <span>{data.userInfo&&data.userInfo.overdue7daysCnt}</span>
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 ">
                            <span>当前逾期</span>
                            <span>{data.userInfo&& $.toYuan(data.userInfo.currentOverdueAmount) }</span>
                            <span>{data.userInfo&&data.userInfo.currentOverdueCnt}</span>
                            <span className="line"></span>
                        </div>                    
                    </div>



                    {alipay?<div>
                    <div className="img-text-cell active">
                        <div className="img" style={{ width: "0.18rem", height: "0.18rem" }}>
                            <img src={'/imgs/credit/rev-zhifubao.svg'} alt="" />
                        </div>
                        <div className="text">
                            <span>
                                支付宝（数据源于支付宝）
                            </span>
                        </div>
                        <span className="line"></span>
                    </div>
                    <div className="hidden-box">
                        <div className="text-c3 two">
                            <span>姓名</span>
                            <span>{alipay.fullName}</span>
                            {/* <span><img src={'/imgs/credit/mate-true.svg'} style={{'verticalAlign': 'sub','marginRight': '5px'}} />匹配成功</span> */}
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 two">
                            <span>身份证号</span>
                            <span>{alipay.idCardNo}</span>
                            {/* <span><img src={'/imgs/credit/mate-false.svg'} style={{'verticalAlign': 'sub','marginRight': '5px'}} />匹配失败</span> */}
                            <span className="line"></span>
                        </div>
                        {/* <div className="text-c3 two">
                            <span>支付宝账号</span>
                            <span>130****1111</span>
                            <span className="line"></span>
                        </div> */}
                        <div className="text-c3 two">
                            <span>芝麻信用分</span>
                            <span className="colff90">{alipay.zhimaScore}分</span>
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 two">
                            <span>负面记录</span>
                            {alipay.badRecords && alipay.badRecords.length>0?<span onClick={() => { this.gotoPage('alipay_negative') }}>{alipay.badRecords.length}次 <img src={'/imgs/com/rightBtn.svg'} style={{'verticalAlign': 'sub'}} /></span>:<span>0次</span>}
                            
                            <span className="line"></span>
                        </div>   
                        {/* <div className="text-c3 two">
                            <span>守约记录</span>
                            <span>0次</span>
                            <span className="line"></span>
                        </div>  
                        <div className="text-c3 two">
                            <span>授权记录</span>
                            <span>0次</span>
                            <span className="line"></span>
                        </div>   */}
                        <div className="text-c3 two">
                            <span>总资产</span>
                            <span>{alipay.allBalance}元</span>
                            <span className="line"></span>
                        </div> 
                        <div className="text-c3 two">
                            <span>余额</span>
                            <span>{alipay.yue}元</span>
                            <span className="line"></span>
                        </div> 
                        <div className="text-c3 two">
                            <span>余额宝</span>
                            <span>{alipay.yuebaoBaleance}元</span>
                            <span className="line"></span>
                        </div> 
                        <div className="text-c3 two">
                            <span>花呗总额度</span>
                            <span>{alipay.huabeiAmount}元</span>
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 two">
                            <span>花呗消费金额</span>
                            <span>{alipay.huabeiUsedAmount}元</span>
                            <span className="line"></span>
                        </div>   
                        <div className="text-c3 two">
                            <span>花呗可用金额</span>
                            <span>{alipay.huabeiAvailedAmount}元</span>
                            <span className="line"></span>
                        </div>  
                        <div className="text-c3 two">
                            <span>交易详情</span>
                            <Tap onTap={() => { this.gotoPage('alipay_record') }} className="colff90">点击查看</Tap>
                            <span className="line"></span>
                        </div>                
                    </div>
                    </div>:null}


                    <div className="img-text-cell active">
                        <div className="img" style={{ width: "0.19rem", height: "0.19rem" }}>
                            <img src={'/imgs/com/simpleBereport.svg'} alt="" />
                        </div>
                        <div className="text">
                            <span>
                                被举报记录（数据源于今借到）
                            </span>
                        </div>
                        <span className="line"></span>
                    </div>
                    <div className="hidden-box">
                        <div className="text-c3 two">
                            <span>因违约被举报次数</span>
                            <span>{data.userInfo&&data.userInfo.reportedCnt}</span>
                            <span className="line"></span>
                        </div>
                    
                    </div>



                    <div className="img-text-cell active">
                        <div className="img " style={{ width: "0.18rem", height: "0.21rem" }}>
                            <img src={'/imgs/com/riskAssessment.png'} alt="" />
                        </div>
                        <div className="text">
                            <span>
                                风险排查（数据源于交叉验证）
                            </span>
                        </div>
                        <span className="line"></span>
                    </div>
                    <div className="hidden-box">
                        <div className="text-c3 two">
                            <span>高法失信命中</span>
                            {data.creditSimpleReport&&data.creditSimpleReport.personReport&&data.creditSimpleReport.personReport.zhengXinReport&&data.creditSimpleReport.personReport.zhengXinReport.courtAccept?<span>{data.creditSimpleReport.personReport.zhengXinReport.courtAccept==-1?'未知':data.creditSimpleReport.personReport.zhengXinReport.courtAccept+'命中'}</span>:<span>0命中</span>}

                            <span className="line"></span>
                        </div>
                        {/* <div className="text-c3 two">
                            <span>是否在法院失信被执行人名单内</span>
                            {data.creditSimpleReport&&data.creditSimpleReport.personReport&&data.creditSimpleReport.personReport.zhengXinReport&&data.creditSimpleReport.personReport.zhengXinReport.courtAccept==0?<span>不在</span>:null}
                            {data.creditSimpleReport&&data.creditSimpleReport.personReport&&data.creditSimpleReport.personReport.zhengXinReport&&data.creditSimpleReport.personReport.zhengXinReport.courtAccept==1?<span>在</span>:null}
                            {data.creditSimpleReport&&data.creditSimpleReport.personReport&&data.creditSimpleReport.personReport.zhengXinReport&&data.creditSimpleReport.personReport.zhengXinReport.courtAccept==-1?<span>无数据</span>:null}

                            <span className="line"></span>
                        </div> */}
                        <div className="text-c3 two">
                            <span>姓名与征信是否一致</span>
                            {data.creditSimpleReport&&data.creditSimpleReport.personReport&&data.creditSimpleReport.personReport.zhengXinReport&&data.creditSimpleReport.personReport.zhengXinReport.nameEqualsZhengxin==1?<span>一致</span>:null}
                            {data.creditSimpleReport&&data.creditSimpleReport.personReport&&data.creditSimpleReport.personReport.zhengXinReport&&data.creditSimpleReport.personReport.zhengXinReport.nameEqualsZhengxin==0?<span>不一致</span>:null}
                            {data.creditSimpleReport&&data.creditSimpleReport.personReport&&data.creditSimpleReport.personReport.zhengXinReport&&data.creditSimpleReport.personReport.zhengXinReport.nameEqualsZhengxin==-1?<span>无数据</span>:null}
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 two">
                            <span>人行征信≥90天逾期记录</span>
                            <span>{data.creditSimpleReport&&data.creditSimpleReport.personReport&&data.creditSimpleReport.personReport.zhengXinReport&&data.creditSimpleReport.personReport.zhengXinReport.zhengxinOverudeCounts>=0?data.creditSimpleReport.personReport.zhengXinReport.zhengxinOverudeCounts:'无数据'}</span>
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 two">
                            <span>姓名与学信是否一致</span>
                            {data.creditSimpleReport&&data.creditSimpleReport.personReport&&data.creditSimpleReport.personReport.zhengXinReport&&data.creditSimpleReport.personReport.zhengXinReport.nameEqualsXueXin==1?<span>一致</span>:null}
                            {data.creditSimpleReport&&data.creditSimpleReport.personReport&&data.creditSimpleReport.personReport.zhengXinReport&&data.creditSimpleReport.personReport.zhengXinReport.nameEqualsXueXin==0?<span>不一致</span>:null}
                            {data.creditSimpleReport&&data.creditSimpleReport.personReport&&data.creditSimpleReport.personReport.zhengXinReport&&data.creditSimpleReport.personReport.zhengXinReport.nameEqualsXueXin==-1?<span>无数据</span>:null}
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 two">
                            <span>身份证号与学信是否一致</span>
                            {data.creditSimpleReport&&data.creditSimpleReport.personReport&&data.creditSimpleReport.personReport.zhengXinReport&&data.creditSimpleReport.personReport.zhengXinReport.idcardEqualsXueXin==1?<span>一致</span>:null}
                            {data.creditSimpleReport&&data.creditSimpleReport.personReport&&data.creditSimpleReport.personReport.zhengXinReport&&data.creditSimpleReport.personReport.zhengXinReport.idcardEqualsXueXin==0?<span>不一致</span>:null}
                            {data.creditSimpleReport&&data.creditSimpleReport.personReport&&data.creditSimpleReport.personReport.zhengXinReport&&data.creditSimpleReport.personReport.zhengXinReport.idcardEqualsXueXin==-1?<span>无数据</span>:null}
                            <span className="line"></span>
                        </div>
                    </div>
                    <div className="img-text-cell active">
                        <div className="img " style={{ width: "0.18rem", height: "0.18rem" }}>
                            <img src={'/imgs/com/simpleId.svg'} alt="" />
                        </div>
                        <div className="text">
                            <span>
                                身份信息（数据源于今借到）
                            </span>
                        </div>
                        <span className="line"></span>
                    </div>
                    <div className="hidden-box">
                        <div className="text-c3 two">
                            <span>身份证号
                            </span>
                            <span>{data.creditSimpleReport && data.creditSimpleReport.personReport && data.creditSimpleReport.personReport.id_card_num|| '未填写'}</span>
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 two">
                            <span>常用手机号
                            </span>
                            <span>{data.creditSimpleReport && data.creditSimpleReport.personReport && data.creditSimpleReport.personReport.mobileReport&& data.creditSimpleReport.personReport.mobileReport.mobilePhone || '未填写'}</span>
                            <span className="line"></span>
                        </div>                    
                        <div className="text-c3 two">
                            <span>微信号
                            </span>
                            <span>{data.creditSimpleReport && data.creditSimpleReport.personReport && data.creditSimpleReport.personReport.wechat_id || '未填写'}</span>
                            <span className="line"></span>
                        </div>

                        <div className="text-c3 two">
                            <span>现居地
                            </span>
                            <span>{data.creditSimpleReport && data.creditSimpleReport.personReport && data.creditSimpleReport.personReport.home_addr || '未填写'}</span>
                            <span className="line"></span>
                        </div>
                    </div>


                    <div className="img-text-cell active">
                        <div className="img " style={{ width: "0.18rem", height: "0.18rem" }}>
                            <img src={'/imgs/com/simpleContact.png'} alt="" />
                        </div>
                        <div className="text">
                            <span>
                                紧急联系人分析（数据源于今借到）
                            </span>
                        </div>
                        <span className="line"></span>
                    </div>
                    <div className="hidden-box">
                        <div className="text-c3 center3">
                            <span>姓名
                            </span>
                            <span>{data.creditSimpleReport && data.creditSimpleReport.urgentContactList && data.creditSimpleReport.urgentContactList[0].contact_name }</span>
                            <span>{data.creditSimpleReport && data.creditSimpleReport.urgentContactList && data.creditSimpleReport.urgentContactList[1].contact_name }</span>
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 center3">
                            <span>与本人关系
                            </span>
                            <span>{data.creditSimpleReport && data.creditSimpleReport.urgentContactList && data.creditSimpleReport.urgentContactList[0].contact_type }</span>
                            <span>{data.creditSimpleReport && data.creditSimpleReport.urgentContactList && data.creditSimpleReport.urgentContactList[1].contact_type }</span>
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 center3">
                            <span>联系方式
                            </span>
                            <span>{data.creditSimpleReport && data.creditSimpleReport.urgentContactList && data.creditSimpleReport.urgentContactList[0].contact_tel }</span>
                            <span>{data.creditSimpleReport && data.creditSimpleReport.urgentContactList && data.creditSimpleReport.urgentContactList[1].contact_tel }</span>
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 center3">
                            <span>半年内通话次数
                            </span>
                            <span>{data.creditSimpleReport && data.creditSimpleReport.urgentContactList && data.creditSimpleReport.urgentContactList[0].call_cnt }</span>
                            <span>{data.creditSimpleReport && data.creditSimpleReport.urgentContactList && data.creditSimpleReport.urgentContactList[1].call_cnt }</span>
                            <span className="line"></span>
                        </div>                                                            
                    </div>



                <div className="img-text-cell active">
                        <div className="img phone" style={{ width: "0.12rem", height: "0.18rem" }}>
                            <img src={'/imgs/com/simpleTel.png'} alt="" />
                        </div>
                        <div className="text">
                            <span>
                                手机号分析（源于运营商）
                            </span>
                        </div>
                        <span className="line"></span>
                    </div>
                    <div className="hidden-box">
                        <div className="text-c3 two">
                            <span>使用时长
                            </span>
                            <span>{data.creditSimpleReport && data.creditSimpleReport.personReport && data.creditSimpleReport.personReport.mobileReport && data.creditSimpleReport.personReport.mobileReport.telUseTm>0?data.creditSimpleReport.personReport.mobileReport.telUseTm+'个月':'未知'  }</span>
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 two">
                            <span>互通联系人
                            </span>
                            <span>{data.creditSimpleReport && data.creditSimpleReport.personReport && data.creditSimpleReport.personReport.mobileReport && data.creditSimpleReport.personReport.mobileReport.telExchange>0?data.creditSimpleReport.personReport.mobileReport.telExchange+'个':'未知' }</span>
                            <span className="line"></span>
                        </div>
                    </div>


                    {data.creditSimpleReport && data.creditSimpleReport.creditBaseInfo && data.creditSimpleReport.creditBaseInfo.jingdong_credit_status==3?<div>
                    <div className="img-text-cell active">
                        <div className="img " style={{ width: "0.16rem", height: "0.19rem" }}>
                            <img src={'/imgs/com/eConsumption.svg'} alt="" />
                        </div>
                        <div className="text">
                            <span>
                            电商消费分析（数据源于京东）
                            </span>
                        </div>
                        <span className="line"></span>
                    </div>
                    <div className="hidden-box">
                        <div className="text-c3 two">
                            <span>使用时长
                            </span>
                            <span>{ data.creditSimpleReport.personReport.ebusinessReport && data.creditSimpleReport.personReport.ebusinessReport.ebusynessTotalTm>0?data.creditSimpleReport.personReport.ebusinessReport.ebusynessTotalTm+'个月':'未知' }</span>
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 two">
                            <span>购物次数
                            </span>
                            <span>{data.creditSimpleReport.personReport.ebusinessReport && data.creditSimpleReport.personReport.ebusinessReport.ebusynessTotalCount>0?data.creditSimpleReport.personReport.ebusinessReport.ebusynessTotalCount+'次':'未知' }</span>
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 two">
                            <span>消费总额
                            </span>
                            <span>{data.creditSimpleReport.personReport.ebusinessReport && data.creditSimpleReport.personReport.ebusinessReport.ebusynessTotalAmount>0? data.creditSimpleReport.personReport.ebusinessReport.ebusynessTotalAmount.toFixed(2)+'元':'未知' }</span>
                            <span className="line"></span>
                        </div>
                    </div>
                    </div>:null}

                    {data.creditSimpleReport && data.creditSimpleReport.shebaoInfo?<div>
                    <div className="img-text-cell active">
                        <div className="img " style={{ width: "0.16rem", height: "0.20rem" }}>
                            <img src={'/imgs/com/sbImg.png'} alt="" />
                        </div>
                        <div className="text">
                            <span>
                            社保数据分析（数据源于社保） 
                            </span>
                        </div>
                        <span className="line"></span>
                    </div>
                    <div className="hidden-box">
                        <div className="text-c3 two">
                            <span>起缴日期</span>
                            <span>{data.creditSimpleReport && data.creditSimpleReport.shebaoInfo && data.creditSimpleReport.shebaoInfo.begin_date }</span>
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 two">
                            <span>参加工作日期</span>
                            <span>{data.creditSimpleReport && data.creditSimpleReport.shebaoInfo && data.creditSimpleReport.shebaoInfo.time_to_work }</span>
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 two">
                            <span>单位名称</span>
                            <span>{data.creditSimpleReport && data.creditSimpleReport.shebaoInfo && data.creditSimpleReport.shebaoInfo.company_name}</span>
                            <span className="line"></span>
                        </div>
                    </div>
                    </div>:null}

                    {data.creditSimpleReport && data.creditSimpleReport.gjjInfo?<div>
                    <div className="img-text-cell active">
                        <div className="img " style={{ width: "0.19rem", height: "0.21rem" }}>
                            <img src={'/imgs/com/gjjImg.svg'} alt="" />
                        </div>
                        <div className="text">
                            <span>
                            公积金数据分析（数据源于公积金）
                            </span>
                        </div>
                        <span className="line"></span>
                    </div>
                    <div className="hidden-box">
                        <div className="text-c3 two">
                            <span>开户日期</span>
                            <span>{data.creditSimpleReport.gjjInfo.begin_date }</span>
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 two">
                            <span>最后缴费日期</span>
                            <span>{data.creditSimpleReport.gjjInfo.last_pay_date }</span>
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 two">
                            <span>缴存状态</span>
                            <span>{data.creditSimpleReport.gjjInfo.pay_status_desc}</span>
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 two">
                            <span>单位名称</span>
                            <span>{data.creditSimpleReport.gjjInfo.corp_name}</span>
                            <span className="line"></span>
                        </div>
                        <div className="text-c3 two">
                            <span>电子邮箱</span>
                            <span>{data.creditSimpleReport.gjjInfo.email}</span>
                            <span className="line"></span>
                        </div>
                    </div>
                    </div>:null}

                    <div className="img-text-cell active">
                        <div className="img " style={{ width: "0.18rem", height: "0.18rem" }}>
                            <img src={'/imgs/com/num-icon.svg'} alt="" />
                        </div>
                        <div className="text">
                            <span>
                                数字证书
                            </span>
                        </div>
                        <span className="line"></span>
                    </div>
                    <div className="hidden-box">
                        <div className="text-c3 two">
                            <span>数字证书
                            </span>
                            <Tap onTap={() => { this.gotoPage('certificate') }} className="colff90">点击查看</Tap>
                            {/* <Link to="/credit/certificate">点击查看</Link> */}
                            <span className="line"></span>
                        </div>
                    </div>
                </div>   
                <div className="bottom-box">
                    <Tap onTap={() => { this.gotoPage('detail') }} className="btn">
                        详版报告
                    </Tap>
                </div>
            </div>
        )
    }
}


export default createForm()(Page);
