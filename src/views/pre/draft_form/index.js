
//首页 => 借条草稿
import '../form.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Flex, List, Picker, Checkbox } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Loading, Modal, util, math } from 'SERVICE'
import { Tap, InputComt, InputMoney, Button, Side } from 'COMPONENT'

const c_rate = [];
const c_current = new Date(Date.now());

@withRouter
@inject('userStore','preDraftStore')
@observer
class Page extends Component {
	constructor (props, context) {
		document.title = "添加草稿";
		super(props, context)		
		for(let i=0;i<=24;i++){
			c_rate.push({
				label:i+"%",
				value:i
			})
        }
		this.state = {
        };
	}
	componentDidMount(){
        //获取用户可借额度
        this.props.userStore.getUserBorrowAmt();
        //检查用户信用认证
        this.props.userStore.checkUserCredit();
    }

    onTabUse=(ob)=>{
        this.props.preDraftStore.setForm({use:ob});
    }
    
	//修改利率
	pickerChange=(v)=>{
        let { preDraftStore } = this.props;
        preDraftStore.setForm({
			rate:v[0]
		},()=>{
			this.moneyChange();
		});
	}
	//修改本金
	amtChange=(v)=>{
        let { preDraftStore } = this.props;
        preDraftStore.setForm({
			amount:v
		},()=>{
			this.moneyChange();
		});
    }
    
	moneyChange=()=>{
        let { borrowDays,rate,amount,interest,totalAmt } = this.props.preDraftStore.form;
		interest = util.iouComputedInterest(amount,rate,borrowDays);
        totalAmt = util.iouComputedAmount(amount,interest);
        this.props.preDraftStore.setForm({
            interest:$.to2(interest),
            totalAmt
		})
    }

    //修改借款时长
    onDaysChange=(e)=>{
        this.props.preDraftStore.setForm({
            borrowDays:e
        });
    }

    //点击提交按钮
    onBtn=(ob)=>{
        let _this = this;
        const { form } = this.props.preDraftStore;
        Modal.alertX('',<div className='dialog-supply'>
				<span>
					<img src={'/imgs/iou/rev-warning.png'} alt="" />
					<span className='color1' style={{color:'#ff9900'}}>补借条是为已经完成的借贷行为补一张借条，
					不走账，仅作为电子凭证，请确保你们已经线下交易完毕</span>
				</span>
				<span className='text'>
					确认后，借条即刻生效，要确认该借条吗？
				</span>
			</div>,[
				{ text: '取消', onPress: null, style: 'default' },
				{ text: '确认', onPress:(e)=>{
					_this.onCheckSubmit();
				}}
			])
    }

    //检查用户状态信息
    onCheckSubmit=()=>{
        let _this = this;
        let { userStore,preDraftStore } = this.props;  

        //检查用户举报状态
        if(userStore.checkUserReport()){
            Loading.show();
            //更新用户认证信息
            userStore.getUserCreditInfo(()=>{
                Loading.hide();
                //检查运营商认证
                if(userStore.checkUserMobileCredit(preDraftStore.form.tab)){
                    //检查学信认证
                    if(userStore.checkUserXueXin()){
                        _this.props.userStore.setBox({
                            pwd:true,
                            onPwdEnd:_this.onPwdConfirm
                        });
                    }
                }
            });
        }
    }

	//是否同意借款协议
	onAgreementChange=(v)=>{
        this.props.preDraftStore.setForm({
            checked:v.target.checked
        });
    }

	//提交表单数据
	onPwdConfirm=(pwd)=>{
        const { userStore,preDraftStore,preDraftStore:{form} } = this.props;
        userStore.setBox({
            pwd:false
        });
        debugger;
		let postData = {
			// 支付密码
			payPassword:pwd,
			// 金额
			borrowAmount:$.toFen(form.amount),
			// 借钱日期
			borrowDays: form.borrowDays,
			// 年化利率
			interestRate:form.rate,
			// 借钱用途
			purpose:form.use.value,
			// 用户补充说明
			memo:'',
			// 出借人姓名
			lenderName:userStore.userInfo.userName, 
			// 创建的类型，0为作为借款人，1为出借人
			creatorType:1,
			// 图片列表
			picList:[]
        };
		Loading.show();
		$.ajaxE({
			type: 'POST',
			url: '/loanpre/product/addOfflineProduct',
			data:postData
		}).then((data)=>{
            preDraftStore.setForm({
                id:data
            });            
            //微信分享设置
			$.setItem('wx_share',{
				id:data,
				path:'/pre/draft_detail',
				amt:postData.borrowAmount/100,
				rate:postData.interestRate,
				purpose:postData.purpose,
                param: {
                    loanType: 4,
                    loanTypeStr: '借条草稿',
                    creatorType: '出借人',
                    rate: postData.interestRate,
                    creatorName: postData.lenderName,
                    repayDate: postData.borrowDays+'天',
                    repayType: '还本付息',
                }
			});
			this.props.history.push({
				pathname: '/user/share'
			});	
		}).catch((msg)=>{
			Modal.infoX(msg);
		}).finally(()=>{
            Loading.hide();
        })  
    }
    
    //底部按钮点击认证
    onValid=()=>{
        const { preDraftStore:{form} } = this.props;
        if(!form.use){
            Modal.tip('请选择借款用途');
            return;
        }

        if(!form.checked){
            Modal.tip('请同意借款协议');
            return;
        }
    }

