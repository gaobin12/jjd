
import './style.less'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Flex,List,InputItem } from 'antd-mobile'
import { Tap,Tips,InputCode,InputValid } from 'COMPONENT'
import { Loading, Modal, util, math } from 'SERVICE'

@withRouter
@inject('userStore','bankStore')
@observer
export default class Pay extends Component {    
    static propTypes = {
        onClose: PropTypes.func,
        payVisible: PropTypes.bool,
        edit: PropTypes.bool,
        onLine: PropTypes.bool,
        poundage: PropTypes.bool,
        onPayEnd: PropTypes.func,  //返回必要参数
        className: PropTypes.string,
        money: PropTypes.number,
    }
    static defaultProps = {
        money: 0, //还款总额   
        onLine: true,//线上还款金额
        poundage:false, //是否有手续费
        payVisible: false,//付款弹框
        edit: false,//是否可以修改金额，不可修改时，不显示手续费
        className: '', //class
        onPayEnd:()=>{},
        onClose: ()=>{},
    }
    constructor(props, context) {
        super(props, context);
        this.state = {
            money: props.money, //还款金额
            moneyTotal:props.money, //还款金额和手续费
            payMethodSelected:'',//选中
            offLine: false,//打开线下还款弹框
            offOnLine: false,//是否要线下借条线上还款
            creditInfo: null,
            bankData: null,
            bankVisible: false,//选择银行弹框
            payPWD: false,//支付密码弹框
            selfChange: false,

            //0:选择线上、线下支付方式   1:支付主页   2:选择银行卡  3:密码框
            mode:props.onLine?1:0,
            //是否正在编辑
            editing:false,
            //输入金额
            inputValue:props.money,//还款金额
            totalValue:props.money,//还款金额和手续费
            poundageValue:0,
            //支付方式 ：0.余额 1.银行卡 2.线下 3.银联(收银台类) 4.微信(app类)
            payWays:{
                //选择支付方式
                selected:null,
                balance:false,
                wechat:false,
                bankcard:false,
                cardName:'银行卡支付',
                cardId:null,
                bank:true
            },
            selectedCard:null
        };
    }
    
    componentWillReceiveProps(nextProps){
    }

    componentDidMount(){        
        //更新用户银行卡信息
        this.props.userStore.getUserCreditInfo(()=>{            
            this.props.bankStore.getPaymentList(0,()=>{
                this.getPayWay();
            });
        });
    }

    //初始化支付方式
    getPayWay=()=>{
        let {poundage,userStore,bankStore} = this.props;
        let {poundageValue,payWays,inputValue,totalValue} = this.state;      
        if(poundage){
            //需要支付手续费
        }

        if(parseFloat(userStore.creditInfo.amount)>=parseFloat(totalValue)){
            payWays.balance = true;
        }

        if($.isWeiXin){
            payWays.wechat = true;
        }

        if(bankStore.userCards && bankStore.userCards.usableBankList.length){
            payWays.bankcard = true;
            payWays.cardName = bankStore.userCards.usableBankList[0].cardName;
            payWays.cardId = bankStore.userCards.usableBankList[0].id;
        }
        
        if(parseFloat(userStore.creditInfo.amount)>=parseFloat(totalValue)){
            //判断余额是否足够支付
            payWays.selected = 0;
        }else if($.isWeiXin){
            payWays.selected = 4;
        }else if(bankStore.userCards && bankStore.userCards.usableBankList.length){
            payWays.selected = 1;            
        }else{
            payWays.selected = 3;
        }
        this.setState({
            totalValue,
            payWays
        })
    }

    //改变金额
    amtChange=(e)=>{        
        if(e.target.value.length){
            let v = 0;
            v = parseFloat(e.target.value);
            if(v<0){
                v = 0;
            }
            this.setState({
                inputValue:v
            });
        }else{
            this.setState({
                inputValue:''
            });
        }
    }

    amtBlur=(e)=>{
        let v = 0;
        if(!e.target.value.length){
            v = 0;            
        }else{
            v = parseFloat(e.target.value);
        }
        this.setState({
            inputValue:v,
            editing:false
        });
    }

    onSelectCard=()=>{
        this.setState({
            mode:2
        });
    }

    onCheck=(op)=>{
        let { payWays } = this.state;
        payWays.selected = op;
        this.setState(payWays)
    }

    //开始编辑金额
    onEditMoney=(op)=>{
        if(op){
            this.setState({
                editing:true
            });
            setTimeout(() => {
                this.refs.money.focus()
            }, 0);
            
        }else{
            this.setState({
                editing:false
            });
        }
    }

