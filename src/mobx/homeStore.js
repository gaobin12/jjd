'use strict'
import {action, observable} from 'mobx'

class Home {
    // 标签
    @observable tab = 1
    @action changeTab = (op) => {
        this.tab = op;
    }

    @observable drawer = 0
    @action changeDrawer = (op) => {
        this.drawer = op;
    }

    @observable isLogin = false;

    //假数据
    @observable homeInfo = {
        borrowInfo: {
            amount: 0,
            loanUserCount: 0,
            loanUserAmount: 0,
            productCount: 0,
            bidStatus: false
        },
        lendInfo: {
            amount: 0,
            loanUserCount: 0,
            loanUserAmount: 0,
            productCount: 0,
            bidStatus: false
        },
        guaranteeInfo: {
            amount: 0,
            loanUserCount: 0,
            loanUserAmount: 0,
            productCount: 0,
            bidStatus: false
        },
        borrowDynamic: {
            borrowListCount: 0,
            borrowList: [],
            friendProductListCount: 0,
            friendProductList: [],
            amongLoanListCount: 0,
            amongLoanList: []
        },
        lendDynamic: {
            borrowListCount: 0,
            borrowList: [],
            friendProductListCount: 0,
            friendProductList: [],
            amongLoanListCount: 0,
            amongLoanList: []
        },
        guaranteeDynamic: {
            borrowListCount: 0,
            borrowList: [],
            friendProductListCount: 0,
            friendProductList: [],
            amongLoanListCount: 0,
            amongLoanList: []
        }
    }
    @action setHomeInfo = (ob) => {

        //debugger;
        ob.borrowInfo = ob.borrowInfo || this.homeInfo.borrowInfo;
        ob.lendInfo = ob.lendInfo || this.homeInfo.lendInfo;
        ob.guaranteeInfo = ob.guaranteeInfo || this.homeInfo.guaranteeInfo;

        ob.borrowDynamic = ob.borrowDynamic || this.homeInfo.borrowDynamic;
        ob.lendDynamic = ob.lendDynamic || this.homeInfo.lendDynamic;
        ob.guaranteeDynamic = ob.guaranteeDynamic || this.homeInfo.guaranteeDynamic;  
        
        this.homeInfo = ob;
    }
}

export default new Home()