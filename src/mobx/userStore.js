'use strict'
import { action,observable } from 'mobx'
import { Loading,Modal,util } from 'SERVICE'

class User{
    // 用户信息
    @observable userInfo = null;

    // 用户本地(localStorage)信息
    @observable userLocal = null;

    // 用户认证信息
    @observable creditInfo = null;

    // 存储登录表单信息
    @observable loginForm = {
        telephone:'',
        pass:'',
        captchaShow:false,
        tokenCode:'',
        checked:false
    };

    // 用户可借额度
    @observable borrowAmt = 200000;

    // 用户是否关注今借到
    @observable atten = false;

    //存储分享信息
    @observable shareInfo = null;

    // 密码弹框
    @observable box = {
        //密码弹框
        pwd:false,
        onPwdEnd:null,
        onPwdFail:null,
        //验证码弹框
        code:false,
        onCodeEnd:null,
        onCodeFail:null,
        //支付弹框
        pay:false,
        money:0,
        onLine:true,
        edit:false,
        poundage:true,
        onPayEnd:null,
        onPayFail:null
    };

    constructor() {
        this.userInfo = util.getItem('userStore') || {};
        this.userLocal = util.getLocal('userLocal') || {};
        this.creditInfo = util.getItem('creditStore') || {};
        this.shareInfo = util.getItem('shareStore') || {};
    }

    @action setLoginForm=(ob)=>{
        this.loginForm = Object.assign(this.loginForm,ob);
    }

    @action setUserAtten=(ob)=>{
        this.atten = ob;
    }

    @action checkUserAtten=()=>{
        let rtv = true;
        if($.isWeiXin && !this.userInfo.subscribe){
            this.atten = true;
            rtv = false;
        }
        return rtv;
    }

    @action setUserInfo=(ob,callBack)=>{
        if(this.userInfo){
            this.userInfo = Object.assign(this.userInfo,ob);
        }else{
            this.userInfo = ob;
        }
        $.setItem('userStore',this.userInfo);
        callBack && callBack();
    }
    
    @action setCreditInfo=(ob)=>{
        if(this.creditInfo){
            this.creditInfo = Object.assign(this.creditInfo,ob);
        }else{
            this.creditInfo = ob;
        }
        $.setItem('creditStore',this.creditInfo);
    }

    @action setUserLocal=(ob)=>{
        if(this.userLocal){
            this.userLocal = Object.assign(this.userLocal,ob);
        }else{
            this.userLocal = ob;
        }
        util.setLocal('userLocal',this.userLocal);
    }