    //关闭支付弹框
    onCLosePay=()=>{
        const { mode } = this.state;
        if(mode==2){
            this.setState({
                mode:1
            });
        }else{
            this.props.onClose && this.props.onClose();
        }
    }

    //选择银行卡
    onCheckCard=(ob)=>{
        this.setState({
            selectedCard:ob.id
        })
    }

    //绑定新卡
    onNewCard=()=>{
        const { userStore } = this.props;
        userStore.setBox({
            pay:false,
            code:false
        });
        if(userStore.creditInfo.idCardStatus){
            //sessionStorage.setItem('card_back_pathname',location.hash.split('#')[1])
            this.props.history.push({
                pathname: '/card/bind_card'
            });
        }else{            
            //sessionStorage.setItem('card_back_pathname',location.hash.split('#')[1])
            Modal.infoX ('您还没有实名认证，去认证',()=>{
                this.props.history.push({
                    pathname: '/user/id_auth'
                });
            });
        }
    }

    //确认支付
    onSubmit=()=>{
        if(this.state.mode==1){
            this.setState({
                mode:3
            });
        }
    }

    onPwdEnd=(pwd)=>{
        this.props.onPayEnd({
            amount:this.state.inputValue,
            payMethod:this.state.payWays.selected,
            payPassword:pwd,
            bindBankId:this.state.payWays.selected==1?this.state.payWays.cardId:null,
            authCode:null
        })
        this.props.userStore.setBox({
            pay:false
        });
    }

    onPwdClose=()=>{
        this.setState({
            mode:2
        });
    }

