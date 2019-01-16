import React, { Component } from 'react'
export default {
    //四舍五入 保留两位小数
    to2:function(a){
        a = parseInt(Math.round(parseFloat(a)*100))/100;
        return a;
    },
    //向上 保留两位小数
    up2:function(a){
        a = parseInt(Math.ceil(parseFloat(a)*100))/100;
        return a;
    },
    //向下 保留两位小数
    down2:function(a){
        a = parseInt(Math.floor(parseFloat(a)*100))/100;
        return a;
    },
    //转分
    toFen:function(a){
        a = Math.round(parseFloat(a)*100);
        return a;
    },
    //转元
    toYuan:function(a){
        a = parseFloat(a/100);
        a = parseInt(Math.round(a*100))/100;
        return a;
    },
    //转元(10000->万)
    toYuanW:function(a){
        a = parseFloat(a/100);
        if(a>=10000){
            a = parseInt(Math.round(a/10000*100))/100;
            a = (<span>{a}万</span>)
        }else{
            a = parseInt(Math.round(a*100))/100;
        }
        return a;
    }
};