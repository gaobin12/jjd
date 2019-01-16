'use strict'
import { action,observable } from 'mobx'
import { util } from 'SERVICE'

const c_current = new Date(Date.now());

//贷前 补借条
class PreIou{

    c_form = {
        id:null,
        amount:0,
        //服务费
        fee:0,
        guarantorFee:0,
        times:null,
        interest:0,
        totalAmt:0,
        timeList:[],
        use:null,
        checked:false
    }

    //补借条 表单
    @observable form = null;

    //借条详情
    @observable detail = null;

    constructor() {
        let _form = util.getItem('preLoanFormStore');
        if(_form){
        }else{
            _form = this.c_form;
        }
        this.form = _form;

        let _detail = util.getItem('preLoanDetailStore');
        if(_detail){            
        }else{
            _detail = {
                id:'',
                avatarUrl:null,
                fullName:'',
                telephone:'',
                uid:'',
                toReceiveAmount:0,
                toRepayAmount:0,
                currentGuaranteeAmount:0,
                borrowerName:'',
                lenderName:'',
                amount:'',
                repayTypeText:'',
                formatTime:'',
                interestRate:'',
                purpose:'',
                memo:'',
                originalId:'',
                createDate:'',
            }
        }
        this.detail = _detail;
    }

    clearInfo=()=>{
        this.form = this.c_form;
        sessionStorage.removeItem('preLoanFormStore');
        sessionStorage.removeItem('preLoanDetailStore');
    }

    @action setForm=(ob,callBack)=>{
        this.form = Object.assign(this.form,ob);
        $.setItem('preLoanFormStore',this.form);
        callBack && callBack();
    }

    @action setDetail=(ob,callBack)=>{
        this.detail = Object.assign(this.detail,ob);
        $.setItem('preLoanDetailStore',this.detail);
        callBack && callBack();
    }
}

export default new PreIou()