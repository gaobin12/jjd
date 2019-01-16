
'use strict'
import { action,observable } from 'mobx'
import { util } from 'SERVICE'

const c_current = new Date(Date.now());

//贷前 补借条
class PreBorrow{

    c_form = {
        id:null,
        amount:0,
        //还款方式  等额本息1  到期还本付息0
        repayType:1,
        //期数
        period:3,
        //是否需要担保
        isGuarantor:0,
        //利息
        interest:0,
        //担保费
        guarantorFee:0,
        //担保费率
        guarantorRate:0,
        //手续费
        fee:0,
        end:c_current.DateAdd('d',7),
        rate:0,
        timeList:[],
        use:null,
        isPublic:0,
        checked:false
    }

    c_formTa = {
        guarantee:null,
        amount:0,
        interest:0,
        timeList:[],
        checked:false
    }

    c_formDb = {
        loaner:null,
        amount:0,
        interest:0,
        checked:false
    }
    
    //补借条 表单
    @observable form = null;

    //借条详情
    @observable detail = null;

    //借给Ta 表单
    @observable formTa = null;

    //担保 表单
    @observable formDb = null;

    constructor() {
        let _form = util.getItem('preBorrowFormStore');
        if(_form){
            _form.end = new Date(_form.end);
        }else{
            _form = this.c_form;
        }
        this.form = _form;

        let _formTa = util.getItem('preBorrowTaFormStore');
        if(_formTa){
        }else{
            _formTa = this.c_formTa;
        }
        this.formTa = _formTa;

        let _formDb = util.getItem('preBorrowDbFormStore');
        if(_formDb){
        }else{
            _formDb = this.c_formDb;
        }
        this.formDb = _formDb;

        let _detail = util.getItem('preBorrowDetailStore');
        if(_detail){            
        }else{            
            _detail = {
                avatarUrl:'',
                telephone:'',
                borrowerUid:'',
                toReceiveAmount:0,
                toRepayAmount:0,
                currentGuaranteeAmount:0,
                leftDay:0,
                getAmount:0,
                amount:0,
                fullName:'',
                interestRate:0,
                guaranteeRate:0,
                repayTypeTxt:'',
                period:0,
                repayTime:'',
                purposeType:'',
                originalId:'',
                createTimeTxt:'',
                guaranteeIdList:[],
                loanList:[]
            }
        }
        this.detail = _detail;
    }

    clearInfo=()=>{
        this.form = this.c_form;
        this.formTa = this.c_formTa;
        this.formDb = this.c_formDb;
        sessionStorage.removeItem('preBorrowFormStore');
        sessionStorage.removeItem('preBorrowTaFormStore');
        sessionStorage.removeItem('preBorrowDbFormStore');
        sessionStorage.removeItem('preBorrowDetailStore');
    }

    @action setForm=(ob,callBack)=>{
        this.form = Object.assign(this.form,ob);
        $.setItem('preBorrowFormStore',this.form);
        callBack && callBack();
    }

    @action setFormTa=(ob,callBack)=>{
        this.formTa = Object.assign(this.formTa,ob);
        $.setItem('preBorrowTaFormStore',this.formTa);
        callBack && callBack();
    }

    @action setFormDb=(ob,callBack)=>{
        this.formDb = Object.assign(this.formDb,ob);
        $.setItem('preBorrowDbFormStore',this.formDb);
        callBack && callBack();
    }

    @action setDetail=(ob,callBack)=>{
        this.detail = Object.assign(this.detail,ob);
        $.setItem('preBorrowDetailStore',this.detail);
        callBack && callBack();
    }
    
}

export default new PreBorrow()