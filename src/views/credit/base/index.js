
//信用报告
import '../credit.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { Picker, List, InputItem, Flex,Checkbox } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Loading, Modal, rules,util } from 'SERVICE'
import { inject, observer } from 'mobx-react'
import { Tap,InputComt,NetValid,Button } from 'COMPONENT'

    const cityData3 = require('SERVICE/city_data.js');
    // 紧急联系人类型1
    let contact_type_1=[{
        label: "配偶",
        value: "配偶"
    }, {
        label: "父母",
        value: "父母"
    }, {
        label: "兄弟姐妹",
        value: "兄弟姐妹"
    }, {
        label: "子女",
        value: "子女"
    }];
    // 紧急联系人类型2
    let contact_type_2 = [{
        label: "父母",
        value: "父母",
    }, {
        label: "兄弟姐妹",
        value: "兄弟姐妹"
    }, {
        label: "子女",
        value: "子女"
    }, {
        label: "同事",
        value: "同事"
    }, {
        label: "同学",
        value: "同学"
    }, {
        label: "朋友",
        value: "朋友"
    }];

@withRouter
@inject('creditStore','userStore')
@observer
class Page extends Component {
    constructor(props, context) {
        document.title = "基础信息";
        super(props, context)
        let query = util.getUrlParams(this.props.location.search);
        this.state = {
            pick1:false, // 控制选择框颜色
            pick2:false, // 控制选择框颜色
            pick3:false, // 控制选择框颜色

            //详细地址
            home_addr: '',
            typeOp:query.typeOp,
            //微信号
            wechat_id: '',
            // 地区参数
            level_1_code:'',
            level_1_name:'',
            level_2_code:'',
            level_2_name:'',
            level_3_code:'',
            level_3_name:'',
            // 紧急联系人类型1
            contact_type_1,
            // 紧急联系人类型2
            contact_type_2,
            contact_type1:'',
            contact_type2:'',
            contact_name1:'',
            contact_name2:'',
            contact_tel1:'',
            contact_tel2:'',
            agreement:false,
            telephone:'17600139282',
            homeRegistAddr:'',
        }
    }

    //页面初始函数
    componentDidMount() {
        // this.checkCredit();
        this.getBaseUserInfo();
        this.getBaseInfo();
        
    }
    // 调用 校验用户信用接口，获取数据
    checkCredit=()=>{
        $.ajaxE( {
            type: 'GET',
            url: '/user/my/checkCredit',
        }).then((data) => {
            if(data.passwordStatus){
                return;
            }else{
                Modal.infoX('请先去设置交易密码!',()=>{
                    this.props.history.push({
                        pathname: '/user/input_valid2',
                        query: {
                            pathType: 3,
                        }
                    });
                });
            }
        }).catch((msg) => {
            console.log(msg);
        });      
    }
    //获取页面初始化数据
    getBaseUserInfo = () => {
        const { userStore, creditStore } = this.props;
        $.ajaxE({
            type: 'GET',
            url: '/credit/accredit/getBaseInfo',
            data:{
                uid: userStore.userInfo.userId
            }
        }).then((data)=>{
            //保存用户数据
            this.setState({
                telephone:data.telephone,
                homeRegistAddr:data.homeRegistAddr
            })
        }).catch((msg)=>{
            console.log(msg);
        })
    }

