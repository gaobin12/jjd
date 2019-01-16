'use strict'
import { action,observable } from 'mobx'
import { util,Modal,Loading } from 'SERVICE'

class User{
    // 当前点击的银行卡信息
    @observable currentBank = null;
    
    // 提现支付成功信息
    @observable paySuccess = null;

    //用户银行卡信息
    @observable userCards = null;

    constructor() {
    }

    //当前点击的银行卡信息
    @action setCurrentBank=(ob)=>{
        this.currentBank = ob;
    }

    //提现支付成功信息
    @action setPaySuccess=(ob)=>{
        this.paySuccess = ob;
    }


    //获取用户银行卡信息
    @action getPaymentList=(withdraw,callBack)=>{
        $.ajaxE({
            type: 'GET',
            url: '/user/my/getPaymentList',
            data: {
                withdraw
            }}).then((data)=>{
                Loading.hide();
                this.userCards = data;
                callBack && callBack();
            }).catch((msg)=>{
                Loading.hide();
                Modal.tip(msg);
            })
    }

    
}

export default new User()