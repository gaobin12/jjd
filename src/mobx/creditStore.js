'use strict'
import { action,observable } from 'mobx'
import { util,Modal } from 'SERVICE'

class User{
    // 用户认证信息
    @observable creditData = null;

    // 是否支付认证费用
    @observable paidStatus = true;

    // 第三方返回的图片信息
    @observable baseDate = null;

    constructor() {
        this.creditData = util.getItem('creditData');
    }

    //检查是否支付认证费用
    @action payCreditFeeInit=(callBack)=>{
        $.ajaxE({
            type: 'GET',
            url: '/user/creditFee/payCreditFeeInit',
            data:{}
        }).then((data)=>{
            this.paidStatus = data.isPaid;
            callBack && callBack();
        }).catch((msg)=>{
            Modal.tip(msg);
        })
    } 

    //获取认证状态
    @action getCreditSwitch=(callBack)=>{
        $.ajaxE({
            type: 'GET',
            url: '/credit/user/getCreditSwitch',
            data:{}
        }).then((data)=>{
            this.creditData = data;
            $.setItem('creditData',data);
            callBack && callBack();
        }).catch((msg)=>{
            Modal.tip(msg);
        })
    }

    //第三方返回的图片信息
    @action setBaseDate=(ob)=>{
        this.baseDate = ob;
    }
    
}

export default new User()