    //不在提示
    onNoAgain=(e)=>{
        this.props.userStore.setUserLocal({
            iouFormNoAgain:e.target.checked?1:0
        });
    }

	render() {
        const { getFieldProps,getFieldError } = this.props.form;
        const { userStore,preDraftStore:{form} } = this.props;
		return (
            <div className="view-iou-form">
                <List className='content'>
                    <Flex justify='start' className='list-title'>
                        <span className='title'>出借人</span>
                    </Flex>

                    <Flex justify='center' className="mart8">
                        <span>
                            <List.Item className="border_bott">
                                <InputComt
                                    type="text"
                                    className="login_input"
                                    editable={false}
                                    value={userStore.userInfo.userName}
                                    >
                                </InputComt>
                            </List.Item>
                        </span>
                    </Flex>

                    <Flex justify='start' className='list-title'>
                        <span className='title'>借款金额</span>
                        <span className="text">您当前可借款额度{this.props.userStore.borrowAmt}元</span>
                    </Flex>

                    <Flex justify='center' className="mart20">
                        <span>
                            <List.Item>
                                <InputMoney
                                    type="digit" 
                                    className="login_input num-font"
                                    max={userStore.borrowAmt}
                                    errorText={getFieldError('amount')}
                                    {...getFieldProps('amount', {
                                        initialValue:form.amount,
                                        onChange:this.amtChange,
                                        rules: [
                                            { required: true, message: '请输入借款金额' }
                                        ]
                                    })}>                         
                                </InputMoney>
                            </List.Item>
                        </span>
                    </Flex>

                    <Flex justify='start' className='list-title'>
                        <span className='title'>借款日期</span>
                    </Flex>

                    <Flex justify='center' className="mart8">
                        <span>
                            <List.Item className="border_bott">
                                <InputComt
                                    type="text"
                                    className="login_input"
                                    editable={false}
                                    value="借款人确认日期">
                                </InputComt>
                            </List.Item>
                        </span>
                    </Flex>

                    <Flex justify='start' className='list-title'>
                        <span className='title'>借款时长</span>
                    </Flex>

                    <Flex justify='center' className="mart8">
                        <span>
                            <List.Item className="border_bott">
                                <InputComt
                                    type="number"
                                    className="login_input"
                                    placeholder="3-365天"
                                    errorText={getFieldError('borrowDays')}
                                    {...getFieldProps('borrowDays', {
                                        initialValue:form.borrowDays,
                                        onChange:this.onDaysChange,
                                        rules: [
                                            { required: true, message: '请输入借款时长' }
                                        ]
                                    })}>       
                                </InputComt>
                            </List.Item>
                        </span>
                    </Flex>

                    <Flex justify='start' className='list-title'>
                        <span className='title'>年化利率</span>
                    </Flex>
                    <Flex justify='center'>
                        <span className='date-picker line'>
                            <Picker
                                data={c_rate}
                                cols={1}
                                title="年化利率"
                                value={[form.rate]}
                                onOk={(v)=>{this.pickerChange(v,'guarantorRate')}}>
                                <List.Item>
                                    {form.rate==null?<span className='rate'>0~24之间%</span>
                                    :<span className='interest'>
                                        <span className='text1'>{form.rate}</span>
                                        <span className='bf'>%</span>
                                        <span className='yuan'> 利息:{$.to2(form.interest)}元</span></span>}
                                </List.Item>
                            </Picker>
                        </span>
                    </Flex>

                    <Flex justify='center' className="rate-div active">
                        <span>本金{$.to2(form.amount).toFixed(2)}+利息{$.to2(form.interest).toFixed(2)}=到期本息{$.to2(form.totalAmt).toFixed(2)}</span>
                    </Flex>

                    <Flex justify='start' className='list-title'>
                        <span className='title'>借款用途</span>
                    </Flex>

                    <Flex justify='start'>
                        <div className='use-content'>
                        {$.purpose().map((item)=>{
                            return <Tap onTap={()=>{this.onTabUse(item)}} key={Math.random()}>
                                    <span className={form.use && form.use.value==item.value?'use-item selected':'use-item'}>
                                        <span>{item.label}</span>
                                    </span>
                                </Tap>
                        })}
                        </div>
                    </Flex>

                    <Side>
                        <p>提示</p>
                        <p>确认后，将生成一个二维码。</p>
						<p>将二维码分享给借款人，由借款人确认借条并支付借条手续费，自动生成借条。</p>
						<p>借条草稿生成的借条为极速借条。</p>
						<p>借款人无法修改借条内容。</p>   
                    </Side>

                    <Flex justify='center' className="mart15 mab8">
                        <Checkbox.AgreeItem checked={form.checked}  onChange={this.onAgreementChange}>
                            已阅读并同意
                            <Link className="mainC1" to='/agree/iou'>《今借到借款协议》</Link>
                        </Checkbox.AgreeItem>
                    </Flex>
                </List>
                <div className='common-btn_box'>
                    <Button onBtn={this.onBtn}
                        onValid={this.onValid}
                        editable={form.use && form.checked}
                        form={this.props.form}
                        fields={['borrowDays']}
                    >确定</Button>
                </div>
            </div>
		);
	}
}

export default createForm()(Page)
