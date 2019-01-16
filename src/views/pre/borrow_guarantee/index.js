//首页 => 作担保
import '../form.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Flex, List, Checkbox } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Loading, Modal, util } from 'SERVICE'
import { Tap, InputMoney, Button,Side } from 'COMPONENT'

@withRouter
@inject('userStore','preBorrowStore')
@observer
class Page extends Component {
	constructor (props, context) {
		document.title = "作担保";
		super(props, context)
		this.state = {
            isSideS:false,
        };
	}
	componentDidMount(){

    }

    amtChange=(v)=>{
        v = parseInt(v);
        const { preBorrowStore,preBorrowStore:{detail,formDb} } = this.props;
        if(v){
            preBorrowStore.setFormDb({
                amount:v,
                interest:$.to2(v*detail.guaranteeRate/100),
            })
        }else{
            preBorrowStore.setFormDb({
                amount:0,
                interest:0,
            })
        }
    }

    onBtn=(ob)=>{
        let _this = this;
		let { userStore,preBorrowStore:{formDb} } = this.props;
        //检查用户举报状态
        if(userStore.checkUserReport()){
            Loading.show();
            //更新用户认证信息
            userStore.getUserCreditInfo(()=>{
                Loading.hide();
                //检查运营商认证
                if(userStore.checkUserMobileCredit(0)){
                    //检查学信认证
                    if(userStore.checkUserXueXin()){
                        userStore.setBox({
                            pwd:true,
                            onPwdEnd:_this.onPwdConfirm
                        });
                    }
                }
            });
        }        
    }

    //密码确认
    onPwdConfirm=(pwd)=>{
        let { userStore,preBorrowStore:{detail,formDb} } = this.props;
        userStore.setBox({
            pwd:false
        });
        Loading.show();
        $.ajaxE({
			type: 'POST',
			url: '/loanpre/bid/addGuarantee',
			data:{
                payPassword:pwd,	// 支付密码
                bidId:detail.id, //筹款id
                amount:$.toFen(formDb.amount), //担保金额
                friendList:[] //好友列表
			}
		}).then((data)=>{
            Modal.infoX ('担保成功!',()=>{
                this.props.history.push({
                    pathname: '/'
                });
            });
		}).catch((msg)=>{
            Modal.infoX(msg);
		}).finally(()=>{
            Loading.hide();
        })       
    }

    //底部按钮点击认证
    onValid=()=>{
        const { preBorrowStore:{formDb} } = this.props;

        if(!formDb.checked){
            Modal.tip('请同意借款协议');
            return;
        }
    }

    //是否统一借款协议
	onAgreementChange=(v)=>{
		this.props.preBorrowStore.setFormDb({
            checked:v.target.checked
        });
	}    

	render() {
        const { getFieldProps,getFieldError } = this.props.form;
        const { userStore,preBorrowStore:{detail,formDb} } = this.props;
		return (
            <div className="view-iou-form">
                <List className='content'>
                    <Flex justify="between" className='list-title borr-ta'>
                        <span className='title'>帮找出借人</span>
                        {formDb.loaner?<span className='fontC1 font14 rig'>{formDb.loaner.name}</span>
                        :<span className='fontC1 font14 rig'>没有可用出借人</span>}
                    </Flex>
                    <Flex justify='start' className='list-title padt10'>
                        <span className='title'>担保金额</span>
                    </Flex>
                    <Flex justify='center' className="mart20">
                        <span>
                            <List.Item>
                                <InputMoney
                                    type="digit" 
                                    className="login_input num-font"
                                    max={Math.round(detail.leftGuaranteeAmount/100)}
                                    errorText={getFieldError('amount')}
                                    {...getFieldProps('amount', {
                                        initialValue:formDb.amount,
                                        onChange:this.amtChange,
                                        rules: [
                                            { required: true, message: '请输入担保金额' }
                                        ]
                                    })}>                         
                                </InputMoney>
                            </List.Item>
                        </span>
                    </Flex>
                    

                    <div className="rate-div active">
                        <Flex justify="center">
                            <span className="font14 fontC3">预计收益：{formDb.interest}元</span>
                        </Flex>
                    </div>

                    <Side>
                        <p>提示</p>
                        <p>补借条，不能线上走账，不支持逾期催收，存在较大的风险，如果不是非常亲密的关系，不建议您使用此功能</p>
                        <p>如果您是现金交易请不要补借条，一旦发生争议，因为双方无法提供交易证据，平台会将借条置为有争议状态</p>
                        <p>补借条的待确认有效期为3天，到期自动关闭</p>
                        <p>补借条不支持线上出借，请确保你们已经线下交易完毕</p>
                    </Side>

                    <Flex justify='center' className="mart15 mab8">
                        <Checkbox.AgreeItem onChange={this.onAgreementChange}>
                            已阅读并同意
                            <span className="mainC1" onClick={(e) => { e.preventDefault(); alert('agree it'); }}>《今借到借款协议》</span>
                        </Checkbox.AgreeItem>
                    </Flex>
                </List>
                <div className='common-btn_box'>
                    <Button onBtn={this.onBtn}
                        onValid={this.onValid}
                        editable={formDb.checked}
                        form={this.props.form}
                        fields={['amount']}
                    >确定</Button>
                </div>
            </div>
		);
	}
}

export default createForm()(Page)
