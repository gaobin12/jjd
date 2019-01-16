
'use strict'
import { action,observable } from 'mobx'
import { util } from 'SERVICE'

const c_current = new Date(Date.now());



//贷前 补借条
class PreIou{
    c_form = {
        id:null,
        tab:0,
        amount:0,
        interest:0,
        totalAmt:0,
        start:c_current,
        end:c_current.DateAdd('d',7),
        rate:0,
        use:null,
        pname:null,
        checked:false
    };

    //补借条 表单
    @observable form = null;

    //借条详情
    @observable detail = null;    

    constructor() {
        let _form = util.getItem('preIouFormStore');
        if(_form){
            _form.start = new Date(_form.start);
            _form.end = new Date(_form.end);
        }else{
            _form = this.c_form;
        }
        this.form = _form;

        let _detail = util.getItem('preIouDetailStore');
        if(_detail){
            
        }else{
            _detail = {
                createdHead:null,
                creatorName:'',
                creatorTel:'',
                telephone:'',
                toReceiveAmt:0,
                toRepayAmt:0,
                guaranteeAmt:0,
                lenderId:null,
                borrowerId:null,
                borrowerName:'',
                lenderName:'',
                amount:0,
                borrowTime:'',
                repayTime:'',
                interestRate:0,
                purpose:'',
                purposeTxt:'',
                createTimeTxt:'',
                originalId:'',
                createTime:'',
                loanType:0,
                paid:false,
                rejected:false
            }
        }
        this.detail = _detail;
    }

    clearInfo=()=>{
        this.form = this.c_form;
        sessionStorage.removeItem('preIouFormStore');
        sessionStorage.removeItem('preIouDetailStore');
    }
 
    @action setIouForm=(ob,callBack)=>{
        this.form = Object.assign(this.form,ob);
        $.setItem('preIouFormStore',this.form);
        callBack && callBack();
    }

    @action setIouDetail=(ob,callBack)=>{
        this.detail = Object.assign(this.detail,ob);
        $.setItem('preIouDetailStore',this.detail);
        callBack && callBack();
    }
}

export default new PreIou()