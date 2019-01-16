
import { action,observable } from 'mobx'
import { util } from 'SERVICE'

//贷前 借条草稿
class PreDraft{
    c_form = {
        id:null,
        amount:0,
        interest:0,
        totalAmt:0,
        borrowDays:0,
        rate:0,
        use:null,
        pname:null,
        checked:false
    };

    //补借条 表单
    @observable form = null;

    //借条详情
    @observable detail = null;

    //借条详情
    @observable detailOther = null;

    constructor() {
        let _form = util.getItem('preDraftFormStore');
        if(_form){
        }else{
            _form = this.c_form;
        }
        this.form = _form;

        let _detail = util.getItem('preDraftDetailStore');
        if(_detail){
            
        }else{
            _detail = {
            }
        }
        this.detail = _detail;

        let _detailOther = util.getItem('preDraftDetailOtherStore');
        if(_detailOther){            
        }else{
            _detailOther = {
            }
        }
        this.detailOther = _detailOther;
    }

    clearInfo=()=>{
        this.form = this.c_form;
        sessionStorage.removeItem('preDraftFormStore');
        sessionStorage.removeItem('preDraftDetailStore');
        sessionStorage.removeItem('preDraftDetailOtherStore');
    }
 
    @action setForm=(ob,callBack)=>{
        this.form = Object.assign(this.form,ob);
        $.setItem('preDraftFormStore',this.form);
        callBack && callBack();
    }

    @action setDetail=(ob,callBack)=>{
        this.detail = Object.assign(this.detail,ob);
        $.setItem('preDraftDetailStore',this.detail);
        callBack && callBack();
    }

    @action setDetailOther=(ob,callBack)=>{
        this.detailOther = Object.assign(this.detailOther,ob);
        $.setItem('preDraftDetailOtherStore',this.detailOther);
        callBack && callBack();
    }
}

export default new PreDraft()