    //获取用户信息
    @action getUserInfo=(callBack)=>{
        //Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/user/info/getUserInfo',
            data: {}}).then((data)=>{
                Loading.hide();
                this.userInfo = data;
                $.setItem('userStore',data);
                callBack && callBack();
            }).catch((msg)=>{
                Loading.hide();
                Modal.tip(msg);
            })
    }

    //获取用户信用认证信息
    @action getUserCreditInfo=(callBack)=>{
        //Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/user/my/checkCredit',
            data: {
                userId:this.userInfo.userId
            }}).then((data)=>{
                Loading.hide();
                this.creditInfo = data;
                $.setItem('creditStore',data);
                callBack && callBack();
            }).catch((msg)=>{
                Loading.hide();
                Modal.tip(msg);
            })
    }

    //获取用户可借额度
    @action getUserBorrowAmt=(callBack)=>{
        //Loading.show();
        $.ajaxE({
			type: 'GET',
			url: '/loanpre/userShowInfo/getBorrowAmount',
			data: {}
		}).then((data)=>{
            Loading.hide();
            this.borrowAmt = data/100;
            callBack && callBack();
		}).catch((msg)=>{
            Loading.hide();
			Modal.tip(msg);
		})
    }    

    @action setBox=(ob,callBack)=>{
        if(!ob.pwd){
            ob.onPwdEnd = null;
            ob.onPwdFail = null;
        }
        if(!ob.code){
            ob.onCodeEnd = null;
            ob.onCodeFail = null;
        }
        if(!ob.pay){
            ob.money = 0;
            ob.onLine = true;
            ob.edit = false;
            ob.poundage = false;
            ob.onPayEnd = null;
            ob.onPayFail = null;
        }
        this.box = Object.assign(this.box,ob);
        callBack && callBack();
    }

    @action setShareInfo=(ob,callBack)=>{
        if(this.shareInfo){
            this.shareInfo = Object.assign(this.shareInfo,ob);
        }else{
            this.shareInfo = ob;
        }
        $.setItem('shareStore',this.shareInfo);
        callBack && callBack();
    }

    //检查用户认证状态
    checkUserExist=(cal1,cal2)=>{
        let rtv = true;
        if(!this.userInfo.userId){
            Modal.alertX('提示','您还没有今借到的账号，请先去注册!',
                [{ text: '去注册', onPress: ()=>{
                    cal1 && cal1();
                }, style: 'default' }]
            );
            rtv = false;
        }
        return rtv;
    }

    //检查用户认证状态
    checkUserCredit=(type,cal1,cal2)=>{
        let rtv = true;
        if(type){
            //去出借
            if(this.creditInfo.lenderCreditStatus != 1){
                Modal.alertX('提示', '请完善您的信用报告', [
                    { text: '取消', onPress: () => {} },
                    { text: '去认证', onPress: () => {cal1 && cal1()} },
                ])
                rtv = false;
            }
        }else{
            //求借款
            if(this.creditInfo.creditStatus != 1){
                Modal.alertX('提示', '请完善您的信用报告', [
                    { text: '取消', onPress: () => {} },
                    { text: '去认证', onPress: () => {cal1 && cal1()} },
                ])
                rtv = false;
            }
        }
        return rtv;
    }

    //检查用户认证状态
    checkUserMobileCredit=(cal1,cal2)=>{
        let rtv = true;
        if(this.creditInfo.mobileCreditStatus == 2){
            Modal.alertX('提示', '运营商认证中，请耐心等待...', [
                { text: '我知道了', onPress: () => {} },
            ])
        }else if(this.creditInfo.mobileCreditStatus == 4){
            Modal.alertX('提示', '运营商认证失败，请重新认证', [
                {
                    text: '取消', onPress: () => {}
                },
                { text: '去认证', onPress: () => {
                    cal1 && cal1();
                }},
            ])
        }
        return rtv;
    }

    //检查用户学信状态
    checkUserXueXin=(cal1,cal2)=>{
        let rtv = true;
        if(this.creditInfo.lt_23 != 0){
            if(this.creditInfo.xuexinInfo){
                //是否是在校学生
                if(this.creditInfo.studentStatus){
                    Modal.alertX('提示', '在校学生不能操作', [
                        { text: '知道了', onPress: () => {cal1 && cal1()} },
                    ])
                    rtv = false;
                }				
            }else{
                Modal.alertX('提示', '您还没有进行学信认证', [
                    { text: '去认证', onPress: () => {
                        cal1 && cal1()
                    }},
                ])
                rtv = false;
            }
        }
        return rtv;
    }

    //检查用户举报、拉黑状态
    checkUserReport=(cal1,cal2)=>{
        let rtv = true;
        //举报
        if(this.userInfo.banStatus){
            Modal.alertX('提示', '由于您违规操作，现已被平台拉黑，借条相关功能已限制使用。请您先为被举报的借条反馈证据。如有疑问，请及时联系客服。', [
                { text: '知道了', onPress: () => {cal1 && cal1()} },
            ]);
            rtv = false;
            return rtv;
        }
    
        //冻结
        if(this.userInfo.frozenStatus){
            Modal.alertX('提示', '由于您违规操作，现已被平台冻结。暂不可通过任何方式完成出借。请您先为被举报的借条反馈证据。如有疑问，请及时联系客服。', [
                { text: '知道了', onPress: () => {cal1 && cal1()} },
            ]);
            rtv = false;
            return rtv;
        }
        return rtv;
    }

    //检查用户实名认证
    checkUserCardId=(cal1,cal2)=>{
        let rtv = true;
        if(!this.creditInfo.idCardStatus){  //判断实名认证
            Modal.alertX('提示', '您还没有实名认证，请先去实名!', [
                { text: '取消', onPress: () => {} },
                { text: '去实名', onPress: () => {
                    cal1 && cal1();
                }},
            ])
            rtv = false;
        }
        return rtv;
    }

    //检查用户实名认证
    checkUserFaceId=(cal1,cal2)=>{
        let rtv = true;
        if(!this.creditInfo.idCardStatus){  //判断实名认证
            Modal.alertX('提示', '您还没有在今借到实名，请先进行人脸识!', [
                { text: '取消', onPress: () => {} },
                { text: '去实名', onPress: () => {
                    cal1 && cal1();
                }},
            ])
            rtv = false;
        }
        return rtv;
    }

    //检查用户交易密码
    checkUserPwd=(cal1,cal2)=>{
        let rtv = true;
        if(!this.creditInfo.passwordStatus){  //判断交易密码
            Modal.alertX('提示', '您还没有设置交易密码，请先去设置!', [
                { text: '取消', onPress: () => {} },
                { text: '去设置', onPress: () => {
                    cal1 && cal1();
                }},
            ])
            rtv = false;
        }
        return rtv;
    }

    //移除全局部分缓存
    removeStorage=()=>{
        const arr = ['preBorrowFormStore','preBorrowTaFormStore','preBorrowDetailStore',
        'preBorrowDbFormStore','preIouFormStore',
        'preIouDetailStore','preLoanFormStore','preLoanDetailStore',
        'preProductFormStore','preProductDetailStore','preProductDetailOtherStore',
        'shareStore'];
        arr.forEach((i)=>{
            sessionStorage.removeItem(i);
        });
    }

    //微信支付
    wxPay=(payJson,callBack)=>{
        let payInvoke = function(){
            WeixinJSBridge.invoke('getBrandWCPayRequest',
                {
                    "timeStamp": payJson['timeStamp'],
                    "package": payJson['package'],
                    "paySign": payJson['paySign'],
                    "appId": payJson['appId'],
                    "signType": payJson['signType'],
                    "nonceStr": payJson['nonceStr'],
                },
                function(res){
                    if(res.err_msg == "get_brand_wcpay_request:ok") {
                        callBack && callBack();
                    }else{
                        alert('支付失败！');
                    }
                }
            );
        }       

        if (typeof WeixinJSBridge == "undefined"){
            if( document.addEventListener ){
                document.addEventListener('WeixinJSBridgeReady', payInvoke, false);
            }else if (document.attachEvent){
                document.attachEvent('WeixinJSBridgeReady', payInvoke); 
                document.attachEvent('onWeixinJSBridgeReady', payInvoke);
            }
        }else{
            payInvoke();
        }
    }    
}

export default new User()