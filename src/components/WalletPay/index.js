
import './style.less'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {createForm } from 'rc-form'
import { Button, List, Toast, Picker, InputItem  } from 'antd-mobile'

import { Modal, Loading } from 'SERVICE'
import Tap from '../Tap'
import Tips from '../Tips'
import InputValid from '../InputValid'

const Item = List.Item;

export default createForm()(class Pay extends React.Component {
    static defaultProps = {
        telephone: null, //交易账号
        money: 0, //还款总额   
        moneyL: 0,// 补借条线上还款金额
        payVisible: false,//付款弹框
        className: '', //class
        onOpen: ()=>{},
        onClose: ()=>{},
        input: true,//是否可以修改金额，不可修改时，不显示手续费
    }
    static propTypes = {
        onOpen: PropTypes.func,
        onClose: PropTypes.func,
        payVisible: PropTypes.bool,
        onEnd: PropTypes.func,  //返回必要参数
        className: PropTypes.string,
        money: PropTypes.number,
        moneyL: PropTypes.number,
        telephone: PropTypes.string,
        input: PropTypes.bool,
    }
    constructor(props, context) {
        super(props, context);
        this.state = {
            money: 0, //还款金额
            payMethodSelected:'',//选中
            selectPayWays:[{value:0,label:'支付宝',},{value:1,label:'微信',},{value:2,label:'银行卡',},{value:3,label:'银联',},],//
            offLine: false,//打开线下还款弹框
            offOnLine: false,//是否要线下借条线上还款
            creditInfo: null,
            bankData: null,
            bankVisible: false,//选择银行弹框
            payPWD: false,//支付密码弹框
            payWay: '请选择支付方式',  //如果银行卡支付则为数组index,其他为字符串
            selfChange: false,
        };
    }
    componentWillReceiveProps(nextProps){
        let {payWay,creditInfo,money,bankData,selfChange} = this.state;
        if(nextProps.money!=this.state.money){
            let _money = this.state.money;
            if(selfChange){//用户手动修改情况
                _money = money
            }else{//传入值变化
                _money = nextProps.money
            }
            
            payWay = '微信支付'
            //获取银行详情
            Loading.show();
            $.ajaxE({
                type: 'GET',
                url: '/user/my/getPaymentList',
                // data: { amount: parseInt(parseFloat(nextProps.money)*100) }
                data: {
                    withdraw: 0
                }

            }).then((data)=>{
                this.setState({
                    payWay,
                    money: _money,
                    bankData: data
                })
            }).catch((msg)=>{
                Modal.infoX(msg);
            }).finally(()=>{
                Loading.hide();
            })
        }else{
            
            payWay = '微信支付'
            this.setState({
                payWay
            })
        }
    }
    componentDidMount(){
        this.getInfo()
    }
    getInfo(){
        Loading.show();
        //获取基本信息和银行列表
        
        //获取银行详情
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/user/my/getPaymentList',
            // data: { amount: parseInt(parseFloat(this.state.money)*100) }
            data: {
                withdraw: 0
            }
        }).then((data)=>{
            this.setState({
                bankData: data
            })
            return $.ajaxE({
                type: 'GET',
                url: '/user/my/checkCredit',
                data: { userId: $.isUserExist()&&$.getUserInfo().userId }
            })
        }).catch((msg)=>{
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        }).then((data)=>{
            data.amount = $.toYuan(data.amount)
            let payWay='',bankData = this.state.bankData;
            
            payWay = '微信支付'
            this.setState({
                creditInfo: data,
                payWay: payWay
            })
        }).catch((msg)=>{
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }
    onSetMoney(v){
        if(Number(v)>this.props.money)v = this.props.money;
        //若小数点后位数大于2 ，截取
        if(String(v).split('.')[1]&&String(v).split('.')[1].length>2)v = Number(v).toFixed(2)
        //支付方式修改
        let {payWay}=this.state,
            {creditInfo,bankData} = this.state;
        
        this.setState({
            money: v,selfChange:true,
            payWay,
        })
    }
    //选择支付方式
    onSelectPay(index) {
        let { bankData } = this.state,payWay = '';
        //debugger;
        bankData.select = index;

        if(isNaN(Number(index))){
            payWay = index
        }else{            
            let _data = bankData.usableBankList[bankData.select];
            payWay = `${_data.bankName}-${_data.bankAccount.substr(_data.bankAccount.length-4,4)}`
        }
        this.setState({
            bankData,payWay
        }, function () {
            this.onCLoseBank()
        })
    }
    //关闭支付弹框
    onCLosePay = () => {
        
        this.setState({
            offOnLine: false,
            offLine: false,
            bankVisible: false,            
            money: 0, //还款总额   
            moneyL: 0,// 补借条线上还款金额
            selfChange:false  //是否修改过支付金额
        },()=>{
            if(this.props.onClose) this.props.onClose()
        })
    }
    //打开银行弹框
    onOpenBank = () => {
        //获取银行详情
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/user/my/getPaymentList',
            // data: { amount: parseInt(parseFloat(this.state.money)*100) }
            data: {
                withdraw: 0
            }
        }).then((data)=>{
            this.setState({
                bankData: data,
                bankVisible: true
            })
        }).catch((msg)=>{
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }
    //关闭银行弹框
    onCLoseBank = () => {
        this.setState({
            bankVisible: false
        })
    }
    onGoBindCard(){
        if($.getCreditInfo().idCardStatus){
            this.props.history.push({
                pathname: '/card/bind_card',
                query:{
                    payCredit:this.props.payCredit
                }
            });
        }else{
            this.onCLosePay();
            Modal.infoX('您还没有身份认证，去认证',()=>{
                this.props.history.push({
                    pathname: '/user/id_auth',
                    query:{
                        pathType:0,
                        payCredit:this.props.payCredit
                    }
                });
            });
        }

        // this.props.history.push({
        //     pathname: '/card/bind_card',
        //     query: {
        //         passwordStatus: this.state.creditInfo.passwordStatus,
        //         pathnames:'/credit/pay_credit'
        //     }
        // });        
    }
    onOpenPWD=()=>{
        if(this.state.money==0){
            Modal.infoX('支付金额不能为0！')
        }else{
            if((this.props.payCredit==0||this.props.payCredit==1)&&this.state.creditInfo.passwordStatus==0&&(this.state.payWay=='银联支付'||this.state.payWay=='微信支付')){
                //信用认证支付，并且未设置交易密码，交易方式为微信或者银联支付时，此时不需要输入交易密码
                this.onEnd('')
            }else{
                this.setState({ payPWD: true })
            }
        }        
    }
    onEnd(pwd) {
        //线上还款
        let { payWay, bankData, payMethodSelected } = this.state;
        let param = {
            bindBankId: null,//Long 绑卡id(银行卡绑定表ID)
            amount: this.state.money,//Integer 还款金额、销账金额或展期还款金额
            payPassword:pwd,//String 支付密码
            offlinePayMethod:null,//线下支付  0.支付宝 1.微信 2.银行卡 3.现金
            payMethod:null,//Byte 线上支付 ：0.余额 1.银行卡 2-线下 3.银联(收银台类) 4.微信(app类)
        }
            if(payWay=='银联支付')param.payMethod = 3
            else if(payWay=='微信支付')param.payMethod = 4
            else{
                //银行卡支付
                param.payMethod = 1;
                bankData.select = bankData.select==undefined?0:bankData.select;
                param.bindBankId = bankData.usableBankList[bankData.select].id
            }
        //返回值
        this.props.onEnd && this.props.onEnd(param);
        this.props.onClose&&this.onCLosePay()
    }
    onEndOff(pwd){
        //线下还款
        let { payWay, bankData, payMethodSelected } = this.state;
        let param = {
            bindBankId: null,//Long 绑卡id(银行卡绑定表ID)
            amount: this.state.money,//Integer 还款金额、销账金额或展期还款金额
            payPassword:pwd,//String 支付密码
            offlinePayMethod: payMethodSelected[0],//线下支付  0.支付宝 1.微信 2.银行卡 3.现金
            payMethod:null,//Byte 线上支付 ：0.余额 1.银行卡 2-线下 3.银联(收银台类) 4.微信(app类)
        }
        param.payMethod = 2 //线下还款
        //返回值
        this.props.onEnd && this.props.onEnd(param);
        this.props.onClose&&this.onCLosePay()
    }
    render() {
        let {  children, className, moneyL, telephone, payVisible, input, noPoundage  } = this.props;
        let { bankVisible, bankData, creditInfo, payWay, offOnLine, offLine, selectPayWays, money, } = this.state;
        const { getFieldProps } = this.props.form;


        let moneyTip = null,
            moneyShow = money,//默认支付金额为无手学费
        _moneyOff = money - moneyL;//计算手续费的金额
        _moneyOff = _moneyOff<0?0:_moneyOff;
        
        if(noPoundage){
            moneyTip = null
        }else{
            //银行卡、微信、银联的时候   充值、还款、去出借、求借款、充值     小额支付手续手续费2.5元
            if(_moneyOff&&money<500&&payWay!='余额支付'){//有小额支付手续费,有线上还款手续费
                moneyShow = (Number(money)+Number((_moneyOff / 1000 * 5))+2.5).toFixed(2)
                moneyTip = (<span>
                    <p>实际扣款<span className='color'>{moneyShow}元</span>,含有手续费<span className='color'>{(2.5+Number(_moneyOff  / 1000 * 5)).toFixed(2)}元</span></p>
                    <p className='small'>手续费明细如下</p>
                    <p className='small'>1.补借条线上还款，扣除还款金额的5‰作为还款手续费<span className='color'>{(_moneyOff * .005).toFixed(2)}元</span></p>
                    <p className='small'>2.交易金额低于500元，扣除手续费2.5元</p>
                </span>)
            }else if(_moneyOff){//有线上还款手续费
                moneyShow = (Number(money)+Number((_moneyOff / 1000 * 5))).toFixed(2)
                moneyTip = (<span>
                    <p>实际扣款<span className='color'>{moneyShow}元</span>,含有手续费<span className='color'>{(Number(_moneyOff  / 1000 * 5)).toFixed(2)}元</span></p>
                    <p className='small'>手续费明细如下</p>
                    <p className='small'>1.补借条线上还款，扣除还款金额的5‰作为还款手续费<span className='color'>{(_moneyOff * .005).toFixed(2)}元</span></p>
                </span>)
            }else if(!_moneyOff&&money<500&&payWay!='余额支付'){//有小额支付手续费
                moneyShow = Number(money)+2.5
                moneyTip = (<span>
                    <p>实际扣款<span className='color'>{moneyShow}元</span>,含有手续费<span className='color'>2.5元</span></p>
                    <p className='small'>手续费明细如下</p>
                    <p className='small'>1.交易金额低于500元，扣除手续费2.5元</p>
                </span>)
            }else{//没有手续费
                moneyTip = (<span>
                    <p>实际扣款<span className='color'>{money}元</span>,含有手续费<span className='color'>0.00元</span></p>
                </span>)
            }
        }

        return (
            <div>
                {moneyL==0&&!offOnLine?
                    <Modal className={offLine?'credit-bank-box':'credit-tip-box'}
                        popup
                        closable = {offLine}
                        maskClosable ={false}
                        visible={payVisible}
                        onClose={this.onCLosePay}
                        animationType="slide-up">
                        {offLine?
                        <div className='pay-box'>
                            <List renderHeader={() => '线下还款'}>
                                {/* <Item extra={money} onClick={this.onOpenBank}>借款金额</Item> */}
                                <InputItem
                                    style={{textAlign:'right'}}
                                    type='digit'
                                    placeholder="支付金额"
                                    value = {money}
                                    clear
                                    editable={input}
                                    onChange={(v) => { this.onSetMoney(v) }}
                                >借款金额</InputItem>
                                <Picker data={selectPayWays} cols={1} {...getFieldProps('selectPayWays')}
                                value={this.state.payMethodSelected}
                                onOk={(v) => this.setState({ payMethodSelected: v })}
                                extra={'请选择'}>
                                    <Item arrow="horizontal">还款方式</Item>
                                </Picker>
                            </List>
                            <Tap className='bottom-btn' onTap={(e) => { this.setState({ payPWDoff: true }) }}><Button type="primary">我已还款，告知对方</Button></Tap>
                            <InputValid visible={this.state.payPWDoff} onEnd={(pwd) => { this.setState({ payPWDoff: false }); this.onEndOff(pwd) }} onClose={() => { this.setState({ payPWDoff: false }) }} />
                        </div>
                        :<List>
                            <Tap onTap={()=>{this.setState({offOnLine:true})}}>
                                <Item>我要线上还款（无需对方确认）
                                    <Tips>
                                        <p>【线上还款】是指平台内通过钱包余额或绑定的银行卡支付。</p>
                                    </Tips>
                                </Item>
                            </Tap>
                            <Tap onTap={()=>{this.setState({offLine:true})}}>
                                <Item>我已线下还款（需要对方确认）
                                    <Tips>
                                        <p>【线下还款】是指在平台外通过现金/支付宝/微信/银行卡转账等途径支付；</p>
                                        <p>【线下还款】需要对方确认收到款才生效。</p>
                                    </Tips>
                                </Item>
                            </Tap>
                            <Tap onTap={()=>{this.onCLosePay()}}><Item>取消</Item></Tap>
                        </List>}
                    </Modal>
                :<Modal className='credit-bank-box'
                    popup
                    closable
                    maskClosable={false}
                    visible={payVisible}
                    onClose={this.onCLosePay}
                    animationType="slide-up">
                    {bankData?!bankVisible ? <div className='pay-box'>
                        <List renderHeader={() => '支付详情'}>
                            <Item extra={telephone}>交易账户</Item>
                            <Item extra={payWay} arrow="horizontal" onClick={this.onOpenBank}>支付方式</Item>
                            <InputItem
                                style={{textAlign:'right'}}
                                type='digit'
                                placeholder="支付金额"
                                value = {money}
                                clear
                                editable={input}
                                onChange={(v) => { this.onSetMoney(v) }}
                            >支付金额</InputItem>
                        </List>
                        { moneyTip }
                        {payWay=='请选择支付方式'?<Button type="primary" disabled>确认支付{moneyShow}元</Button>:<Tap className='bottom-btn' onTap={() => { this.onOpenPWD() }}><Button type="primary">确认支付{moneyShow}元</Button></Tap>}
                        <InputValid visible={this.state.payPWD} onEnd={(pwd) => { this.setState({ payPWD: false }); this.onEnd(pwd) }} onClose={() => { this.setState({ payPWD: false }) }} />
                    </div> :
                        <div className='pay-box bank-box'>
                            <Tap className='back' onTap={() => { this.setState({ bankVisible: false }) }}>
                                <img src={'/imgs/com/arrows.svg'} />
                            </Tap>
                            <List renderHeader={() => '支付方式'}>
                                
                                {$.isWeiXin?<Item arrow="horizontal" onClick={() => { this.onSelectPay('微信支付') }}>微信支付</Item>:null}
                                {bankData && bankData.usableBankList && bankData.usableBankList.length ?
                                    bankData.usableBankList.map((ele, index) => {
                                        return <Tap key={'bank' + index} onTap={() => { this.onSelectPay(index) }}><Item arrow="horizontal" extra={bankData.select == index ? <i className='chosen' /> : ''}>{`${ele.bankName}-${ele.bankAccount.substr(ele.bankAccount.length-4,4)}`}</Item></Tap>
                                    })
                                    : null}

                                <Item arrow="horizontal" onClick={() => { this.onSelectPay('银联支付') }}>银联支付</Item>
                                <Tap onTap={() => { this.onGoBindCard() }}><Item arrow="horizontal">绑定新卡支付</Item></Tap>

                                {bankData && bankData.unUsableBankList && bankData.unUsableBankList.length ?
                                    bankData.unUsableBankList.map((ele, index) => {
                                        return <Item className='disable' key={'unUseBank' + index}>{`${ele.bankName}-${ele.bankAccount.substr(ele.bankAccount.length-4,4)}`}</Item>
                                    })
                                    : null}
                                
                            </List>
                        </div>:<p className='common-no-data'>没有数据</p>}
                </Modal>}
            </div>
        );
    }
})

