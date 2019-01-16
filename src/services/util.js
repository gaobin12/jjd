

import math from './math'

export default {
    //设置sessionStorage数据
    setItem(key,ob){
        let obData = JSON.stringify(Object.assign(ob));
        sessionStorage.setItem(key,obData);
    },

    //更新sessionStorage数据
    updateItem(key,ob){
        let data = sessionStorage.getItem(key);
        if(data == null || data == 'null'){
            data = {};
        }else{
            data = JSON.parse(data);
        }
        let obData = JSON.stringify(Object.assign(data,ob));
        sessionStorage.setItem(key,obData);
    },

    //获取sessionStorage数据
    getItem(key,datakey){
        let data = JSON.parse(sessionStorage.getItem(key));
        if(datakey){
            data = data[datakey];
        }
        return data;
    },

    //设置localStorage数据
    setLocal(key,ob){
        let obData = JSON.stringify(Object.assign(ob));        
        localStorage.setItem(key,obData);
    },

    //更新sessionStorage数据
    updateLocal(key,ob){
        let data = localStorage.getItem(key);
        if(data == null || data == 'null'){
            data = {};
        }else{
            data = JSON.parse(data);
        }
        let obData = JSON.stringify(Object.assign(data,ob));
        localStorage.setItem(key,obData);
    },

    //获取sessionStorage数据
    getLocal(key,datakey){
        let data = JSON.parse(localStorage.getItem(key));
        if(datakey){
            data = data[datakey];
        }
        return data;
    },

    getUrlParams(url){
        let theRequest = new Object();  
        if (url.indexOf("?") != -1) {  
            let str = url.substr(1);  
            let strs = str.split("&");  
            for(var i = 0; i < strs.length; i ++) {  
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);  
            }
        }  
        return theRequest;
    },
    // 相差天数
    iouComputedDays: function (d2,d1) {
        let start = d1.getTime();
        let end = d2.getTime();
        let m = end - start;
        let d = Math.ceil(m / (24 * 3600 * 1000));
        return d > 0 ? d : 0;
    },
    // 利息
    iouComputedInterest: function (iouAmount,iouRate,iouComputedDays) {
        return parseFloat(iouAmount || 0) * parseInt(iouRate) / 36500 * parseInt(iouComputedDays);
    },
    // 到期本息
    iouComputedAmount: function (iouAmount,iouComputedInterest) {
        return (parseFloat(iouAmount || 0) + parseFloat(iouComputedInterest)).toFixed(2);
    },
    //计算等额本息还款列表 mount(本金) rate(年利率) times(还款期数)
    iouInstallment:function(mount,rate,times){
        let list = [],
            m_mount = 0,
            mount_i = 0,
            m_i = 0,            //每月利息
            M = mount,          //M剩余本金
            i_total = 0,        //利息总和
            m_total = 0;        //还款总和
        const currentDate = new Date(Date.now());
        if(rate){
            for(let i=1;i<=times;i++){
                // if(i==times){
                //     m_mount = mount - m_total;
                // }else{
                    m_mount = mount * rate * Math.pow((1+rate),(i-1))/(Math.pow((1+rate),times)-1);
                //}
                M = M - mount_i;
                m_i = M*rate;
                list.push({
                    date:currentDate.DateAdd('m',i).Format('yyyy-MM-dd'),
                    fee:$.to2(m_mount+m_i)
                })
                i_total += $.to2(m_mount+m_i);
                m_total += m_mount+m_i;
                mount_i = m_mount;
            }
            return {
                list,
                total:$.to2(m_total),
                total_i:(i_total-mount)<0?'0.00':$.to2(i_total-mount)  
            };  
        }else{
            m_mount = mount/times;
            m_mount = parseInt(Math.round(m_mount*100))/100;
            for(let i=1;i<=times;i++){
                if(i==times){
                    //debugger;
                    m_mount = mount - parseInt(Math.round(m_mount*(times-1)*100))/100;
                }
                list.push({
                    date:currentDate.DateAdd('m',i).Format('yyyy-MM-dd'),
                    fee:$.to2(m_mount)
                })
            }
            return {
                list,
                total:mount,
                total_i:0
            };
        }
    },
    //锚点
    anchor:function(eleId){
        if(eleId && eleId.length){
            let ele = document.getElementById(eleId);
            if(ele){
                //页面定位到相应的锚点
                ele.scrollIntoView();
            }
        }
    }
};