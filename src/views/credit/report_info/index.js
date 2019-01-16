
//信用报告
import '../credit.less'
import './index.less'
import '../../../less/common.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { Picker, List, InputItem, Flex } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Loading, Modal, util } from 'SERVICE'
import { inject, observer } from 'mobx-react'
import { Tap } from 'COMPONENT'
const Item = List.Item;
const Brief = Item.Brief;
const qrcode = process.env.NODE_ENV === 'production'?'/imgs/com/yyj_qr_small.jpg':'/imgs/iou/qrcode.jpg';//二维码

@withRouter
@inject('creditStore','userStore')
@observer
class Page extends Component {
    constructor(props, context) {
        document.title = "信用报告";
        super(props, context)
        const { userStore, creditStore } = this.props;
        let query = util.getUrlParams(this.props.location.search);
        this.state = {
            userId: query.userId,
            base_state:1,
            alipay:'', //支付宝数据
            attenAct:true,
            creditLoanInfo: '',
            creditDetailReport: '',
            jdlist:[],//京东交易记录
            mobilelist:[],//话费列表
            Contactlist:[],//通话记录列表
            creditData:creditStore.creditData
        }
    }

    //页面初始函数
    componentDidMount() {
        console.log()
        const { userStore} = this.props;
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
        //this.getReportSimpleInfo()
        this.getReportDetailInfo()
    }
    //获取基础信息
    getReportDetailInfo = () => {
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/user/my/getDetailReport',
            data: {
                userId: this.state.userId,
            }
        }).then((data) => {
            //保存用户数据
            let xuexinImg = "";
            if (data.creditDetailReport && data.creditDetailReport.personReport && data.creditDetailReport.personReport.head) {
                xuexinImg = data.creditDetailReport.personReport.head
            }
            this.setState({
                creditLoanInfo: data.creditLoanInfo,
                creditDetailReport: data.creditDetailReport,
                xuexinImg: xuexinImg,
            });

        }).catch((msg) => {
            console.error(msg);
        }).finally(() => {
            Loading.hide();
        })

    };
    //获取认证状态
    getCreditInfo = () => {
        Loading.show();
        let { creditData } = this.state;
        $.ajaxE({
            type: 'GET',
            url: '/credit/user/getCreditSwitch',
            data: {}
        }).then((data) => {
            this.setState({
                creditData: data,
            })
        }).catch((msg) => {
            console.log(msg);
            //Modal.infoX(msg);
        }).finally(() => {
            Loading.hide();
        })
    }
    formatDate = (time) => {
        return new Date(time * 1000).Format('yyyy-MM-dd');
    }
    onTapof=(v)=>{
        if(v==5){
            this.getEbusinessExpense()
        }
        if(v==4){
            this.getMobileBill()
            // this.getContactList()
        }
        if(v==14){
            this.queryData()
        }
        this.setState({
            base_state:v
        })
    }
    //京东交易列表
    getEbusinessExpense = () => {
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/credit/user/getEbusinessExpense',
            data: {
                userId: this.state.userId
            }
        }).then((data) => {
            //保存用户数据
            this.setState({
                jdlist: data
            })
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(() => {
            Loading.hide();
        })
    }
    //获取支付宝信息
    queryData = () => {
        $.ajaxE({
            type: 'POST',
            url: '/credit/accredit/alipay/queryData',
            data: {
                user_id: this.state.userId,
            }
        }).then((data) => {
            this.setState({
                alipay: data
            })
        }).catch((msg) => {
            console.log(msg);
        })
    }
    //运营商话费详情
    getMobileBill = () => {
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/credit/user/getMobileBill',
            data: {
                userId: this.state.userId
            }
        }).then((data) => {
            //保存用户数据
            this.setState({
                mobilelist: data
            })
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(() => {
            Loading.hide();
        })
    }
    //运营商通话记录详情
    getContactList = () => {
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/credit/user/getContactList',
            data: {
                userId: this.state.userId
            }
        }).then((data) => {
            //保存用户数据
            this.setState({
                Contactlist: data
            })
        }).catch((msg) => {
            console.log(msg);
        }).finally(() => {
            Loading.hide();
        })
    }
    gotoPage=(v)=>{
        this.props.history.push({
            pathname: '/credit/' + v,
            search: '?userId=' + this.state.userId,
        })
    }

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        const { base_state, alipay, creditDetailReport, creditLoanInfo, creditData}=this.state;
        return (
            <div className='view-credit-all'>
                {base_state==1?<div className="view-credit-report-item">
                    <Flex justify="center" className="step_report first">
                        <img src={this.state.xuexinImg ? this.state.xuexinImg : '/imgs/credit/sel-base.svg'} alt="" />
                    </Flex>
                    <List className="credit-base">
                        <Item className="cred-base-font" extra={creditDetailReport && creditDetailReport.personReport && creditDetailReport.personReport.real_name}
                        >姓名</Item>
                        <Item className="cred-base-font" extra={creditLoanInfo && creditLoanInfo.registTelephone}
                        >手机号</Item>
                        <Item className="cred-base-font" extra={creditDetailReport && creditDetailReport.personReport && creditDetailReport.personReport.id_card_num}
                        >身份证号</Item>
                        <Item className="cred-base-font" extra={creditDetailReport && creditDetailReport.personReport && creditDetailReport.personReport.wechat_id}
                        >微信号</Item>
                        <Item className="cred-base-font" extra={creditDetailReport && creditDetailReport.personReport && creditDetailReport.personReport.home_addr}
                        >现居地</Item>
                        {/* <Item className="cred-base-font" extra={creditDetailReport && creditDetailReport.personReport && this.formatDate(creditDetailReport.personReport.credit_tm)}
                        >注册时间</Item> */}
                    </List>
                </div>:null}
                {base_state==2?<div className="view-credit-report-item">
                    <Flex justify="center" className="step_report">
                        <img src={'/imgs/credit/sel-shuju.svg'} />
                    </Flex>
                    <List className="credit-base">
                        <Item className="cred-base-333" extra="更新时间"  
                        >数据源</Item>
                        {creditDetailReport && creditDetailReport.dataSourceList && creditDetailReport.dataSourceList.length > 0 ?
                            creditDetailReport.dataSourceList.map((ele, index) => {
                                let { name, use_time, binding_time } = ele;
                                return <Item className="cred-base-666" extra={binding_time ? this.formatDate(binding_time) : '未知'}
                                >{name}</Item>
                            }) : null
                        }
                    </List>
                </div>:null} 
                {base_state==3?<div className="view-credit-report-item">
                    <Flex justify="center"  className="step_report">
                        <img src={'/imgs/credit/sel-loan.svg'} />
                    </Flex>
                    <Flex className="report">
                        <span className="form-line"></span>
                        <span className="form-font">借贷数据分析</span>
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>借入</Flex.Item>
                        <Flex.Item>累计{creditLoanInfo && creditLoanInfo.borrowCount}次</Flex.Item>
                        <Flex.Item>最大{creditLoanInfo && $.toYuan(creditLoanInfo.borrowAmount)}元</Flex.Item>
                        <Flex.Item className="mainC1" onClick={() => { this.gotoPage('borrow_record') }}>点击查看</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>借出</Flex.Item>
                        <Flex.Item>累计{creditLoanInfo && creditLoanInfo.lendCount}次</Flex.Item>
                        <Flex.Item>最大{creditLoanInfo && $.toYuan(creditLoanInfo.lendAmount)}元</Flex.Item>
                        <Flex.Item className="mainC1" onClick={() => { this.gotoPage('lend_record') }}>点击查看</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>担保</Flex.Item>
                        <Flex.Item>累计{creditLoanInfo && creditLoanInfo.guaranteeCount}次</Flex.Item>
                        <Flex.Item>最大{creditLoanInfo && $.toYuan(creditLoanInfo.guaranteeAmount)}元</Flex.Item>
                        <Flex.Item className="mainC1" onClick={() => { this.gotoPage('guarantee_record') }}>点击查看</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>逾期</Flex.Item>
                        <Flex.Item>累计{creditLoanInfo && creditLoanInfo.overdueCount}次</Flex.Item>
                        <Flex.Item>最大{creditLoanInfo && $.toYuan(creditLoanInfo.overdueAmount)}元</Flex.Item>
                        <Flex.Item className="mainC1" onClick={() => { this.gotoPage('overdue_record') }}>点击查看</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>被举报</Flex.Item>
                        <Flex.Item>累计{creditLoanInfo && creditLoanInfo.reportedCount}次</Flex.Item>
                        <Flex.Item>--</Flex.Item>
                        <Flex.Item className="mainC1" onClick={() => { this.gotoPage('reported_record') }}>点击查看</Flex.Item>
                    </Flex>
                    {/* <Flex className="report">
                        <span className="form-line"></span>
                        <span className="form-font">风险借贷统计</span>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">当前待还</Flex.Item>
                        <Flex.Item className="text-right">200元</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">周借条超过5笔的次数</Flex.Item>
                        <Flex.Item className="text-right"><span className="yellow">1</span>次 </Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">当天借当天还笔数</Flex.Item>
                        <Flex.Item className="text-right"><span className="yellow">1</span>次</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">当天借当天还笔数占比</Flex.Item>
                        <Flex.Item className="text-right">20%</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">同城借款笔数</Flex.Item>
                        <Flex.Item className="text-right"><span className="yellow">1</span>次 </Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">同城借款笔数占比</Flex.Item>
                        <Flex.Item className="text-right">60%</Flex.Item>
                    </Flex>
                    <Flex className="report">
                        <span className="form-line"></span>
                        <span className="form-font">逾期记录</span>
                    </Flex>
                    <Flex className="table_flex table-tit" >
                        <Flex.Item>类型</Flex.Item>
                        <Flex.Item>金额</Flex.Item>
                        <Flex.Item>次数</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>逾期占比</Flex.Item>
                        <Flex.Item>0%</Flex.Item>
                        <Flex.Item>30%</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>最大逾期</Flex.Item>
                        <Flex.Item>2200元</Flex.Item>
                        <Flex.Item>99</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>≥七天逾期</Flex.Item>
                        <Flex.Item>2200元</Flex.Item>
                        <Flex.Item>99</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>当前逾期</Flex.Item>
                        <Flex.Item><span className="yellow">9999</span>元</Flex.Item>
                        <Flex.Item><span className="yellow">99</span></Flex.Item>
                    </Flex>
                    <Flex className="report">
                        <span className="form-line"></span>
                        <span className="form-font">举报记录</span>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">被举报次数</Flex.Item>
                        <Flex.Item className="text-right"><span className="yellow" >1</span>次<img src='/imgs/credit/arrows-gray.svg' className="arrow" /></Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">恶意举报次数</Flex.Item>
                        <Flex.Item className="text-right"><span className="yellow">1</span>次</Flex.Item>
                    </Flex>
                    <Flex className="report">
                        <span className="form-line"></span>
                        <span className="form-font">借贷记录<span className="yellow">*</span></span>
                    </Flex>
                    <Flex className="table_flex table-tit" >
                        <Flex.Item>类型</Flex.Item>
                        <Flex.Item>借入</Flex.Item>
                        <Flex.Item>借出</Flex.Item>
                        <Flex.Item>担保</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>当前笔数</Flex.Item>
                        <Flex.Item>4笔</Flex.Item>
                        <Flex.Item>2笔</Flex.Item>
                        <Flex.Item>6笔</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>当前人数</Flex.Item>
                        <Flex.Item>10人</Flex.Item>
                        <Flex.Item>10人</Flex.Item>
                        <Flex.Item>10人</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>当前金额</Flex.Item>
                        <Flex.Item>200元</Flex.Item>
                        <Flex.Item>200元</Flex.Item>
                        <Flex.Item>200元</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>累计笔数</Flex.Item>
                        <Flex.Item>1笔</Flex.Item>
                        <Flex.Item>2笔</Flex.Item>
                        <Flex.Item>1笔</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>累计人数</Flex.Item>
                        <Flex.Item>1人</Flex.Item>
                        <Flex.Item>2人</Flex.Item>
                        <Flex.Item>1人</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >   
                        <Flex.Item>最大金额</Flex.Item>
                        <Flex.Item>500元</Flex.Item>
                        <Flex.Item>500元</Flex.Item>
                        <Flex.Item>400元</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >   
                        <Flex.Item>最大逾期金额</Flex.Item>
                        <Flex.Item>500元</Flex.Item>
                        <Flex.Item>500元</Flex.Item>
                        <Flex.Item>400元</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >   
                        <Flex.Item>查看详情</Flex.Item>
                        <Flex.Item><Tap className="yellow">查看</Tap></Flex.Item>
                        <Flex.Item><Tap className="yellow">查看</Tap></Flex.Item>
                        <Flex.Item><Tap className="yellow">查看</Tap></Flex.Item>
                    </Flex>
                    <Flex className="table_flex no-line" justify="end">
                        <div className="sign"><span className="yellow">*</span>标志为仅本人可见</div>
                    </Flex> */}
                </div>:null}
                {base_state==4?<div className="view-credit-report-item">
                    <Flex justify="center"  className="step_report">
                        <img src={'/imgs/credit/sel-operator.svg'} />
                    </Flex>
                    <Flex className="report">
                        <span className="form-line"></span>
                        <span className="form-font">账户信息</span>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">银行卡预留手机号</Flex.Item>
                        <Flex.Item className="text-right">{creditLoanInfo && creditLoanInfo.bankTel ? creditLoanInfo.bankTel : '无数据'}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">运营商认证手机号</Flex.Item>
                        <Flex.Item className="text-right">{creditDetailReport && creditDetailReport.personReport && creditDetailReport.personReport.mobileReport && creditDetailReport.personReport.mobileReport.mobilePhone}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">使用时长</Flex.Item>
                        <Flex.Item className="text-right">{creditDetailReport && creditDetailReport.personReport && creditDetailReport.personReport.mobileReport && creditDetailReport.personReport.mobileReport.telUseTm !== -1 && creditDetailReport.personReport.mobileReport.telUseTm !== null ? creditDetailReport.personReport.mobileReport.telUseTm + '个月' : '未知'}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">互通联系人</Flex.Item>
                        <Flex.Item className="text-right">{creditDetailReport && creditDetailReport.personReport && creditDetailReport.personReport.mobileReport && creditDetailReport.personReport.mobileReport.telExchange > 0 ? creditDetailReport.personReport.mobileReport.telExchange + '个' : '未知'}</Flex.Item>
                    </Flex>
                    <Flex className="report">
                        <span className="form-line"></span>
                        <span className="form-font">紧急联系人</span>
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>姓名</Flex.Item>
                        {creditDetailReport&&creditDetailReport.urgentContactList && creditDetailReport.urgentContactList.length > 0 ?
                            creditDetailReport.urgentContactList.map((ele, index) => {
                                let { contact_name } = ele;
                                return <Flex.Item>{contact_name}</Flex.Item>
                            }) : null
                        }
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>与本人关系</Flex.Item>
                        {creditDetailReport && creditDetailReport.urgentContactList && creditDetailReport.urgentContactList.length > 0 ?
                            creditDetailReport.urgentContactList.map((ele, index) => {
                                let { contact_type } = ele;
                                return <Flex.Item>{contact_type}</Flex.Item>
                            }) : null
                        }
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>联系方式</Flex.Item>
                        {creditDetailReport && creditDetailReport.urgentContactList && creditDetailReport.urgentContactList.length > 0 ?
                            creditDetailReport.urgentContactList.map((ele, index) => {
                                let { contact_tel } = ele;
                                return <Flex.Item>{contact_tel}</Flex.Item>
                            }) : null
                        }
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>半年内通话次数</Flex.Item>
                        {creditDetailReport && creditDetailReport.urgentContactList && creditDetailReport.urgentContactList.length > 0 ?
                            creditDetailReport.urgentContactList.map((ele, index) => {
                                let { call_cnt } = ele;
                                return <Flex.Item>{call_cnt}次</Flex.Item>
                            }) : null
                        }
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>通话时长</Flex.Item>
                        {creditDetailReport && creditDetailReport.urgentContactList && creditDetailReport.urgentContactList.length > 0 ?
                            creditDetailReport.urgentContactList.map((ele, index) => {
                                let { call_len } = ele;
                                return <Flex.Item>{call_len.toFixed(1)}分钟</Flex.Item>
                            }) : null
                        }
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>短信条数</Flex.Item>
                        {creditDetailReport && creditDetailReport.urgentContactList && creditDetailReport.urgentContactList.length > 0 ?
                            creditDetailReport.urgentContactList.map((ele, index) => {
                                let { sms_cnt } = ele;
                                return <Flex.Item>{sms_cnt}条</Flex.Item>
                            }) : null
                        }
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>收货总额</Flex.Item>
                        {creditDetailReport && creditDetailReport.urgentContactList && creditDetailReport.urgentContactList.length > 0 ?
                            creditDetailReport.urgentContactList.map((ele, index) => {
                                let { total_amount } = ele;
                                return <Flex.Item>{$.toYuan(total_amount)}</Flex.Item>
                            }) : null
                        }
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>收货次数</Flex.Item>
                        {creditDetailReport && creditDetailReport.urgentContactList && creditDetailReport.urgentContactList.length > 0 ?
                            creditDetailReport.urgentContactList.map((ele, index) => {
                                let { total_count } = ele;
                                return <Flex.Item>{total_count < 0 ? 0 : total_count}次</Flex.Item>
                            }) : null
                        }
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>最早收货时间</Flex.Item>
                        {creditDetailReport && creditDetailReport.urgentContactList && creditDetailReport.urgentContactList.length > 0 ?
                            creditDetailReport.urgentContactList.map((ele, index) => {
                                let { begin_date } = ele;
                                return <Flex.Item>{begin_date ? begin_date : '无'}</Flex.Item>
                            }) : null
                        }
                    </Flex>
                    <Flex className="table_flex" >
                        <Flex.Item>最晚收货时间</Flex.Item>
                        {creditDetailReport && creditDetailReport.urgentContactList && creditDetailReport.urgentContactList.length > 0 ?
                            creditDetailReport.urgentContactList.map((ele, index) => {
                                let { end_date } = ele;
                                return <Flex.Item>{end_date ? end_date : '无'}</Flex.Item>
                            }) : null
                        }
                    </Flex>


                    <Flex justify="center" className="tit-small mart20">
                        <span>——</span><span>话费详情</span><span>——</span>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>月份</Flex.Item>
                        <Flex.Item>金额</Flex.Item>
                    </Flex>
                    {this.state.mobilelist.map((item) => {
                        return (
                            <Flex className="table_flex" justify="between">
                                <Flex.Item>{item.bill_cycle}</Flex.Item>
                                <Flex.Item>{$.toYuan(item.total_amt)}</Flex.Item>
                            </Flex>
                        )
                    })}
                    
                    <Flex justify="center" className="tit-small mart20">
                        <span>——</span><span>通话记录</span><span>——</span>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">通话记录详情</Flex.Item>
                        <Flex.Item className="text-right" onClick={() => { this.gotoPage('call_record') }}><img src='/imgs/credit/arrows-gray.svg' className="arrow" /></Flex.Item>
                    </Flex>
                    {/* <Flex className="table_flex">
                        <Flex.Item>手机号</Flex.Item>
                        <Flex.Item>通话次数</Flex.Item>
                        <Flex.Item>时长(分)</Flex.Item>
                        <Flex.Item>短信条数</Flex.Item>
                    </Flex>
                    {this.state.Contactlist.map((item) => {
                        return (
                            <Flex className="table_flex" key={Math.random()}>
                                <Flex.Item>{item.phone_num}</Flex.Item>
                                <Flex.Item>{item.call_cnt}</Flex.Item>
                                <Flex.Item>{item.call_len.toFixed(2)}</Flex.Item>
                                <Flex.Item>{item.sms_cnt}
                                </Flex.Item>
                            </Flex>
                        )
                    })} */}
                    {/* <div className="oper-mate">
                        <Flex className="table_flex no-line" justify="between">
                            <Flex.Item className="text-left">姓名</Flex.Item>
                            <Flex.Item className="text-right">路人甲</Flex.Item>
                        </Flex>
                        <Flex className="table_flex no-line" justify="end">
                            <div className="mate-posi">匹配成功</div>
                        </Flex>
                    </div>
                    <div className="oper-mate">
                        <Flex className="table_flex no-line" justify="between">
                            <Flex.Item className="text-left">身份证号</Flex.Item>
                            <Flex.Item className="text-right">4**********9</Flex.Item>
                        </Flex>
                        <Flex className="table_flex no-line" justify="end">
                            <div className="mate-posi">匹配成功</div>
                        </Flex>
                        <Flex className="table_flex no-line mate-bg" justify="between">
                            <div className="mate">运营商登记身份证号</div>
                            <div className="mate">6********9</div>
                        </Flex>
                    </div>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">手机号码</Flex.Item>
                        <Flex.Item className="text-right">122****0000</Flex.Item>
                    </Flex>
                    <div className="oper-mate">
                        <Flex className="table_flex no-line" justify="between">
                            <Flex.Item className="text-left">归属地</Flex.Item>
                            <Flex.Item className="text-right">北京市</Flex.Item>
                        </Flex>
                        <Flex className="table_flex no-line" justify="end">
                            <div className="mate-posi">和常用通话地不一致</div>
                        </Flex>
                        <Flex className="table_flex no-line mate-bg" justify="between">
                            <div className="mate">近6个月常用通话地</div>
                            <div className="mate">浙江省 杭州市</div>
                        </Flex>
                    </div>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">运营商</Flex.Item>
                        <Flex.Item className="text-right">中国移动 </Flex.Item>
                    </Flex>
                    <div className="oper-mate">
                        <Flex className="table_flex no-line" justify="between">
                            <Flex.Item className="text-left">账户状态</Flex.Item>
                            <Flex.Item className="text-right">停机</Flex.Item>
                        </Flex>
                        <Flex className="table_flex no-line" justify="end">
                            <div className="mate-posi">账户状态异常</div>
                        </Flex>
                    </div>
                    <div className="oper-mate">
                        <Flex className="table_flex no-line" justify="between">
                            <Flex.Item className="text-left">入网时间</Flex.Item>
                            <Flex.Item className="text-right">2018-2-2</Flex.Item>
                        </Flex>
                        <Flex className="table_flex no-line" justify="end">
                            <div className="mate-posi">入网时长不足3个月</div>
                        </Flex>
                    </div>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">互通联系人</Flex.Item>
                        <Flex.Item className="text-right"><span className="yellow">3</span>个 </Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">是否在电商中使用过</Flex.Item>
                        <Flex.Item className="text-right">是</Flex.Item>
                    </Flex>


                    <Flex className="report">
                        <span className="form-line"></span>
                        <span className="form-font">风险联系人</span>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">贷款公司</Flex.Item>
                        <Flex.Item className="text-right">主叫3次共15分钟，被叫2次共10分钟</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">银行</Flex.Item>
                        <Flex.Item className="text-right">主叫3次共15分钟，被叫2次共10分钟</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">信用卡</Flex.Item>
                        <Flex.Item className="text-right">无数据</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">法院</Flex.Item>
                        <Flex.Item className="text-right">无数据</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">催收</Flex.Item>
                        <Flex.Item className="text-right">无数据</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">律师</Flex.Item>
                        <Flex.Item className="text-right">无数据</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">110</Flex.Item>
                        <Flex.Item className="text-right">无数据</Flex.Item>
                    </Flex>

                    <Flex className="report">
                        <span className="form-line"></span>
                        <span className="form-font">紧急联系人</span>
                    </Flex>
                    <Flex className="table_flex" >   
                        <Flex.Item>姓名</Flex.Item>
                        <Flex.Item>王**</Flex.Item>
                        <Flex.Item>王**</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >   
                        <Flex.Item>与本人关系</Flex.Item>
                        <Flex.Item>配偶</Flex.Item>
                        <Flex.Item>朋友</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >   
                        <Flex.Item>联系方式</Flex.Item>
                        <Flex.Item>1222****0000</Flex.Item>
                        <Flex.Item>1222****000</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >   
                        <Flex.Item>半年内通话次数</Flex.Item>
                        <Flex.Item>99次</Flex.Item>
                        <Flex.Item>33次</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >   
                        <Flex.Item>通话时长</Flex.Item>
                        <Flex.Item>290.3分钟</Flex.Item>
                        <Flex.Item>33分钟</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >   
                        <Flex.Item>短信条数</Flex.Item>
                        <Flex.Item>0条</Flex.Item>
                        <Flex.Item>0条 </Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >   
                        <Flex.Item>收货总额</Flex.Item>
                        <Flex.Item>0次</Flex.Item>
                        <Flex.Item>0次 </Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >   
                        <Flex.Item>短信条数</Flex.Item>
                        <Flex.Item>0条</Flex.Item>
                        <Flex.Item>0条 </Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >   
                        <Flex.Item>最早收货时间</Flex.Item>
                        <Flex.Item>无</Flex.Item>
                        <Flex.Item>无 </Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >   
                        <Flex.Item>最晚收货时间</Flex.Item>
                        <Flex.Item>无</Flex.Item>
                        <Flex.Item>无 </Flex.Item>
                    </Flex>

                    <Flex className="report">
                        <span className="form-line"></span>
                        <span className="form-font">通话信息 </span>
                    </Flex>
                    <Flex justify="center" className="tit-small mart20">
                        <span>——</span><span>通话信息静默统计</span><span>——</span>
                    </Flex> 
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>静默次数</Flex.Item>
                        <Flex.Item>3次</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>平均静默时长</Flex.Item>
                        <Flex.Item>3天10小时</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>最近1次静默时长</Flex.Item>
                        <Flex.Item>102023003</Flex.Item>
                    </Flex>
                    <Flex justify="center" className="tit-small mart20">
                        <span>——</span><span>通话月份分布</span><span>——</span>
                    </Flex> 
                    <Flex className="table_flex" >   
                        <Flex.Item>月份</Flex.Item>
                        <Flex.Item>通话号码数</Flex.Item>
                        <Flex.Item>互通号码数</Flex.Item>
                        <Flex.Item>互通占比</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >   
                        <Flex.Item>2017-2</Flex.Item>
                        <Flex.Item>20</Flex.Item>
                        <Flex.Item>20</Flex.Item>
                        <Flex.Item>30%</Flex.Item>
                    </Flex> 
                    <Flex justify="center" className="tit-small mart20">
                        <span>——</span><span>通话地区</span><span>——</span>
                    </Flex> 
                    <Flex className="table_flex" >   
                        <Flex.Item>归属地</Flex.Item>
                        <Flex.Item>占比</Flex.Item>
                        <Flex.Item>呼叫次数</Flex.Item>
                        <Flex.Item>主叫次数</Flex.Item>
                        <Flex.Item>被叫次数</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" >   
                        <Flex.Item>北京</Flex.Item>
                        <Flex.Item>30%</Flex.Item>
                        <Flex.Item>20</Flex.Item>
                        <Flex.Item>30</Flex.Item>
                        <Flex.Item>30</Flex.Item>
                    </Flex> 
                    <Flex justify="center" className="tit-small mart20">
                        <span>——</span><span>话费详情</span><span>——</span>
                    </Flex> 
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>月份</Flex.Item>
                        <Flex.Item>金额</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>2018-4</Flex.Item>
                        <Flex.Item>11000元</Flex.Item>
                    </Flex>
                    <Flex justify="center" className="tit-small mart20">
                        <span>——</span><span>通话记录</span><span>——</span>
                    </Flex> 
                    <Flex className="table_flex" justify="between">
                        <Flex.Item className="text-left">通话记录详情</Flex.Item>
                        <Flex.Item className="text-right"><img src='/imgs/credit/arrows-gray.svg' className="arrow" /></Flex.Item>
                    </Flex> */}

                </div>:null} 
                {base_state==5?<div className="view-credit-report-item">
                    <Flex justify="center"  className="step_report">
                        <img src={'/imgs/credit/sel-jingdong.svg'} />
                    </Flex>
                    <Flex className="report">
                        <span className="form-line"></span>
                        <span className="form-font">账户信息</span>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>使用时长</Flex.Item>
                        <Flex.Item >{creditDetailReport.personReport.ebusinessReport.ebusynessTotalTm > 0 ? creditDetailReport.personReport.ebusinessReport.ebusynessTotalTm + '个月' : '无数据'}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>购物次数</Flex.Item>
                        <Flex.Item >{creditDetailReport.personReport.ebusinessReport.ebusynessTotalCount > 0 ? creditDetailReport.personReport.ebusinessReport.ebusynessTotalCount + '次' : '无数据'}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>消费总额</Flex.Item>
                        <Flex.Item >{creditDetailReport.personReport.ebusinessReport.ebusynessTotalAmount > 0 ? creditDetailReport.personReport.ebusinessReport.ebusynessTotalAmount.toFixed(2) + '元' : '无数据'}</Flex.Item>
                    </Flex>
                    <Flex justify="center" className="tit-small mart20">
                        <span>——</span><span>消费行为</span><span>——</span>
                    </Flex>
                    <Flex className="table_flex">
                        <Flex.Item>月份</Flex.Item>
                        <Flex.Item>消费记录</Flex.Item>
                        <Flex.Item>消费金额</Flex.Item>
                    </Flex>
                    {this.state.jdlist.map((item) => {
                        return (
                            <Flex className="table_flex" justify="between">
                                <Flex.Item>{item.trans_mth}</Flex.Item>
                                <Flex.Item>{item.all_count}</Flex.Item>
                                <Flex.Item>{item.all_amount.toFixed(2)}元</Flex.Item>
                            </Flex>
                        )
                    })}
                    <Flex justify="center" className="tit-small mart20">
                        <span>——</span><span>地址分析</span><span>——</span>
                    </Flex>
                    <div className="oper-mate">
                        <Flex className="table_flex no-line" justify="between">
                            <Flex.Item>本人现居地</Flex.Item>
                            <Flex.Item>{creditDetailReport && creditDetailReport.personReport && creditDetailReport.personReport.home_addr}</Flex.Item>
                        </Flex>
                    </div>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>电商收货地址</Flex.Item>
                        <Flex.Item onClick={() => { this.gotoPage('address_record') }}><span className="arrow_span">{creditDetailReport.deliverAddresslist.length}个</span><img src='/imgs/credit/arrows-gray.svg' className="arrow" /></Flex.Item>
                    </Flex>
                    {/* {creditDetailReport && creditDetailReport.deliverAddresslist && creditDetailReport.deliverAddresslist ?
                        creditDetailReport.deliverAddresslist.map((ele, index) => {
                            let { address, receiver, total_count, total_amount, begin_date, end_date } = ele;

                            return (
                                <div key={'address' + index} className="content_text">电商收货地址：<br />{address}
                                    <div><span>消费次数：{total_count}</span></div>
                                    <div><span>消费金额：{total_amount.toFixed(2)}元</span></div>
                                    <div><span>收货时间：{begin_date}至{end_date}</span></div>
                                </div>
                            )
                        }) :
                        null
                    } */}
                    {/* <div className="oper-mate">
                        <Flex className="table_flex no-line" justify="between">
                            <Flex.Item>姓名</Flex.Item>
                            <Flex.Item>路人甲</Flex.Item>
                        </Flex>
                        <Flex className="table_flex no-line" justify="end">
                            <div className="mate-posi">匹配成功</div>
                        </Flex>
                    </div>
                    <div className="oper-mate">
                        <Flex className="table_flex no-line" justify="between">
                            <Flex.Item>身份证号</Flex.Item>
                            <Flex.Item>4**********9</Flex.Item>
                        </Flex>
                        <Flex className="table_flex no-line" justify="end">
                            <div className="mate-posi">匹配成功</div>
                        </Flex>
                    </div>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>邮箱</Flex.Item>
                        <Flex.Item >1333@qq.com</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>用户级别</Flex.Item>
                        <Flex.Item >银牌</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>会员成长值</Flex.Item>
                        <Flex.Item >20</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>账户余额</Flex.Item>
                        <Flex.Item >2元</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>信用分</Flex.Item>
                        <Flex.Item >22</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>白条额度</Flex.Item>
                        <Flex.Item >2元</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>白条欠款</Flex.Item>
                        <Flex.Item >0</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>使用时长</Flex.Item>
                        <Flex.Item >2个月 </Flex.Item>
                    </Flex>
                    <Flex justify="center" className="tit-small mart20">
                        <span>——</span><span>消费行为</span><span>——</span>
                    </Flex> 
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>购物次数</Flex.Item>
                        <Flex.Item >10</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>消费总额</Flex.Item>
                        <Flex.Item >100.00元</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>消费详情</Flex.Item>
                        <Flex.Item ><img src='/imgs/credit/arrows-gray.svg' className="arrow" /></Flex.Item>
                    </Flex>
                    <Flex justify="center" className="tit-small mart20">
                        <span>——</span><span>地址分析</span><span>——</span>
                    </Flex> 
                    <div className="oper-mate">
                        <Flex className="table_flex no-line" justify="between">
                            <Flex.Item>本人现居地</Flex.Item>
                            <Flex.Item>北京市海淀区********</Flex.Item>
                        </Flex>
                        <Flex className="table_flex no-line" justify="end">
                            <div className="mate-posi">不匹配当前定位</div>
                        </Flex>
                    </div>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>电商收货地址</Flex.Item>
                        <Flex.Item ><span className="arrow_span">5个</span><img src='/imgs/credit/arrows-gray.svg' className="arrow" /></Flex.Item>
                    </Flex> */}
                </div>:null}
                {base_state==7?<div className="view-credit-report-item">
                    <Flex justify="center"  className="step_report">
                        <img src={'/imgs/credit/sel-shebao.svg'} />
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>起缴日期</Flex.Item>
                        <Flex.Item >{creditDetailReport.shebaoInfo?creditDetailReport.shebaoInfo.begin_date:''}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>参加工作日期</Flex.Item>
                        <Flex.Item >{creditDetailReport.shebaoInfo?creditDetailReport.shebaoInfo.time_to_work:''}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>单位名称</Flex.Item>
                        <Flex.Item >{creditDetailReport.shebaoInfo?creditDetailReport.shebaoInfo.company_name:''}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>家庭住址</Flex.Item>
                        <Flex.Item >{creditDetailReport.shebaoInfo?creditDetailReport.shebaoInfo.home_address:''}</Flex.Item>
                    </Flex>
                    <Tap onTap={() => { this.gotoPage('social_security_record')  }}>
                        <Flex className="table_flex" justify="between">
                            <Flex.Item>缴费详情</Flex.Item>
                            <Flex.Item><img src='/imgs/credit/arrows-gray.svg' className="arrow" /></Flex.Item>
                        </Flex>
                    </Tap>
                </div>:null} 
                {base_state==8?<div className="view-credit-report-item">
                    <Flex justify="center"  className="step_report">
                        <img src={'/imgs/credit/sel-gjj.svg'} />
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>开户日期</Flex.Item>
                        <Flex.Item >{creditDetailReport.gjjInfo?creditDetailReport.gjjInfo.begin_date == '--' ? creditDetailReport.gjjInfo.begin_date : creditDetailReport.gjjInfo.begin_date:''}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>最后缴费日期</Flex.Item>
                        <Flex.Item >{creditDetailReport.gjjInfo ? creditDetailReport.gjjInfo.last_pay_date == '--' ? creditDetailReport.gjjInfo.last_pay_date : creditDetailReport.gjjInfo.last_pay_date : ''}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>缴存状态</Flex.Item>
                        <Flex.Item >{creditDetailReport.gjjInfo ? creditDetailReport.gjjInfo.pay_status_desc : ''}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>单位名称</Flex.Item>
                        <Flex.Item >{creditDetailReport.gjjInfo ? creditDetailReport.gjjInfo.corp_name : ''}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>家庭住址</Flex.Item>
                        <Flex.Item >{creditDetailReport.gjjInfo ? creditDetailReport.gjjInfo.home_address : ''}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>电子邮箱</Flex.Item>
                        <Flex.Item >{creditDetailReport.gjjInfo ? creditDetailReport.gjjInfo.email : ''}</Flex.Item>
                    </Flex>
                    <Tap onTap={() => { this.gotoPage('accumulation_record')  }}>
                        <Flex className="table_flex" justify="between">
                            <Flex.Item>缴费详情</Flex.Item>
                            <Flex.Item><img src='/imgs/credit/arrows-gray.svg' className="arrow" /></Flex.Item>
                        </Flex>
                    </Tap>
                </div>:null} 
                {base_state==9?<div className="view-credit-report-item">
                    <Flex justify="center"  className="step_report">
                        <img src={'/imgs/credit/sel-xuexin.svg'} />
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>学历</Flex.Item>
                        <Flex.Item >{creditDetailReport && creditDetailReport.xuexinList && creditDetailReport.xuexinList.length ? creditDetailReport.xuexinList[0].c_student_level:''}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>学校</Flex.Item>
                        <Flex.Item >{creditDetailReport && creditDetailReport.xuexinList && creditDetailReport.xuexinList.length ? creditDetailReport.xuexinList[0].c_university : ''}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>专业</Flex.Item>
                        <Flex.Item >{creditDetailReport && creditDetailReport.xuexinList && creditDetailReport.xuexinList.length ? creditDetailReport.xuexinList[0].c_major : ''}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>类型</Flex.Item>
                        <Flex.Item >{creditDetailReport && creditDetailReport.xuexinList && creditDetailReport.xuexinList.length ? creditDetailReport.xuexinList[0].c_full_time : ''}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>状态</Flex.Item>
                        <Flex.Item >{creditDetailReport && creditDetailReport.xuexinList && creditDetailReport.xuexinList.length ? creditDetailReport.xuexinList[0].c_student_status : ''}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>入校时间</Flex.Item>
                        <Flex.Item >{creditDetailReport && creditDetailReport.xuexinList && creditDetailReport.xuexinList.length ? creditDetailReport.xuexinList[0].c_student_begin_time : ''}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>离校时间</Flex.Item>
                        <Flex.Item >{creditDetailReport && creditDetailReport.xuexinList && creditDetailReport.xuexinList.length ? creditDetailReport.xuexinList[0].c_student_end_time : ''}</Flex.Item>
                    </Flex>
                </div>:null}
                {base_state==10?<div className="view-credit-report-item">
                    <Flex justify="center"  className="step_report">
                        <img src={'/imgs/credit/sel-job.svg'} />
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>公司名称</Flex.Item>
                        <Flex.Item >{creditDetailReport.jobInfo.company_name}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>工作职位</Flex.Item>
                        <Flex.Item >{creditDetailReport.jobInfo.position}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>入职时间</Flex.Item>
                        <Flex.Item >{creditDetailReport.jobInfo.employment_date ? this.formatDate(creditDetailReport.jobInfo.employment_date) : '未知'}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>联系电话</Flex.Item>
                        <Flex.Item >{creditDetailReport.jobInfo.company_tel}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>公司地址</Flex.Item>
                        <Flex.Item >{creditDetailReport.jobInfo.company_address}</Flex.Item>
                    </Flex>
                    <div className="report-img">
                        <p>工作证明</p>
                        <div className="rep-img">
                            <img src={'/imgs/credit/base-base.svg'} />
                        </div>
                    </div>
                </div>:null}
                {base_state==11?<div className="view-credit-report-item">
                    <Flex justify="center"  className="step_report">
                        <img src={'/imgs/credit/sel-income.svg'} />
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>月收入</Flex.Item>
                        <Flex.Item >{creditDetailReport.earnInfo.earn_month}</Flex.Item>
                    </Flex>
                    <div className="report-img">
                        <p>工作证明</p>
                        <div className="rep-img">
                            <img src={'/imgs/credit/base-base.svg'} />
                        </div>
                    </div>
                </div>:null}
                {base_state==12?<div className="view-credit-report-item">
                    <Flex justify="center"  className="step_report">
                        <img src={'/imgs/credit/sel-house.svg'} />
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>房屋地址</Flex.Item>
                        <Flex.Item >{creditDetailReport.houseInfo.level_1_name}-{creditDetailReport.houseInfo.level_2_name}-{creditDetailReport.houseInfo.level_3_name}-{creditDetailReport.houseInfo.house_address}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>房屋类型</Flex.Item>
                        <Flex.Item >{creditDetailReport.houseInfo.house_type}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>房屋面积</Flex.Item>
                        <Flex.Item >{creditDetailReport.houseInfo.house_area}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>购买价格</Flex.Item>
                        <Flex.Item >{creditDetailReport.houseInfo.house_price}万</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>付款状态</Flex.Item>
                        <Flex.Item >{creditDetailReport.houseInfo.house_pay_status}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>房龄</Flex.Item>
                        <Flex.Item >{creditDetailReport.houseInfo.house_age}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>是否二手房</Flex.Item>
                        {creditDetailReport.houseInfo.house_is_used == 0 ? <Flex.Item >否</Flex.Item> : null}
                        {creditDetailReport.houseInfo.house_is_used == 1 ? <Flex.Item >是</Flex.Item> : null}
                        {creditDetailReport.houseInfo.house_is_used == -1 ? <Flex.Item >无数据</Flex.Item> : null}
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>是否抵押过</Flex.Item>
                        {creditDetailReport.houseInfo.house_is_mortgage == 0 ? <Flex.Item >否</Flex.Item> : null}
                        {creditDetailReport.houseInfo.house_is_mortgage == 1 ? <Flex.Item >是</Flex.Item> : null}
                        {creditDetailReport.houseInfo.house_is_mortgage == -1 ? <Flex.Item >无数据</Flex.Item> : null}
                    </Flex>
                    <div className="report-img">
                        <p>房产证明</p>
                        <div className="rep-img">
                            <img src={'/imgs/credit/base-base.svg'} />
                        </div>
                    </div>
                </div>:null}
                {base_state==13?<div className="view-credit-report-item">
                    <Flex justify="center"  className="step_report">
                        <img src={'/imgs/credit/sel-car.svg'} />
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>品牌类型</Flex.Item>
                        <Flex.Item >{creditDetailReport.carInfo.car_brand}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>行驶里程</Flex.Item>
                        <Flex.Item >{creditDetailReport.carInfo.car_mileage}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>购买价格</Flex.Item>
                        <Flex.Item >{creditDetailReport.carInfo.car_price}万</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>付款状态</Flex.Item>
                        <Flex.Item >{creditDetailReport.carInfo.car_pay_status}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>登记城市</Flex.Item>
                        <Flex.Item >{creditDetailReport.carInfo.level_1_name}-{creditDetailReport.carInfo.level_2_name}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>车龄</Flex.Item>
                        <Flex.Item >{creditDetailReport.carInfo.car_age}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>是否二手车</Flex.Item>
                        {creditDetailReport.carInfo.car_is_used == 0 ? <Flex.Item >否</Flex.Item> : null}
                        {creditDetailReport.carInfo.car_is_used == 1 ? <Flex.Item >是</Flex.Item> : null}
                        {creditDetailReport.carInfo.car_is_used == -1 ? <Flex.Item >无数据</Flex.Item> : null}
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>是否抵押过</Flex.Item>
                        {creditDetailReport.carInfo.car_is_mortgage == 0 ? <Flex.Item >否</Flex.Item> : null}
                        {creditDetailReport.carInfo.car_is_mortgage == 1 ? <Flex.Item >是</Flex.Item> : null}
                        {creditDetailReport.carInfo.car_is_mortgage == -1 ? <Flex.Item >无数据</Flex.Item> : null}
                    </Flex>
                    <div className="report-img">
                        <p>车产证明</p>
                        <div className="rep-img">
                            <img src={'/imgs/credit/base-base.svg'} />
                        </div>
                    </div>
                </div>:null}
                {base_state==14?<div className="view-credit-report-item">
                    <Flex justify="center"  className="step_report">
                        <img src={'/imgs/credit/sel-zhifubao.svg'} />
                    </Flex>
                    <Flex className="report">
                        <span className="form-line"></span>
                        <span className="form-font">基本信息</span>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>姓名</Flex.Item>
                        <Flex.Item>{alipay.fullName}</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>身份证号</Flex.Item>
                        <Flex.Item>{alipay.idCardNo}</Flex.Item>
                    </Flex>
                    <Flex className="report">
                        <span className="form-line"></span>
                        <span className="form-font">芝麻信用</span>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>负面记录</Flex.Item>
                        <Flex.Item >{alipay.badRecords && alipay.badRecords.length>0?<span>
                        <span onClick={() => { this.gotoPage('alipay_negative') }} className="arrow_span">{alipay.badRecords.length}次</span>
                        <img src='/imgs/credit/arrows-gray.svg' className="arrow" /></span>:<span>0次</span>}
                        </Flex.Item>
                    </Flex>
                    <Flex className="report">
                        <span className="form-line"></span>
                        <span className="form-font">资产信息</span>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>总资产</Flex.Item>
                        <Flex.Item >{alipay.allBalance}元</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>余额</Flex.Item>
                        <Flex.Item >{alipay.yue}元</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>余额宝</Flex.Item>
                        <Flex.Item >{alipay.yuebaoBaleance}元</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>花呗总额度</Flex.Item>
                        <Flex.Item >{alipay.huabeiAmount}元</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>花呗消费金额</Flex.Item>
                        <Flex.Item >{alipay.huabeiUsedAmount}元</Flex.Item>
                    </Flex>
                    <Flex className="table_flex" justify="between">
                        <Flex.Item>花呗可用金额</Flex.Item>
                        <Flex.Item >{alipay.huabeiAvailedAmount}元</Flex.Item>
                    </Flex>
                    <Flex className="report">
                        <span className="form-line"></span>
                        <span className="form-font">交易信息</span>
                    </Flex>
                    <Flex className="table_flex" justify="between" onClick={() => { this.gotoPage('alipay_record') }} >
                        <Flex.Item>交易详情</Flex.Item>
                        <Flex.Item ><img src='/imgs/credit/arrows-gray.svg' className="arrow" /></Flex.Item>
                    </Flex>
                </div>:null}
                <Flex className="report">
                    <span className="form-line"></span>
                    <span className="form-font">更多认证项</span>
                </Flex>
                <div className="credit-select">
                    <div className="grid">
                        <div className="grid-item">
                            <Tap onTap={()=>{this.onTapof(1) }}>
                                {base_state==1?<div className="grid-con">
                                    <img src={'/imgs/credit/base-base-gray.svg'} />
                                    <p className="gray">基础信息</p>
                                </div>:<div className="grid-con">
                                    <img src={'/imgs/credit/sel-base.svg'} />
                                    <p>基础信息</p>
                                </div>}
                            </Tap>
                        </div>
                        <div className="grid-item">
                            <Tap onTap={()=>{this.onTapof(2) }}>
                                {base_state==2?<div className="grid-con">
                                    <img src={'/imgs/credit/sel-shuju-gray.svg'} />
                                    <p className="gray">数据更新</p>
                                </div>:<div className="grid-con">
                                    <img src={'/imgs/credit/sel-shuju.svg'} />
                                    <p>数据更新</p>
                                </div>}
                            </Tap>
                        </div>
                        <div className="grid-item">
                            <Tap onTap={()=>{this.onTapof(3) }}>
                                {base_state==3?<div className="grid-con">
                                    <img src={'/imgs/credit/sel-loan-gray.svg'} />
                                    <p className="gray">借贷数据</p>
                                </div>:<div className="grid-con">
                                    <img src={'/imgs/credit/sel-loan.svg'} />
                                    <p>借贷数据</p>
                                </div>}
                            </Tap>
                        </div>
                        {creditData.mobile_credit_status==3?<div className="grid-item">
                            <Tap onTap={()=>{this.onTapof(4) }}>
                                {base_state==4?<div className="grid-con">
                                    <img src={'/imgs/credit/base-operator-gray.svg'} />
                                    <p className="gray">运营商</p>
                                </div>:<div className="grid-con">
                                    <img src={'/imgs/credit/sel-operator.svg'} />
                                    <p>运营商</p>
                                </div>}
                            </Tap>
                        </div>:null}
                        {creditData.jingdong_credit_status==3?<div className="grid-item">
                            <Tap onTap={()=>{this.onTapof(5) }}>
                                {base_state==5?<div className="grid-con">
                                    <img src={'/imgs/credit/sel-jingdong-gray.svg'} />
                                    <p className="gray">京东认证</p>
                                </div>:<div className="grid-con">
                                    <img src={'/imgs/credit/sel-jingdong.svg'} />
                                    <p>京东认证</p>
                                </div>}
                            </Tap>
                        </div>:null}
                        {/* <div className="grid-item">
                            <Tap onTap={()=>{this.onTapof(6) }}>
                                {base_state==6?<div className="grid-con">
                                    <img src={'/imgs/credit/sel-location-gray.svg'} />
                                    <p className="gray">定位</p>
                                </div>:<div className="grid-con">
                                    <img src={'/imgs/credit/sel-location.svg'} />
                                    <p>定位</p>
                                </div>}
                            </Tap>
                        </div> */}
                        {creditData.shebao_credit_status==3?<div className="grid-item">
                            <Tap onTap={()=>{this.onTapof(7) }}>
                                {base_state==7?<div className="grid-con">
                                    <img src={'/imgs/credit/sel-shebao-gray.svg'} />
                                    <p className="gray">社保</p>
                                </div>:<div className="grid-con">
                                    <img src={'/imgs/credit/sel-shebao.svg'} />
                                    <p>社保</p>
                                </div>}
                            </Tap>
                        </div>:null}
                        {creditData.gjj_credit_status==3?<div className="grid-item">
                            <Tap onTap={()=>{this.onTapof(8) }}>
                            {base_state==8?<div className="grid-con">
                                <img src={'/imgs/credit/sel-gjj-gray.svg'} />
                                <p className="gray">公积金</p>
                            </div>:<div className="grid-con">
                                <img src={'/imgs/credit/sel-gjj.svg'} />
                                <p>公积金</p>
                            </div>}
                            </Tap>
                        </div>:null}
                        {creditData.xuexin_credit_status==3?<div className="grid-item">
                            <Tap onTap={()=>{this.onTapof(9) }}>
                                {base_state==9?<div className="grid-con">
                                    <img src={'/imgs/credit/sel-xuexin-gray.svg'} />
                                    <p className="gray">学信</p>
                                </div>:<div className="grid-con">
                                    <img src={'/imgs/credit/sel-xuexin.svg'} />
                                    <p>学信</p>
                                </div>}
                            </Tap>
                        </div>:null}
                        {creditData.job_credit_status==3?<div className="grid-item">
                            <Tap onTap={()=>{this.onTapof(10) }}>
                                {base_state==10?<div className="grid-con">
                                    <img src={'/imgs/credit/sel-job-gray.svg'} />
                                    <p className="gray">职业认证</p>
                                </div>:<div className="grid-con">
                                    <img src={'/imgs/credit/sel-job.svg'} />
                                    <p>职业认证</p>
                                </div>}
                            </Tap>
                        </div>:null}
                        {creditData.income_credit_status==3?<div className="grid-item">
                            <Tap onTap={()=>{this.onTapof(11) }}>
                                {base_state==11?<div className="grid-con">
                                    <img src={'/imgs/credit/sel-income-gray.svg'} />
                                    <p className="gray">收入认证</p>
                                </div>:<div className="grid-con">
                                    <img src={'/imgs/credit/sel-income.svg'} />
                                    <p>收入认证</p>
                                </div>}
                            </Tap>
                        </div>:null}
                        {creditData.house_credit_status==3?<div className="grid-item">
                            <Tap onTap={()=>{this.onTapof(12) }}>
                                {base_state==12?<div className="grid-con">
                                    <img src={'/imgs/credit/sel-car-gray.svg'} />
                                    <p className="gray">房产</p>
                                </div>:<div className="grid-con">
                                    <img src={'/imgs/credit/sel-car.svg'} />
                                        <p>房产</p>
                                </div>}
                            </Tap>
                        </div>:null}
                        {creditData.car_credit_status==3?<div className="grid-item">
                            <Tap onTap={()=>{this.onTapof(13) }}>
                                {base_state==13?<div className="grid-con">
                                    <img src={'/imgs/credit/sel-house-gray.svg'} />
                                    <p className="gray">车产</p>
                                </div>:<div className="grid-con">
                                    <img src={'/imgs/credit/sel-house.svg'} />
                                    <p>车产</p>
                                </div>}
                            </Tap>
                        </div>:null}
                        <div className="grid-item">
                            <Tap onTap={()=>{this.onTapof(14) }}>
                                {base_state==14?<div className="grid-con">
                                    <img src={'/imgs/credit/sel-zhifubao-gray.svg'} />
                                    <p className="gray">支付宝</p>
                                </div>:<div className="grid-con">
                                    <img src={'/imgs/credit/sel-zhifubao.svg'} />
                                    <p>支付宝</p>
                                </div>}
                            </Tap>
                        </div>
                    </div> 
                </div>

            </div>
        )
    }
}

export default createForm()(Page);
