//借条详情 => 确认展期
import '../form.less';
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Button, List, Checkbox,Flex } from "antd-mobile"
import { Loading, Modal } from 'SERVICE'
import { Pay,InputCode,Tap } from 'COMPONENT'
import util from 'SERVICE/util'

const AgreeItem = Checkbox.AgreeItem;


@withRouter
@inject('userStore','afterIouStore')
@observer

export default class App extends Component {
    constructor(props, context) {
        document.title = "确认展期";
        super(props, context)
        //获取链接参数
        const query = util.getUrlParams(this.props.location.search);
        //设置组件状态
        this.state = {
            id:query.id,
            //支付密码
            payVisible:false,
            //确认付款验证码
            cPayVisible:false,
            payData:null,
            userInfo:{
                borrowerName:'', // 借款人姓名
                borrowerUidE:'', //借款人id（加密后）
                borrowerTelephone:'', // 借款人手机号
                borrowerIdCardNo:'', // 借款人身份证号
                lenderName:'', // 出借人姓名
                lenderUidE:'', //出借人id（加密后）
                lenderTelephone:'', // 出借人手机号
                lenderIdCardNo:'', // 出借人身份证号
                guaranteeName:'', // 担保人姓名
                guaranteeUidE:'',	// 担保人id（加密后）
                guaranteeTelephone:'', // 担保人手机号
                guaranteeIdCardNo:'', // 担保人身份证号
                amount:'', // 借款本金
                toBeReceivedAmount:0,
                serviceAmount:'',	// 服务费用
                guaranteeAmount:'', // 担保费用
                interestAmount:'',	// 应还利息
                forfeitAmount:'',	// 滞纳金
                overdueManageAmount:'',	// 逾期管理费
                totalAmount:'',	// 应还总额
                borrowTime:'', // 借款时间 （时间戳格式0)
                borrowTimeTxt:'',
                repayTime:'', // 预期还款时间（时间戳格式）
                repayTimeTxt:'',
                interestRate:'', // 年利率
                purposeType:'', // 借款目的
                create_time:'', // 创建时间
                repayType:'',	// 还款方式0.到期还本付息1.等额本息
                onlineStatus:true,	// 生成借条的时候是否线上false.否true.是
                selfType:'', // 查看者的身份0.其他用户 1.借款人2.出借人3.担保人
                reportCount:0, // 借条被举报次数
                status:1
            },
            info:{
                loanIdE:'', //借条id（加密后）
                exceedingReceiveAmount:'', //展期确认应收款
                exceedingToUserAmount:'', //展期确认应收逾期管理费
                exceedingReceiveRate:'', //展期预还本金率
                exceedingReceiveCapitalAmount:'', //展期确认应收本金
                exceedingReceiveInterestAmount:'', //展期确认应收利息和罚息
                exceedingSendAmount:'', //展期确认应付款
                exceedingSendOverdueAmt:'', //展期确认应付逾期管理费
                exceedingFeeAmt:'', //展期确认手续费
                feeAmt:'', //交易手续费
                amtExtend:'', //展期后借款本金
                interestAmtExtend:'', //展期后应还利息
                interestRateExtend:'', //展期申请的年化利率
                exceedingDays:'', //展期天数
                amt:'', //当前借条借款本金
                interestAmt:'', //当前借条应还利息
                overdueAmt:'', //当前借条应还滞纳金
                overdueToUsAmt:'', //当前用户需要支付给我们的逾期管理费
                interestRate:'', //年化利率
                overDue:'', //当前借条是否逾期, 0.否 1.是
                getAmount:'', //实际还款金额+在途还款金额
                gotAmount:'', //实际还款金额
                totalAmount:'', //应还总额=应还本金+应还利息+应还滞纳金+支付给我们的逾期费用
                startTm:'', //展期开始日（时间戳格式）
                endTm:'', //展期结束日（时间戳格式）
                repayTm:'', //预期还款日期（时间戳格式）
                repayTmTxt:'',
                extensStatus:'', //展期状态;0、已发起待确认 1、已确认（回盘） 2、 已确认，系统正在处理 3、展期已结束（借条已完结，或者新申请了展期） -1、驳回 -2、系统处理失败（回盘失败） -3、展期未确认，已失效
                finalPaidAmount:0
            },
            /*页面状态*/
            agreement: -1, //是否选中展期协议
            isCanConfirm: false, //是否可以点击‘确认并支付’
            inputValidStatus: false
        };
    }
    componentDidMount() {
        this.getPageInfo();
        this.getShowInfo();
    }

