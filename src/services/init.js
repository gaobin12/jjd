
import { Loading, Modal, config } from 'SERVICE'
export default ()=>{
    $.jjd = config;

    let jiewuApi = 'http://192.168.30.205:8921/leaseApi';
    // if (JSON.stringify(process.env.NODE_ENV) === 'development') {
    //     jiewuApi = 'http://192.168.30.205:8921/leaseApi'
    // }
    
    $.ajaxE = (ob) =>{
        if(ob.urlType=='jiewu'){
            //借物地址
            ob.url = jiewuApi + ob.url;
        }else{
            ob.url = $.jjd.apiUrl + ob.url;
        }

        if (ob.type == "GET") {
            // ob.data = Object.assign(ob.data, {
            //     token
            // });
        } else {
            ob.data = JSON.stringify(ob.data);
            ob.contentType = 'application/json';
            console.log(ob.data);
        }

        let promise = null;
        if(ob.flag){
            promise = new Promise((resolve, reject)=>{            
                ob.success = (res) =>{
                    if(res.status == 200){
                        resolve(res);
                    }else if(res.status == 9001){
                        if(!$.overtime){
                            $.overtime = 1;
                            Loading.hide();
                            Modal.infoX('登录超时，请重新登录',()=>{                                
                                sessionStorage.clear();
                                location.href = location.origin;
                            });
                        }     
                    }else if(res.code == 200){
                        //借物需要用code
                        resolve(res);
                    }else{
                        reject(res);
                    }
                }
                ob.error = (xhr, msg) =>{
                    console.log(msg);
                }
    
                $.ajax(ob);
            })        
        }else{
            promise = new Promise((resolve, reject)=>{            
                ob.success = (res) =>{
                    if(res.status == 200){
                        resolve(res.data);
                    }else if(res.status == 9001){
                        if(!$.overtime){
                            $.overtime = 1;
                            Loading.hide();
                            Modal.infoX('登录超时，请重新登录',()=>{                                
                                sessionStorage.clear();
                                location.href = location.origin;
                            });
                        }                        
                    }else if(res.code == 200){
                        //借物需要用code
                        resolve(res);
                    }else{
                        reject(res.msg);
                    }
                }
                ob.error = (xhr, msg) =>{
                    console.log(msg);
                }
    
                $.ajax(ob);
            })        
        }
        return promise;        
    }
    //获取用户信息
    $.getUserInfo = ()=>{
        let userInfo = sessionStorage.getItem('userInfo');
        return JSON.parse(userInfo);
    }
    $.initZhuge = function(){
        if(!$.isZhuge){
            $.isZhuge = true;
            let userInfo = $.getUserInfo();
            try{
                if(window.zhuge){
                    //初始化，第一次设置
                    window.zhuge.identify(userInfo.userId, {
                        name: userInfo.userName,
                        //预定义属性
                        tel: userInfo.telephoneM //⾃自定义属性 
                    },()=>{
                    });
                }
            }catch(e){
            }        
        }        
    }
    $.ajaxEE = (ob) =>{
        ob.url = $.jjd.apiUrl + ob.url;

        if (ob.type == "GET") {

        } else {
            ob.data = JSON.stringify(ob.data);
            ob.contentType = 'application/json';
            console.log(ob.data);
        }

        let promise = new Promise((resolve, reject)=>{            
            ob.success = (res) =>{
                if(res.status == 200){
                    resolve(res);
                }else{
                    reject(res);
                }
            }
            ob.error = (xhr, msg) =>{
                console.log(msg);
            }

            $.ajax(ob);
        })        
        return promise;        
    }
    
    //设置sessionStorage数据  $.setItem(key,{})
    $.setItem = (key,ob)=>{
        let data = sessionStorage.getItem(key);
        if(data == null || data == 'null'){
            data = {};
        }else{
            data = JSON.parse(data);
        }
        let obData = JSON.stringify(Object.assign(data,ob));
        sessionStorage.setItem(key,obData);
    }

    //获取sessionStorage数据
    $.getItem = (key,datakey)=> {
        let data = JSON.parse(sessionStorage.getItem(key));
        if(datakey){
            return data[datakey];
        }
        return data;
    }

    $.wxShare = ()=>{
        //如果不是微信环境返回$.isWeiXin
        if(!$.isWeiXin){
            return;
        }
        
        //获取分享缓存数据
        let ssData = $.getItem('wx_share')||{};
        if(ssData&&(ssData.purpose||ssData.purpose==0)){
            ssData.purpose = $.purpose(ssData.purpose);
        }
        let shareUrl ='';
        if(ssData && ssData.path){//不是首页分享
            shareUrl= location.origin+'/html/wx_share.html?appid='+sessionStorage.getItem('appId')+"&redirect_uri="+location.origin+"&id="+ssData.id+"&path="+ssData.path;
        }else{//首页分享
            shareUrl= location.origin+'/html/wx_share.html?appid='+sessionStorage.getItem('appId')+"&redirect_uri="+location.origin;
        }
        let shareMessage = {
            title: '今借到-国内成熟的网络借条管理平台',
            desc: '今借到是人人信公司推出的国内成熟的网络借条管理平台，采用借贷双方实名模式，借款人可以为平台内借款行为打网络借条，也可以在平台上直接向朋友发起借款',
            link: shareUrl,
            imgUrl: 'https://static.gushistory.com/shareLogo.png'
        };

        let shareTimeline = {
            title: '今借到-国内成熟的网络借条管理平台',
            link: shareUrl,
            imgUrl: 'https://static.gushistory.com/shareLogo.png'
        };

        let shareData = {};

        if(location.hash.indexOf('/pre/iou_detail') != -1){
            //分享借条
            shareData = {
                title: '我在今借到给你打了一张借条,快来确认吧',
                desc: '金额: '+ssData.amt+'元 利率: '+ssData.rate+'% 用途: '+ssData.purpose,
            };
        }

        if(location.hash.indexOf('/pre/loan_detail') != -1){
            //分享 去出借借条
            shareData = {
                title: '我在今借到放款,快来申请吧',
                desc: '金额: '+ssData.amt+'元 时长: '+ssData.time +' 利率: '+ssData.rate+'%',
            };
        }

        if(location.hash.indexOf('/pre/product_detail') != -1){
            //分享 去出借产品
        }

        if(location.hash.indexOf('/pre/borrow_detail') != -1){
            //分享 求借款
            shareData = {
                title: '我在今借到发起了一个求借款，快来帮我筹款吧~',
                desc: '金额: '+ssData.amt+'元 时长: '+ssData.time + '利率: '+ssData.rate+'% 用途: '+ssData.purpose,
            };
        }

        if(location.hash.indexOf('/pre/loan_mine') != -1){
            //分享 我的出借列表
            shareData = {
                title: '我在今借到放款,快来申请吧',
                desc: '金额: '+ssData.amt+'元 时长: '+ssData.time +' 利率: '+ssData.rate+'%',
            };

        }

        //二维码页面
        if(location.hash.indexOf('/user/share') != -1){
            //分享 我的出借列表
            if(ssData.path == '/pre/iou_detail'){
                //分享借条
                shareData = {
                    title: '我在今借到给你打了一张借条,快来确认吧',
                    desc: '金额: '+ssData.amt+'元 利率: '+ssData.rate+'% 用途: '+ssData.purpose,
                };
            }
            if(ssData.path == '/pre/loan_detail'){
                //分享 去出借借条
                shareData = {
                    title: '我在今借到放款,快来申请吧',
                    desc: '金额: '+ssData.amt+'元 时长: '+ssData.time +' 利率: '+ssData.rate+'%',
                };
            }
    
            if(ssData.path == '/pre/borrow_detail'){
                //分享 求借款
                shareData = {
                    title: '我在今借到发起了一个求借款，快来帮我筹款吧~',
                    desc: '金额: '+ssData.amt+'元 时长: '+ssData.time + '利率: '+ssData.rate+'% 用途: '+ssData.purpose,
                };
            }
    
            if(ssData.path == '/pre/loan_mine'){
                //分享 我的出借列表
                shareData = {
                    title: '我在今借到放款,快来申请吧',
                    desc: '金额: '+ssData.amt+'元 时长: '+ssData.time +' 利率: '+ssData.rate+'%',
                };
            }            
        }

        //贷后分享页面
        if(location.hash.indexOf('/after/share') != -1){
            if(ssData.path == '/after/show_status'){
                //分享 发起展期
                shareData = {
                    title: '我在今借到给你发起了借条展期,请尽快确认~',
                    desc: '金额:'+ssData.amt+'元  展期利率:'+ssData.rate +'%  展期还款日:'+ssData.date,
                };
            }

            if(ssData.path == '/after/writeoff_status'){
                //分享 发起销帐
                shareData = {
                    title: '我在今借到给你发起了借条销帐,请尽快确认~',
                    desc: '金额:'+ssData.amt+'元  销帐原因:'+ssData.txt,
                };
            }

            if(ssData.path == '/after/repay_status'){
                //分享 发起还款
                shareData = {
                    title: '我在今借到给你发起了借条还款,请尽快确认~',
                    desc: '金额:'+ssData.amt+'元',
                };
            }
        }
        if(location.hash.indexOf('/credit/report_simple') != -1){
            shareData={
                link:ssData.path+'?id='+ssData.id+'___'+ssData.code
            }
        }
        shareMessage = Object.assign(shareMessage,shareData);
        shareTimeline = Object.assign(shareTimeline,shareData);

        //分享给朋友
        wx.onMenuShareAppMessage(shareMessage);

        //分享到朋友圈
        wx.onMenuShareTimeline(shareTimeline);
    }

    $.ajaxEX = (ob) =>{
        ob.url = $.jjd.apiUrl + ob.url;        

        if (ob.type == "GET") {
        } else {
            ob.data = JSON.stringify(ob.data);
            ob.contentType = 'application/json';
            console.log(ob.data);
        }

        let promise = new Promise((resolve, reject)=>{            
            ob.success = (res) =>{
                resolve(res);
            }
            ob.error = (xhr, msg) =>{
                console.log(msg);
                reject(msg);
            }

            $.ajax(ob);
        })        
        return promise;
        
    }


    //四舍五入 保留两位小数
    $.to2 = (a) =>{
        a = parseInt(Math.round(parseFloat(a)*100))/100;
        return a;
    }
    //向上 保留两位小数
    $.up2 = (a) =>{
        a = parseInt(Math.ceil(parseFloat(a)*100))/100;
        return a;
    },
    //向下 保留两位小数
    $.down2 = (a) =>{
        a = parseInt(Math.floor(parseFloat(a)*100))/100;
        return a;
    },
    //元转分
    $.toFen = (a) => {
        a = Math.round(parseFloat(a)*100);
        return a;
    }
    //分转元
    $.toYuan = (a)=>{
        a = parseFloat(a/100);
        a = parseInt(Math.round(a*100))/100;
        return a;
    }
    

    //是否是微信平台
    $.isWeiXin = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/);
    
    //微信支付
    $.payWeiXin = (payToken) =>{
        let appId = sessionStorage.getItem('appId');
        location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?'+
                        'appid='+ appId +
                        '&redirect_uri='+$.jjd.host+'html/wx_pay.html?param='+encodeURI(JSON.stringify(payToken))+
                        '&response_type=code&scope=snsapi_userinfo'+
                        '&state=state#wechat_redirect'
    }

    //获取用途说明
    $.purpose = (index)=> {
        const c_purpose = [
            {label:'个体经营',value:0},
            {label:'消费',value:1},
            {label:'创业',value:3},
            {label:'租房',value:4},
            {label:'旅游',value:5},
            {label:'装修',value:6},
            {label:'医疗',value:7},
            {label:'其他',value:8}
        ];
        if(index==undefined){
            return c_purpose;
        }else{
            let arr = c_purpose.filter(item => item.value == index)
            return arr[0].label&&arr[0].label;
        }
    }

    //获取
    $.repayType = (index)=> {
        const c_repayWay=[
            {label:'到期还本付息',value: 0},
            {label:'等额本息',value: 1}
        ];
        if(index==undefined){
            return c_repayWay;            
        }else{
            return c_repayWay[index].label;
        }
    }
    
    $.clearThirdBackPath = ()=>{
        localStorage.removeItem('ylCredit')
        localStorage.removeItem('fast-supply_back')
    }

    $.getUrlParams = function(){
        var url = location.search; //获取url中"?"符后的字串  
        var theRequest = new Object();  
        if (url.indexOf("?") != -1) {  
            var str = url.substr(1);  
            strs = str.split("&");  
            for(var i = 0; i < strs.length; i ++) {  
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);  
            }
        }  
        return theRequest;  
    }
    //设置微信配置
    $.WXConfig = (conf)=> {
        wx.config({
            debug: false,
            appId: conf.appId,
            timestamp: conf.timestamp,
            nonceStr: conf.nonceStr,
            signature: conf.signature,
            jsApiList: [
              'checkJsApi',
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'chooseImage',
              'previewImage',
              'uploadImage',
              'downloadImage'
            ]
        });
    },
    $.RouterMap = {};
    $.WXShare = (title,desc,state)=>{
        //如果不是微信环境返回
        if(!$.isWeiXin){
            return;
        }
        if(title==null){
            title = '今借到-国内领先的网络借条管理平台';
        }
        if(desc==null){
            desc = '今借到是人人信公司推出的国内领先的网络借条管理平台，采用借贷双方实名模式，借款人可以为平台内借款行为打网络借条，也可以在平台上直接向朋友发起借款';
        }
        let appId = sessionStorage.getItem('appId');
        const shareUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri="+$.jjd.host+"html/wx_login.html&response_type=code&scope=snsapi_userinfo&state="+state+"#wechat_redirect";
        
        //获取微信签名
        $.ajaxE({
            type: 'GET',
            url: '/user/wx/signURL',
            data:{
                url: location.href
            }
        }).then((data)=>{
            $.WXConfig({
                appId:data.appId,
                timestamp:data.timestamp,
                nonceStr:data.nonceStr,
                signature:data.signature
            });
            wx.ready(function(){
                //分享给朋友
                wx.onMenuShareAppMessage({
                    title: title,
                    desc: desc,
                    link: shareUrl,
                    imgUrl: 'https://static.gushistory.com/shareLogo.png',
                    success: function (res) {
                        //alert(res);
                    },
                    cancel: function (res) {
                        //alert(res);
                    },
                    fail: function (res) {
                        //alert(res);
                    }
                });

                //分享到朋友圈
                wx.onMenuShareTimeline({
                    title: title,
                    link: shareUrl,
                    imgUrl: 'https://static.gushistory.com/shareLogo.png',
                    trigger: function (res) {
                    },
                    success: function (res) {
                    },
                    cancel: function (res) {
                    },
                    fail: function (res) {
                    }
                });
            });
        }).catch((msg)=>{
            console.log(msg);
        })
    }
}