    render() {
        const { payVisible,edit,money,bankStore,userStore } = this.props;
        const { mode,payWays,editing,inputValue,totalValue,selectedCard } = this.state;

        const payModes = (
            <Modal className='com-pay-box'
                popup
                closable = {false}
                maskClosable ={false}
                visible={payVisible}
                animationType="slide-up">
                <List className='pay-box'>
                    <Flex justify='center' className='title'>
                        <Tap onTap={this.onCLosePay}>
                            <img src='/imgs/pay/close.svg' />
                        </Tap>   
                        <span>支付方式</span>
                    </Flex>
                    <Flex justify='center'>
                        <span className='left'>线上支付</span>
                    </Flex>
                    <Flex justify='center'>
                        <span className='left'>线下支付</span>
                    </Flex>    
                </List>
            </Modal>
        )

        const payBox = (
            <Modal className='com-pay-box'
                popup
                closable = {false}
                maskClosable ={false}
                visible={payVisible}
                animationType="slide-up">
                <List className='pay-box'>
                    <Flex justify='center' className='title'>
                        <Tap onTap={this.onCLosePay}>
                            <img src='/imgs/pay/close.svg' />
                        </Tap>   
                        <span>{userStore.userInfo.telephone}  支付详情</span>
                    </Flex>
                    <div className="payitems">
                        <Flex justify='around' className="around">
                            <span className='left'>实际支付</span>
                            <span className='right'>{inputValue}元</span>
                        </Flex>
                        <Flex justify='around' className="around">
                            <span className='left'>含手续费</span>
                            <span className='right'>0.00元 <img className="arrow-r" src='/imgs/pay/arrow-r.svg' /></span>
                        </Flex>
                    </div>

                    {editing ? <Flex justify='center' className="money">
                        <span><input ref="money" type="number" value={inputValue} onChange={this.amtChange} onBlur={this.amtBlur}/></span>
                        <span className="yuan">元</span>
                    </Flex>:null}
                    {editing ? <Flex justify='center' className="money-tag">
                        <Tap onTap={()=>{this.onEditMoney(0)}}>
                            <span>确认金额</span>
                        </Tap>
                    </Flex>:null}

                    {!editing ? <Flex justify='center' className="money">                   
                        <span>{inputValue}</span>
                        <span className="yuan">元</span>
                    </Flex>:null}
                    {!editing?<Flex justify='center' className="money-tag">  
                        <Tap onTap={()=>{this.onEditMoney(1)}}>
                            <img src='/imgs/pay/pencil.svg' /><span>编辑金额</span>
                        </Tap>
                    </Flex>:null}

                    <Flex justify='center' className='label'>
                        <span>支持部分还款,金额可修改</span>
                    </Flex>

                    {payWays.balance ? <Flex justify='around' className="around">                        
                        <span className='left'><img src='/imgs/pay/yuan.svg' />账户余额({$.toYuan(userStore.creditInfo.amount)}元)</span>
                        <Tap className='right' onTap={()=>{this.onCheck(0)}}>
                            {payWays.selected==0?<img src='/imgs/pay/right.svg' />:<span className='check'></span>}
                        </Tap>                        
                    </Flex> : <Flex justify='around' className="around">                        
                            <span className='left'><img src='/imgs/pay/yuan_.svg' />账户余额({$.toYuan(userStore.creditInfo.amount)}元)</span>
                    </Flex>}

                    {payWays.wechat ? <Flex justify='around' className="around">                                             
                        <span className='left'><img src='/imgs/pay/wx.svg' />微信支付</span>
                        <Tap className='right' onTap={()=>{this.onCheck(4)}}>
                            {payWays.selected==4?<img src='/imgs/pay/right.svg' />:<span className='check'></span>}
                        </Tap>
                    </Flex> : <Flex justify='around' className="around">                        
                        <span className='left'><img src='/imgs/pay/wx.svg' />微信支付</span>
                    </Flex>}

                    {payWays.bankcard ? <Flex justify='around' className="around"> 
                        <span onTouchEnd={this.onSelectCard} className='left'><img src='/imgs/pay/bankcard.svg' />{payWays.cardName}</span>
                        <Tap className='right' onTap={()=>{this.onCheck(1)}}>
                            {payWays.selected==1?<img src='/imgs/pay/right.svg' />:<span className='check'></span>}
                        </Tap>                
                    </Flex> : <Flex justify='around' className="around">                        
                        <span className='left'><img src='/imgs/pay/bankcard.svg' />{payWays.cardName}</span>
                    </Flex>}

                    {payWays.bank ? <Flex justify='around' className="around">                                           
                        <span className='left'><img src='/imgs/pay/bank.svg' />银联支付</span>
                        <Tap className='right' onTap={()=>{this.onCheck(3)}}>
                            {payWays.selected==3?<img src='/imgs/pay/right.svg' />:<span className='check'></span>}
                        </Tap>  
                    </Flex> : <Flex justify='around' className='lose' className="around">                        
                        <span className='left'><img src='/imgs/pay/bank_.svg' />银联支付</span>
                    </Flex>}

                    <Flex justify='center' className='bottom'>
                        <Tap className='c-black span font16 active' onTap={this.onSubmit}>
                            确认支付{inputValue}元
                        </Tap>
                    </Flex>                    
                </List>
            </Modal>
        )

        const cardBox = (
            <Modal className='com-pay-box'
                popup
                closable = {false}
                maskClosable ={false}
                visible={payVisible}
                animationType="slide-up">
                <List className='pay-box'>
                    <Flex justify='center' className='title'>
                        <Tap onTap={this.onCLosePay}>
                            <img src='/imgs/pay/close.svg' />
                        </Tap>                        
                        <span>选择银行卡</span>
                    </Flex>
                    <div className="carditems">
                        {bankStore.userCards && bankStore.userCards.usableBankList.map((item) => {
                            return <Tap className='cards' onTap={() => { this.onCheckCard(item) }}>
                                <Flex justify='between' className='card'>
                                    <span className='left'>{item.cardName}</span>
                                    <div className="right">
                                        {selectedCard == item.id ? <img src='/imgs/pay/right.svg' /> : <span></span>}
                                    </div>
                                </Flex>
                            </Tap>
                        })}

                        {bankStore.userCards && bankStore.userCards.unUsableBankList.map((item) => {
                            return <Flex direction='column' align='start' className='card carderr'>
                                <span className='left'>{item.cardName}</span>
                                <span className="err">该支付方式不支持当前交易</span>
                            </Flex>
                        })}

                        <Tap className='cards' onTap={this.onNewCard}>
                            <Flex justify='between' className='card'>
                                <span className='left'>绑定新卡</span>
                                <span className='right'><img className="arrow-r" src='/imgs/pay/arrow-r.svg' /></span>
                            </Flex>
                        </Tap>
                        
                    </div>
                    

                    <Flex justify='center' className='bottom'>
                        <Tap className='c-black span font16 active' onTap={this.onSubmit}>
                            确认支付{totalValue}元
                        </Tap>
                    </Flex>                    
                </List>
            </Modal>
        )

        const InputPwd = (
            <InputValid              
                visible={payVisible} 
                onEnd={this.onPwdEnd} 
                onClose={this.onPwdClose} />
        )

        if(mode==0){
            return payModes;
        }
        if(mode==1){
            return payBox;
        }
        if(mode==2){
            return cardBox;
        }
        if(mode==3){
            return InputPwd;
        }

        return  null;
    }
}

