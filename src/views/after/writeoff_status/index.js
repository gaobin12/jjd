//发起销帐 => 发起成功
import '../form.less'
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { Link,withRouter } from 'react-router-dom'
import { Tap, } from 'COMPONENT'
import { List,Flex  } from 'antd-mobile'
import { Loading, Modal, util,  } from 'SERVICE'
const writeOffPayMethodStr = [    
    {
        text: "其他方式已还款",
    },
    {
        text: "出借人自愿免除债务",
    },
    {
        text: "其他",
    }
];
@withRouter
@inject('userStore')
@observer
export default class App extends Component {
	constructor(props, context) {
		document.title = "发起成功";
		super(props, context)
		
        let query = util.getUrlParams(this.props.location.search);
		let strs = query.id.split('___');

		this.state = {
            id:strs[0],
            oId:strs[1],
            isShare:strs[2],
            isSelf:2,
            payPeople:query.payPeople,
            //销账id
            writeOffId:'',
			//借款人
			borrowerName:'',
			//销账金额
			chargeOffMoney:0,
			//借款人手机号
            borrowerTel:'',
			//剩余确认时长
            restTime:{
                h:0,
                m:0
            },
            writeOffPayMethod:'',
            // 销账状态：0-已申请(初始值)；1-已拒绝；2-已接收-支付成功；3-已接收-支付失败
            writeOffStatus:0
		};
	}
	componentDidMount() {
        this.getShowStatus();
	}
	getShowStatus=()=>{
		let { userInfo } = this.props.userStore;
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/loanlater/repay/getWriteOffConfirmInfo',
            data: {
                writeOffId: this.state.oId,
                unneedPay:true
            }
        }).then((data) => {
            let self = 2;
            if(data.lenderUidE == userInfo.userId){  
                self = 1;
            }

            if(data.borrowerUidE == userInfo.userId){
                self = 0;
            }

            if(self==0 && (data.writeOffStatus==0 || data.writeOffStatus==3)){
                this.props.history.push({
                    pathname: '/after/off_confirm',
                    search: `?id=${data.writeOffId}&isShare=${this.state.isShare}`
                });
                return;
            }

            if(self==2){
                Modal.infoX('您不能操作此销账',()=>{
                    this.props.history.push({
                        pathname: '/'
                    });
                });
            }else{
                let h = parseInt(data.restSecond / 60 / 60 % 24 , 10); //计算剩余的小时
                let m = parseInt(data.restSecond / 60 % 60, 10);//计算剩余的分钟     
                this.setState({
                    show:true,
                    isSelf:self,
                    borrowerName:data.borrowerName,
                    //销账金额
                    chargeOffMoney:$.toYuan(data.amount),
                    //借款人手机号
                    borrowerTel:data.borrowerTelephone,
                    //剩余确认时长
                    restTime:{
                        h,
                        m
                    },
                    writeOffPayMethod:writeOffPayMethodStr[data.writeOffPayMethod-1].text,
                    writeOffStatus:data.writeOffStatus
                })
                return;
            }
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }
	//获取今天剩下的时间
	getLeftTime=()=>{
		let now = new Date();
		let h = 23 - now.getHours();
		let m = 59 - now.getMinutes();
		return {h,m}
	}
	onShare=()=>{
        $.setItem('wx_share',{
            id:this.state.id+'___'+this.state.oId+'___1',
            code:2,
            path:'/after/writeoff_status',
            amt:this.state.chargeOffMoney,
            txt:this.state.writeOffPayMethod
        });
        this.props.history.push({
            pathname: '/after/share'
        });
    }

    onSuccess=()=>{
        if(this.state.isShare==1){
            if(this.state.isSelf==1){
                this.props.history.push({
                    pathname: '/after/loan_detail',
                    search: `?id=${this.state.id}`
                });
            }
            if(this.state.isSelf==0){
                this.props.history.push({
                    pathname: '/after/borrow_detail',
                    search: `?id=${this.state.id}`
                });
            }
        }else if(this.state.isShare==2){
            history.go(-2)
        }else{
            history.go(-1)
        }
    }
	render() {
		if(!this.state.show){
            return null;
		}
		if(this.state.writeOffStatus==0){
            return (
                <div className='begin_success view-form'>
					<div style={{height: '100%',overflow:'auto'}}>		
						<img src={'/imgs/iou/begin-succ.svg'} className="succ-img" />
						<p className="off-money">{this.state.chargeOffMoney}<span>元</span></p>
						<p className="off-tit">已向借款人{this.state.borrowerName}发起了销账</p>
						<Flex className="succ-table-flex" justify="between">
							<Flex.Item className="font14">剩余确认时长</Flex.Item>
							<Flex.Item className="font14">{this.state.restTime.h}小时{this.state.restTime.m}分钟</Flex.Item>
						</Flex>
						<Flex className="succ-table-flex" justify="between">
							<Flex.Item className="font14">联系借款人</Flex.Item>
							<Flex.Item className="font14">{this.state.borrowerTel}</Flex.Item>
						</Flex>
					</div>
                    <div className='common-btn_box'>
                        <Tap className={this.state.payPeople==2?'span c-black active':'span'} onTap={this.onSuccess} >完成</Tap>
                        {this.state.payPeople==2?null:<Tap className='c-black span font16 active' onTap={this.onShare} >提醒Ta确认</Tap>}
                    </div>
                </div>
            )
		}
		if(this.state.writeOffStatus==1){
            return (
                <div className='view-form begin_success'>
					<div style={{height: '100%',overflow:'auto'}}>		
						<img src={'/imgs/iou/off-succ.svg'} className="succ-img" />
						<p className="off-money">{this.state.chargeOffMoney}<span>元</span></p>
						<p className="off-tit">借款人驳回销账请求</p>
					</div> 
                    <div className='common-btn_box'>
                        <Tap className='c-black span active' onTap={this.onSuccess} >完成</Tap>
                    </div>
                </div>
            )
        }


        if(this.state.writeOffStatus==2){
            return (
                <div className='view-form begin_success'>
                    <div style={{height: '100%',overflow:'auto'}}>		
						<img src={'/imgs/iou/off-succ.svg'} className="succ-img" />
						<p className="off-money">{this.state.chargeOffMoney}<span>元</span></p>
						<p className="off-tit">已完成对借款人的销账</p>
						<p className="off-font">您对应的待收款相应的减少{this.state.chargeOffMoney/100}元，<br/>平台不再对销款项进行催收</p>
					</div>
					<div className='common-btn_box'>
                        <Tap className='span c-black active' onTap={this.onSuccess} >完成</Tap>
                    </div>
                </div>
            )
        }

        if(this.state.writeOffStatus==3){
            return (
                <div className='view-form begin_success'>
                    <div style={{height: '100%',overflow:'auto'}}>		
						<img src={'/imgs/iou/off-succ.svg'} className="succ-img" />
						<p className="off-money">{this.state.chargeOffMoney}<span>元</span></p>
						<p className="off-tit">销账失败</p>
					</div> 
                    <div className='common-btn_box'>
                        <Tap className='c-black span active' onTap={this.onSuccess} >完成</Tap>
                    </div>
                </div>
            )
        }
	}
}