    // 获取借条详情
    getPageInfo = () => {
        const _this = this;
        Loading.show();
        $.ajaxE({
            flag: 1,
            type: 'GET',
            url: '/loanlater/loaninfo/getLoan',
            data: {
                loanId: _this.state.id
            }
        }).then((res) => {
            res.data.borrowTimeTxt = (new Date(res.data.borrowTime * 1000)).Format('yyyy-MM-dd');
            res.data.repayTimeTxt = (new Date(res.data.repayTime * 1000)).Format('yyyy-MM-dd');
            _this.setState({
                userInfo: res.data
            });
        }).catch((res) => {
            if(res.status == 202){
                Modal.infoX(res.msg,()=>{
                    _this.props.history.push({
                        pathname: '/'
                    });
                });
            }else{
                Modal.infoX(res.msg);
            }
        }).finally(()=>{
            //Loading.show();
            Loading.hide();
        })       
    }

    //获取展期信息
    getShowInfo = ()=>{
        //Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/loanlater/loanExceeding/getLastLoanExceeding',
            data: {
                loanId: this.state.id
            }
        }).then((data) => {
            data.repayTmTxt = (new Date(data.endTm * 1000)).Format('yyyy-MM-dd');
            this.setState({
                info: data
            });
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
            //Loading.show();
            //Loading.hide();
        })    
    }

    onConfirmSubmit=()=>{
        let valid = true;
        //借款协议
        if(!this.state.agreement || this.state.agreement==-1){
            this.state.agreement = false;
            valid = false;
        }
        //所有验证通过
        if (valid) {
            this.setState({
                payVisible:true
            });
        }else{
            Modal.infoX('请勾选展期协议')
            this.setState({
                payVisible:false
            });
        }
    }

    //确认支付
    onPay =(data)=>{
        let _this = this;
        let postData1 = {
            loanId:_this.state.id,
            bindBankId:data.bindBankId,
            amount:_this.state.info.finalPaidAmount,
            payPassword:data.payPassword,
            payMethod:data.payMethod
        }
        if($.isWeiXin && data.payMethod==0){
            this.setState({
                payVisible:false,
                cPayVisible: false,
                payData: postData1
            },()=>{
                this.onComfirmPay();
            })
        }else{
            ////debugger;
            Loading.show();
            $.ajaxE( {
                type: 'POST',
                url: '/loanlater/repay/extendTimeApply',
                data: postData1
            }).then((res1) => {
                if(data.payMethod==2){
                    //不需要确认
                    
                    _this.setState({
                        payVisible: false,
                    },()=>{
                        Modal.infoX('展期确认成功!',()=>{
                            history.back();
                        });
                    })
                }else if(data.payMethod==3){
                    //银联支付
                    document.write(res1.payToken);
                }else if(data.payMethod==4){//微信支付
                    //history.pushState(null, null, '/');
                    localStorage.setItem('show_confirm_back','-2')
                    let payToken = JSON.parse(res1.payToken)
                    $.payWeiXin(payToken);
                }else{
                    //确认支付   余额和银行卡需要
                    //orderNo:22,payChannelType:1,payOrderNo:22,payToken:22 
                    let payData = {
                        loanId:_this.state.id, //Long 求借款id
                        amount:_this.state.info.finalPaidAmount,
                        orderNo:res1.orderNo,//Long 商户订单号（交易id）
                        payOrderNo:res1.payOrderNo, //支付订单号或协议支付绑卡流水号(第三方支付公司返回)
                        payMethod:data.payMethod,//Byte 支付方式 ：0.余额  1.银行卡  2-线下 3.银联(收银台类) 4.微信(app类)
                        payChannelType:res1.payChannelType, //银行卡支付通道：0-掌上汇通P2P通道；1-掌上汇通快捷通道；2-余额支付通道；4-易联插件通道；5-易联代收代付通道；7-合利宝支付通道；8-易宝支付通道；17-富友-协议支付(代收)；18-银联WAP支付(代收)；19-联拓
                        payToken:res1.payToken,//支付令牌(第三方支付公司返回)
                        //authCode:'1234', //短信验证码
                        protocolBind:res1.protocolBind,//Boolean 是否协议绑卡
                    };
                    _this.setState({
                        payVisible:false,
                        cPayVisible: true,
                        payData: payData
                    })
                }
            }).catch((msg) => {
                this.setState({
                    payVisible: false,
                    cPayVisible: false
                },()=>{
                    Modal.infoX(msg);
                })
                
            }).finally(()=>{
                //Loading.show();
                Loading.hide();
            })   
        }
    }

    //验证码确认支付
    onComfirmPay=(valus)=>{
        let _this = this;
        let payData = this.state.payData;
        if($.isWeiXin && payData.payMethod==0){
            //微信环境 余额支付直接走确认
            payData.payChannelType = 2;//这个值本来应该从申请支付后台返回，现在直接走确认，所以写死
        }else{
            //接收验证码
            payData.authCode = valus;
            delete payData.payPassword;
        }
        Loading.show();
        $.ajaxE({
            type: 'POST',
            url: '/loanlater/repay/extendTimeConfirm',
            data: payData,
        }).then((data)=>{
            this.setState({
                payVisible: false,
                cPayVisible: false
            },()=>{
                Modal.infoX('展期确认成功!',()=>{
                    history.back();
                });
            })
            
        }).catch((msg)=>{
            this.setState({
                payVisible: false,
                cPayVisible: false
            },()=>{
                Modal.infoX(msg);
            })
        }).finally(()=>{
            //Loading.show();
            Loading.hide();
        })   
    }

    // 驳回展期
    updateLoanExceeding = () => {
        let _this = this;
        let valid = true;
        //借款协议
        if(!_this.state.agreement || _this.state.agreement==-1){
            _this.state.agreement = false;
            valid = false;
        }
        //所有验证通过
        if (valid) {
            Modal.alertX('提醒', '您真的要驳回本次展期内容吗？', [
                {
                    text: '驳回', onPress: () => {
                        Loading.show();
                        $.ajaxE({
                            type: 'POST',
                            url: '/loanlater/loanExceeding/updateLoanExceeding',
                            data: {
                                id:_this.state.info.id,
                                extensStatus:-1
                            }
                        }).then((data) => {
                            Modal.infoX('展期驳回成功',()=>{
                                history.back();
                            })
                        }).catch((msg) => {
                            Modal.infoX(msg);
                        }).finally(()=>{
                            //Loading.show();
                            Loading.hide();
                        })  
                    }
                },
                { text: '再想想', onPress: () => null },
            ])
        }else{
            _this.setState({
                payVisible:false
            });
        }
    }

    //今借到展期协议选中状态改变事件
    onAgreementChange = (v) => {
        this.setState({
            agreement: v.target.checked
        })
    }

    render() { 
        const { userInfo,info } = this.state;
        return (
            <div className='view-form'>
                <div style={{height: '100%',overflow:'auto'}}>
                    <Flex justify='start' className='list-title mar16'>
                        <span className='title'>确认展期信息</span>
                    </Flex> 
                    <List className="detail_list mar30">
                        <List.Item extra={info.repayTmTxt}>展期还款日</List.Item>
                        <List.Item extra={info.interestRateExtend+'%'}>展期利率</List.Item>
                        <List.Item extra={(info.finalPaidAmount/100).toFixed(2)+'元'}>应付款</List.Item>
                    </List>
                    {userInfo.onlineStatus?<List className="confirm_list">
                        <span className="confirm_list_span">
                            <span>10%的待收本金</span>
                            <span>{(info.exceedingReceiveCapitalAmount/100).toFixed(2)}元</span>
                        </span>
                        <span className="confirm_list_span">
                            <span>利息和罚息</span>
                            <span>{(info.exceedingReceiveInterestAmount/100).toFixed(2)}元</span>
                        </span>
                        <span className="confirm_list_span">
                            <span>逾期管理费</span>
                            <span>{(info.exceedingSendOverdueAmt/100).toFixed(2)}元</span>
                        </span>
                        <span className="confirm_list_span">
                            <span>展期服务费</span>
                            <span>{(info.exceedingFeeAmt/100).toFixed(2)}元</span>
                        </span>
                    </List>:<List className="confirm_list">
                        <span className="confirm_list_span">
                            <span>展期服务费</span>
                            <span>{(info.exceedingFeeAmt/100).toFixed(2)}元</span>
                        </span>
                    </List>}
                    <Flex justify='start' className='list-title mar16'>
                        <span className='title'>借条信息</span>
                    </Flex>
                    <List className="detail_list mar30">
                        <List.Item extra={userInfo.lenderName}>出借人</List.Item>
                        <List.Item extra={(userInfo.amount/100).toFixed(2)+'元'}>借款金额</List.Item>
                        <List.Item extra={userInfo.interestRate+'%'}>利率</List.Item>
                        <List.Item extra={userInfo.borrowTimeTxt}>借款日期</List.Item>
                        <List.Item extra={userInfo.repayTimeTxt}>还款日期</List.Item>
                    </List>

                    <Flex justify='center' className="mart15 mab8">
                        <Checkbox.AgreeItem onChange={(v) => this.onAgreementChange(v)}>
                            已阅读并同意
                            <Link className="mainC1"  to='/agreement/extend_agreement'>《今借到展期协议》</Link>
                        </Checkbox.AgreeItem>
                    </Flex>
                </div>
                <div className="common-btn_box">         
                    <Tap onTap={this.updateLoanExceeding} className='span font16'>
                    驳回请求
                    </Tap>	
                    <Tap onTap={this.onConfirmSubmit} className='c-black span font16 active'>
                    确认并支付
                    </Tap>
                </div>

                {this.state.payVisible?<Pay telephone={this.props.userStore.userInfo.telephone}
                    money={(info.finalPaidAmount/100).toFixed(2)}
                    moneyL={(info.finalPaidAmount/100).toFixed(2)}
                    input={false}
                    noPoundage={true}
                    onPayEnd={this.onPay}
                    onClose={()=>{this.setState({payVisible:false})}}
                    payVisible={this.state.payVisible}>	
                </Pay>:null}
                <InputCode onClose={()=>{this.setState({cPayVisible: false})}} visible={this.state.cPayVisible} onEnd={this.onComfirmPay} />

            </div>
        )
    }
}