    //获取页面初始化数据
    getBaseInfo = () => {
        $.ajaxE({
            type: 'GET',
            url: '/credit/accredit/getInfo',
            data:{
                content_type:"baseinfo",
            }
        }).then((data)=>{
            //保存用户数据
            if(data.baseInfo){
                if(data.urgent_contact_list[0].contact_type){
                    this.setState({
                        pick2:true
                    })
                }
                if(data.urgent_contact_list[1].contact_type){
                    this.setState({
                        pick3:true
                    })
                }
                if(data.baseInfo.level_1_code){
                    this.setState({
                        pick1:true
                    })
                }
                this.setState({
                    home_addr: data.baseInfo.home_addr,
                    wechat_id: data.baseInfo.wechat_id, 
                    email: data.baseInfo.email,
                    contact_type1:data.urgent_contact_list[0].contact_type,
                    contact_type2:data.urgent_contact_list[1].contact_type,
                    contact_name1:data.urgent_contact_list[0].contact_name,
                    contact_name2:data.urgent_contact_list[1].contact_name,
                    contact_tel1:data.urgent_contact_list[0].contact_tel,
                    contact_tel2:data.urgent_contact_list[1].contact_tel,
                    level_1_code: data.baseInfo.level_1_code,
                    level_1_name: data.baseInfo.level_1_name,
                    level_2_code: data.baseInfo.level_2_code,
                    level_2_name: data.baseInfo.level_2_name,
                    level_3_code: data.baseInfo.level_3_code,
                    level_3_name: data.baseInfo.level_3_name
                })
            }
            
        }).catch((msg)=>{
            console.log(msg);
        })
    }

    // 提交事件
    submit = () => {
        
        let { level_1_name, level_2_name, level_3_name, contact_type2,contact_type1,level_1_code, level_2_code,level_3_code } = this.state;
        this.props.form.validateFields((error, values) => {
            if (!error) {
                if(values.contact_tel1 == values.contact_tel2){
                    Modal.infoX('联系人电话不能重复!');
                    return;
                }
                Loading.show();
                $.ajaxE({
                    type: 'POST',
                    url: '/credit/accredit/saveInfo',
                    data: {
                        content_type:'baseinfo',
                        baseInfo:{
                            home_addr: values.home_addr,
                            wechat_id: values.wechat_id,
                            email: values.email,
                            level_1_code: values.cityData[0],
                            level_1_name: level_1_name,
                            level_2_code: values.cityData[1],
                            level_2_name: level_2_name,
                            level_3_code: values.cityData[2],
                            level_3_name: level_3_name
                        },
                        urgent_contact_list:[{
                            contact_tel: values.contact_tel1,
                            contact_name: values.contact_name1,
                            contact_type: contact_type1
                        }, {
                            contact_tel: values.contact_tel2,
                            contact_name: values.contact_name2,
                            contact_type: contact_type2
                        }]
                        
                    }
                }).then((data) => {
                    let typeOp=this.state.typeOp;
                    if(typeOp){
                        if(typeOp==1){
                            this.props.history.push({
                                pathname: '/credit'
                            });
                        }else{
                            this.props.history.push({
                                pathname: '/credit/operator_first'
                            })
                        }
                    }
                    
                }).catch((msg) => {
                    Modal.infoX(msg);
                }).finally(()=>{
                    Loading.hide();
                })
            }
        });
    }

    // 选择城市方法
    pickercity = (v) => {
        this.setState({
            pick1:true
        })
        // 获取全部数据
        let ww = cityData3;
        let hs = [];
        // 遍历循环获取label值
        for (let i = 0; i < ww.length; i++) {
            if (ww[i].value == v[0]) {
                hs[0] = ww[i].label;
                let child1 = ww[i].children;
                for (let j = 0; j < child1.length; j++) {
                    if (child1[j].value == v[1]) {
                        hs[1] = child1[j].label;
                        let child2 = child1[j].children;
                        for (let k = 0; k < child2.length; k++) {
                            if (child2[k].value == v[2]) {
                                hs[2] = child2[k].label;
                            }
                        }
                    }
                }
            }
        }
        // 将修改的值放到state
        this.setState({
            level_1_code: v[0],
            level_1_name: hs[0],
            level_2_code: v[1],
            level_2_name: hs[1],
            level_3_code: v[2],
            level_3_name: hs[2]
        })
    }
    //今借到展期协议选中状态改变事件
    onAgreementChange = (v) => {
        this.setState({
            agreement: v.target.checked
        })
    }

