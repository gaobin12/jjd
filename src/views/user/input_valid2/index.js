
import './style.less'
import React, {Component, PropTypes} from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Toast } from 'antd-mobile'
import { Tap } from 'COMPONENT'
import { Loading, Modal } from 'SERVICE'

@withRouter
@inject('userStore')
@observer
export default class InputValid extends Component {
   
    static defaultProps = {
		length: 6,
        type: 'password',
        visible: false,
    }

    constructor(props) {
        document.title='请输入交易密码'
        super(props);
        //debugger;
        let query = this.props.location.query;
        this.state = {
            values: '', //存储值
            values2: '',//确认密码
            mobileCode:'',//验证码
            pathType:query.pathType||"",  //类型，根据类型设置跳转地址 1.绑卡2.极速借条3.设置
            payCredit:query.payCredit||"", //绑卡跳转传值 0：9.9元 1:118元 "":绑卡
        };
    }

    componentDidMount() {   
        
    }
    
    onSetVal = (value)=>{
        let {values,values2} = this.state;
        let { length } = this.props;
        values += value;
        //存储值
        this.setState({
            values
        })
        if(values.length==length){
            //输入完成        
            setTimeout(()=>{
                if(values2==''){
                    //存储第一次输入的密码
                    this.setState({
                        values: '', //存储值
                        values2: values,//确认密码
                    });
                }else if(values2!=values){
                    //两次输入不一致
                    //清空            
                    this.setState({
                        values: '', //存储值
                        values2: '',//确认密码
                    })
                    Toast.info('两次输入密码不一致！',2)
                }else if(values2==values){
                    if(this.props.location.query.pathname == '/setting/phone_code'){
                        this.change_PayPwd($.md5($.md5(values)),this.props.location.query.mobileCode)
                    }else if(this.props.location.query.pathname == '/setting/change_phone'){
                        this.onSetPayPwd($.md5($.md5(values)));
                    }else if(this.props.location.query.pathType){
                        this.onSetPayPwd($.md5($.md5(values)));
                    }else if(this.props.location.query.mobileCode){
                        this.change_PayPwd($.md5($.md5(values)),this.props.location.query.mobileCode)
                    }                    
                }
            },200)
        }
    }
    
    onDeltVal=(type)=>{
        let {values} = this.state;
        if(values=='') return
        if(type=='all'){
            values = ''
        }else{
            values=values.substr(0,values.length-1)
        }
        this.setState({values})
    }
    //修改密码
    change_PayPwd=(v, mobileCode)=>{
            //修改密码
            $.ajaxE({
                type: 'POST',
                url: '/user/info/modifyPayPassword',
                data: {
                    mobileCode,
                    newPwd:v
                }
            }).then((data)=>{
                let pathname='';
                if(this.props.location.query.pathname == '/setting/phone_code'){
                    //返回设置页面
                    pathname = '/setting'
                }else{
                    pathname = this.props.location.query.pathname
                }
                Modal.infoX('交易密码修改成功！',()=>{
                    this.props.history.push({
                        pathname: pathname
                    });
                });
            }).catch((msg)=>{
                 Modal.infoX(msg);
         } )
        
    }


    //设置支付密码
    onSetPayPwd=(v)=>{
        let _this = this;
        //发送验证码
        $.ajaxE({
            type: 'POST',
            url: '/user/info/addPayPassword',
            data: {
                password:v
            },
        }).then((data)=>{
            _this.props.userStore.getUserCreditInfo();
            if(this.props.location.query.pathname){
                Modal.infoX('设置支付密码成功！',()=>{
                    _this.props.history.push({
                        pathname: this.props.location.query.pathname
                    });
                });
            }else{
                const { pathType } = this.state;
                if(pathType==0){
                    //绑卡
                    Modal.infoX('设置支付密码成功！',()=>{
                        _this.props.history.push({
                            pathname: '/card/bind_card',
                            query: {
                                payCredit: this.state.payCredit,
                            }
                        });
                    });
                }else if(pathType==1){
                    //极速借条
                    Modal.infoX('设置支付密码成功！',()=>{
                        _this.props.history.push({
                            pathname: '/fast/form'
                        });
                    });
                }else if(pathType==2){
                    //返回设置
                    Modal.infoX('设置支付密码成功！',()=>{
                        _this.props.history.push({
                            pathname: '/setting'
                        });
                    });          
                }else if(pathType==3){
                    //返回基础信息
                    Modal.infoX('设置支付密码成功！',()=>{
                        _this.props.history.push({
                            pathname: '/credit/base'
                        });
                    });          
                }else if(pathType==4){
                    //返回首页
                    Modal.infoX('设置支付密码成功！',()=>{
                        _this.props.history.push({
                            pathname: '/'
                        });
                    });          
                }else if(pathType==5){
                    //返回充值
                    Modal.infoX('设置支付密码成功！',()=>{
                        _this.props.history.push({
                            pathname: '/card/charge'
                        });
                    });          
                }
            }
            
        }).catch((msg,code)=>{
            Modal.infoX(msg);
        })
    }
    

    render() {
        let { values, values2 } = this.state,
        { className, length, type }= this.props,
        inputs = [];
        for(let i=0;i<length;i++){
            inputs.push(i)
        }
        return (
            <div className='view-input-valid2'>
                <div className='title'>
                    <p><span className={values2==''?'active':''}>1</span>设置密码</p>
                    <p><span className={values2==''?'':'active'}>2</span>确认密码</p>
                </div>
                <div className={className?className+' common-inputvalid':'common-inputvalid'}>
                    {inputs.map((ele,index)=>{
                        return <input readOnly ref={'input'+index} type={type&&values[index]?type:'number'} value={values[index]||''} 
                        key={'valid'+index} />
                    })}
                </div>
                <div className='input-board'>
                    <Tap onTap={()=>{this.onSetVal(1)}}>1</Tap>
                    <Tap onTap={()=>{this.onSetVal(2)}}>2</Tap>
                    <Tap onTap={()=>{this.onSetVal(3)}}>3</Tap>
                    <Tap onTap={()=>{this.onSetVal(4)}}>4</Tap>
                    <Tap onTap={()=>{this.onSetVal(5)}}>5</Tap>
                    <Tap onTap={()=>{this.onSetVal(6)}}>6</Tap>
                    <Tap onTap={()=>{this.onSetVal(7)}}>7</Tap>
                    <Tap onTap={()=>{this.onSetVal(8)}}>8</Tap>
                    <Tap onTap={()=>{this.onSetVal(9)}}>9</Tap>
                    <Tap onTap={()=>{this.onDeltVal('all')}}>
                        <img src={'/imgs/com/rev-num_del.png'} />
                    </Tap>
                    <Tap onTap={()=>{this.onSetVal(0)}}>0</Tap>
                    <Tap onTap={()=>{this.onDeltVal('one')}}>
                        <img src={'/imgs/com/rev-num_cha.png'} />
                    </Tap>
                </div>
            </div>
        );
    }
}
