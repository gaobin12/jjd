//借条详情 => 发起展期
import '../form.less';
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Button, List, DatePicker, Picker, Checkbox,Flex,InputItem } from "antd-mobile";
import { createForm } from 'rc-form';
import { Tap, InputValid } from 'COMPONENT'
import { Loading, Modal } from 'SERVICE'
import util from 'SERVICE/util'

const Item = List.Item;
const AgreeItem = Checkbox.AgreeItem;

//利率
const c_rate = [];
const c_currentDate = new Date(Date.now());
const c_prepay = [];

//利率
for(let i=0;i<=24;i++){
    c_rate.push({
        label:i+"%",
        value:i
    })
}

//利率
for(let i=0;i<=40;i++){
    c_prepay.push({
        label:i+"%",
        value:i
    })
}

@withRouter
@inject('userStore','afterIouStore')
@observer
export default createForm()(class App extends Component {
    constructor(props, context) {
        document.title = "展期管理";
        super(props, context)
        //获取链接参数
        let query = util.getUrlParams(this.props.location.search);
        const pre_state = props.afterIouStore.detail;
        // //展期还款日是否已逾期
        let overTime = false;
        if(pre_state.nowRepayTime*1000 < Date.now()){
            overTime = true;
        }
        
        //展期开始时间
        let startDay = c_currentDate.DateAdd('d',1);
        if(overTime){
            //已逾期        
        }else{
            startDay = (new Date(pre_state.nowRepayTime*1000)).DateAdd('d',1);
        }
        this.state = {
            pick1:false, // 控制选择框颜色
            pick2:false, // 控制选择框颜色
            pick3:false, // 控制选择框颜色
            id:query.id,
            //密码弹框
            popupPwd: false,
            //借款协议
            agreement: -1,
            //借款人
            borrowName: pre_state.borrowerName,
            borrowerUidE:pre_state.borrowerUidE,
            //借款金额
            amount: pre_state.amount,
            gatheringAmount:pre_state.gatheringAmount,
            //利率
            rate: pre_state.interestRate,
            interestAmount:(pre_state.interestAmount/100).toFixed(2),
            toBeReceivedInterestForfeitAmount:pre_state.toBeReceivedInterestForfeitAmount,
            toBeReceivedAmount:pre_state.toBeReceivedAmount,
            //线下或线上
            onlineStatus:pre_state.onlineStatus,
            //借款日期
            borrowTimeTxt: (new Date(pre_state.borrowTime*1000)).Format('yyyy-MM-dd'),
            repayTime:pre_state.repayTime,
            //预期还款日期
            repayTimeTxt: (new Date(pre_state.repayTime*1000)).Format('yyyy-MM-dd'),
            repayDate: (new Date(pre_state.repayTime*1000)),
            //展期开始日
            startDay,
            endDay:startDay.DateAdd('y',5),
            //展期还款日
            repaymentDay: null,
            // 展期利率
            rolloverRate: 0,
            // 展期预收本金
            prePay: 0,
            //间隔天数
            spaceDates:0,
            //利息
            interest:0,
            overTime
        }        
    }

    componentDidMount() {
        
    }

    //提交表单
    onSubmit = () => {
        //debugger;
        this.props.form.validateFields((error, value) => {
            let valid = true,msg = '';
            //展期还款日
            if(!this.state.repaymentDay){
                this.state.repaymentDay = false;
                valid = false;
                msg='请选择还款日期'
            }
            //借款协议
            if(!this.state.agreement || this.state.agreement==-1){
                this.state.agreement = false;
                valid = false;
                msg='请勾选展期协议'
            }
            //表单验证
            if(error != null){
                valid = false;
            }
            //所有验证通过
            if (valid) {
                //所有验证通过
                this.setState({
                    popupPwd: true
                });
            }else{
                Modal.infoX(msg)
                this.setState({
                    popupPwd: false
                });
            }
        });
    }

    //密码确认完成
    onPwdConfirm = (pwd) => {
        //debugger
        const _this = this;
        let postData = {
            loanIdE: _this.state.id, //借条id
            repayTm: Math.round(_this.state.repaymentDay.getTime()/1000), //预期还款日期（时间戳格式）
            interestRateExtend: _this.state.rolloverRate, //展期申请的年化利率
            exceedingDays: _this.state.spaceDates, //展期天数
            exceedingReceiveRate: _this.state.prePay, //展期预还本金率
            payPassword: pwd //交易密码
        };
        Loading.show();
        $.ajaxE( {
            flag:1,
            type: 'POST',
            url: "/loanlater/loanExceeding/applyLoanExceeding",
            data: postData
        }).then((json) => {
            let { afterIouStore } = this.props;
            let ssData = afterIouStore.detail
            ssData.repaymentDay = _this.state.repaymentDay.getTime();
            ssData.rolloverRate = _this.state.rolloverRate;
            afterIouStore.setDetail(ssData)
            _this.props.history.push({
                pathname: '/after/show_status',
                search: '?id='+this.state.id+'___3'
            })
        }).catch((res) => {
            _this.fromStatus(res.msg,res);
        }).finally(()=>{
            this.setState({
                popupPwd: false
            });
            Loading.hide();
        })     
    }

    //根据repay/repayApply 返回的status 判断
    fromStatus=(msg,res)=>{
        const _this = this;
        if(res.status==202){
            //"msg": "有一笔线下还款需要您处理，请先处理后再发起销账",
            Modal.alertX('提示', msg, [
                { text: '取消', onPress: () => {} },
                { text: '去处理', onPress: () => {
                    _this.props.history.push({
                        pathname: '/after/loan_detail',
                        search: '?id='+res.data.loanId+'&tab=1',
                        query: {
                            tab:1,
                            id:res.data.loanId
                        }
                    });
                }},
            ])
        }else{
            Modal.infoX(msg);
        }
    }

    //picker改变
    onPickerChange = (v, type) => {
        if (type == 'date') {
            this.setState({
                repaymentDay: v
            },()=>{
                this.moneyChange();
            });
        }
        if (type == 'rate') {
            this.setState({
                rolloverRate: v[0]
            },()=>{
                this.moneyChange();
            });
        }
        if (type == 'prepay') {
            this.setState({
                prePay: v[0]
            },()=>{                
                this.moneyChange();
            });
        }
    }

    moneyChange=()=>{
        let { interest,rolloverRate,amount,repayDate,repaymentDay,startDay,overTime } = this.state;

        let datas = 0;
        if(repaymentDay){
            datas = util.iouComputedDays(repaymentDay,startDay);
            if(!overTime){
                datas = datas+1;
            }
        }
		//利息
		interest = util.iouComputedInterest(amount/100,rolloverRate,datas).toFixed(2);
		this.setState({
			interest,
			spaceDates:datas
		});
	}

    //是否统一借款协议
    onAgreementChange = (v) => {
        this.setState({
            agreement: v.target.checked
        });
    }

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        return (
            <div className='view-form'>
                <div style={{height: '100%',overflow:'auto',paddingBottom:'0.2rem'}}>
                    <Flex justify='start' className='list-title mar16'>
                        <span className='title'>确认展期信息</span>
                    </Flex>
                    <List className="form-list">
                        <DatePicker
                            mode="date"
                            title="还款日"
                            extra="请选择还款日"
                            value={this.state.repaymentDay}
                            minDate={this.state.startDay}
                            maxDate={this.state.endDay}
                            format={(v)=>{
                                return v.Format('yyyy-MM-dd') + ' , ' + this.state.spaceDates + '天'
                            }}
                            onChange={(v) => { this.onPickerChange(v, 'date') }}
                            >
                            <List.Item arrow="horizontal">展期还款日</List.Item>
                        </DatePicker>
                        <Picker data={c_rate}
                            cols={1}
                            title="利率"
                            className="forss"
                            value={[this.state.rolloverRate]}
                            onChange={(v) => { this.onPickerChange(v, 'rate') }}>
                            <List.Item arrow="horizontal">展期利率</List.Item>
                        </Picker>  
                        <Picker data={c_prepay}
                            cols={1}
                            title="预付本金率"
                            className="forss"
                            value={[this.state.prePay]}
                            onChange={(v) => { this.onPickerChange(v, 'prepay') }}>
                            <List.Item arrow="horizontal">展期预收本金</List.Item>
                        </Picker>   
                    </List>
                    {this.state.onlineStatus && this.state.interest?<List className="confirm_list">
                        <span className="confirm_list_span">
                            <span>对方确认后您将立即回收</span>
                            <span>{(Math.round(parseInt(this.state.toBeReceivedAmount/10/100*100))/100 + this.state.toBeReceivedInterestForfeitAmount/100).toFixed(2)}元</span>
                        </span>
                        <span className="confirm_list_span">
                            <span>展期预收本金</span>
                            <span>{Math.round(parseInt(this.state.toBeReceivedAmount/100/10*100))/100}元</span>
                        </span>
                        <span className="confirm_list_span">
                            <span>利息和罚息</span>
                            <span>{(this.state.toBeReceivedInterestForfeitAmount/100).toFixed(2)}元</span>
                        </span>
                    </List>:null}
                    <Flex justify='start' className='list-title mar16'>
                        <span className='title'>借条内容</span>
                    </Flex> 
                    <List className="detail_list mar30">
                        <Item extra={this.state.borrowName}>借款人</Item>
                        <Item extra={this.state.amount/100+'元'}>借款金额</Item>
                        <Item extra={this.state.rate+'%'}>利率</Item>
                        <Item extra={this.state.borrowTimeTxt}>借款日期</Item>
                        <Item extra={this.state.repayTimeTxt}>还款日期</Item>
                    </List>
                    <Flex justify='center' className="mart15 mab8">
                        <Checkbox.AgreeItem onChange={this.onAgreementChange}>
                            已阅读并同意
                            <Link className="mainC1"  to='/agreement/extend_agreement'>《今借到展期协议》</Link>
                        </Checkbox.AgreeItem>
                    </Flex>
                </div>

                <div className='common-btn_box'>
                    <Tap className='c-black span font16 active' onTap={this.onSubmit}>发起展期</Tap>
                </div>
                {this.state.popupPwd ? <InputValid visible={this.state.popupPwd} onEnd={this.onPwdConfirm} onClose={() => this.setState({ popupPwd: false })} /> : null}
            </div>
        )
    }
})