    render() {
        const { userStore, creditStore } = this.props;
        const { getFieldProps, getFieldError } = this.props.form;
        let btnEditable = true;
		if(!this.state.pick1||!this.state.pick2||!this.state.pick3){
			btnEditable = false;
        }
        return (
            <div className='view-credit-all'>
                <div style={{height: '100%',overflow:'auto',paddingBottom: '0.2rem'}}>
                    <Flex justify="center" className="step_bar">
                        <img src={'/imgs/credit/sel-base.svg'} />
                    </Flex>

                    <Flex className="pad">
                        <span className="form-line"></span>
                        <span className="form-font">本人信息</span>
                    </Flex>

                    <List className="form-list">
                        <List.Item extra={this.state.telephone} className="col6">手机号</List.Item>
                        <List.Item extra={this.state.homeRegistAddr}>户籍地址</List.Item>
                        <InputComt
                            type="text"
                            className="login_input"
                            placeholder="请输入微信号"
                            errorText={getFieldError('wechat_id')}
                            clear
                            {...getFieldProps('wechat_id', {
                                initialValue: this.state.wechat_id,
                                ref: el => this.wechatInput = el,
                                rules: [
                                    { required: true, message: '请填写微信号' },
                                ]
                            })}> 
                           微信号   
                        </InputComt>
                        <InputItem
                            type="text"
                            {...getFieldProps('email', {
                                initialValue: this.state.email,
                                rules: [{ required: true, message: '请填写邮箱' },
                                    {
                                        pattern:  /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g, message: '邮箱格式不正确!',
                                    }
                                ],
                            })}
                            clear
                            placeholder="请输入邮箱"
                        >电子邮箱</InputItem>
                        <div className='common-jc-error'>{getFieldError('email') && getFieldError('email').join(',')}</div>
                        <div className={this.state.pick1?"picker-extra":""}>
                            <Picker
                                data={cityData3}
                                cols={3}
                                title="现居住地区"
                                extra="请选择"
                                {...getFieldProps('cityData', {
                                    initialValue: [this.state.level_1_code,this.state.level_2_code,this.state.level_3_code],
                                    rules: [{ required: true, message: '请选择地区' }],
                                })}
                                onOk={(v)=>{this.pickercity(v)}}>
                                <List.Item arrow="horizontal">现居住地区</List.Item>
                            </Picker>
                        </div>
                        <div className='common-jc-error'>{getFieldError('cityData') && getFieldError('cityData').join(',')}</div>
                        
                        <InputComt
                            type="text"
                            className="login_input"
                            placeholder="请输入详细地址"
                            errorText={getFieldError('home_addr')}
                            clear
                            {...getFieldProps('home_addr', {
                                initialValue: this.state.home_addr,
                                ref: el => this.addInput = el,
                                rules: [
                                    { required: true, message: '请输入详细地址' },
                                ]
                            })}> 
                           详细地址   
                        </InputComt>
                    </List>

                    <Flex className="pad">
                        <span className="form-line"></span>
                        <span className="form-font">紧急联系人1</span>
                    </Flex>
                    <List className="form-list">
                        <div className={this.state.pick2?"picker-extra":""}>
                            <Picker
                                className="picker-extra"
                                data={this.state.contact_type_1}
                                cols={1}
                                title="TA是我的"
                                extra="请选择"
                                {...getFieldProps('contact_type1', {
                                    initialValue: this.state.contact_type1,
                                    rules: [{ required: true, message: '请选择' }],
                                })}
                                value={[this.state.contact_type1]}
                                onOk={(v) => { this.setState({contact_type1: v[0],pick2:true }) }} >
                                <List.Item arrow="horizontal">TA是我的</List.Item>
                            </Picker>
                        </div>
                        <div className='common-jc-error'>{getFieldError('contact_type1') && getFieldError('contact_type1').join(',')}</div>
                        <InputComt
                            type="text"
                            className="login_input"
                            placeholder="请输入联系人姓名"
                            errorText={getFieldError('contact_name1')}
                            clear
                            {...getFieldProps('contact_name1', {
                                initialValue: this.state.contact_name1,
                                ref: el => this.connameInput = el,
                                rules: [
                                    { required: true, message: '请输入联系人姓名' },
                                ]
                            })}> 
                           联系人姓名   
                        </InputComt>
                        <InputComt
                            type="digit" 
                            className="login_input"
                            placeholder="请输入手机号"
                            errorText={getFieldError('contact_tel1')}
                            {...getFieldProps('contact_tel1', {
                                ref: el => this.mobileInput = el,
                                initialValue: this.state.contact_tel1,
                                rules: [
                                    { required: true, message: '请输入11位手机号码' },
                                    rules.tel
                                ]
                            })}>联系人电话      
                        </InputComt>
                    </List>

                    <Flex className="pad">
                        <span className="form-line"></span>
                        <span className="form-font">紧急联系人2</span>
                    </Flex>
                    <List className="form-list">
                        <div className={this.state.pick3?"picker-extra":""}>
                            <Picker
                                data={this.state.contact_type_2}
                                cols={1}
                                title="TA是我的"
                                extra="请选择"
                                {...getFieldProps('contact_type2', {
                                    initialValue: this.state.contact_type2,
                                    rules: [{ required: true, message: '请选择' }],
                                })}
                                value={[this.state.contact_type2]}
                                onOk={(v) => { this.setState({ contact_type2: v[0] ,pick3:true}) }}  >
                                <List.Item arrow="horizontal">TA是我的</List.Item>
                            </Picker>
                        </div>
                        <div className='common-jc-error'>{getFieldError('contact_type2') && getFieldError('contact_type2').join(',')}</div>

                        <InputComt
                            type="text"
                            className="login_input"
                            placeholder="请输入联系人姓名"
                            errorText={getFieldError('contact_name2')}
                            clear
                            {...getFieldProps('contact_name2', {
                                initialValue: this.state.contact_name2,
                                ref: el => this.connameInput = el,
                                rules: [
                                    { required: true, message: '请输入联系人姓名' },
                                ]
                            })}> 
                           联系人姓名   
                        </InputComt>
                        <InputComt
                            type="digit" 
                            className="login_input"
                            placeholder="请输入手机号"
                            errorText={getFieldError('contact_tel2')}
                            {...getFieldProps('contact_tel2', {
                                ref: el => this.mobileInput = el,
                                initialValue: this.state.contact_tel2,
                                rules: [
                                    { required: true, message: '请输入11位手机号码' },
                                    rules.tel
                                ]
                            })}>联系人电话      
                        </InputComt>
                    </List>
                    <Flex justify='center' className="mart15 mab8">
                        <Checkbox.AgreeItem checked={this.state.agreement} onChange={(v) => this.onAgreementChange(v)}>
                            已阅读并同意
                            <span className="mainC1" onClick={(e) => { e.preventDefault(); alert('agree it'); }}>《送达地址确认书》</span>
                        </Checkbox.AgreeItem>
                    </Flex>
                </div>
                
                {/* <AgreeItem onChange={this.onAgreementChange} checked={this.state.agreement==true?true:false}>
                        已阅读并同意 <Tap onTap={this.onAgreement}>
                                    <a>《送达地址确认书》</a>
                                </Tap>
                        </AgreeItem> */}

                {/* <div className='common-btn_box'>
                    <Tap className='c-black span font16 active' onTap={this.submit}>下一步</Tap>
                </div> */}

                <Button onBtn={this.submit} 
                    form={this.props.form} 
                    editable={this.state.agreement}
                    fields={['wechat_id']}
                >下一步</Button>

            </div>
        )
    }
}

export default createForm()(Page);
