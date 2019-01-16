
'use strict'
import { action,observable } from 'mobx'
import { util } from 'SERVICE'

const c_current = new Date(Date.now());

//贷前 去出借
class PreProduct{

    c_form = {
        id:null,
        amount:null,
        //还款方式  等额本息1  到期还本付息0
        repayType:1,
        time11:null,
        time12:null,
        time21:null,
        time22:null,
        timesArea:[],
        rate:0,
        creditInfo:{},
        //备注
        memo:'',
        checked:false
    };

    //添加出借 表单
    @observable form = null;

    //借条详情
    @observable detail = null;

    //借条详情
    @observable detailOther = null;

    constructor() {
        let _form = util.getItem('preProductFormStore');
        if(_form){
        }else{
            _form = this.c_form;
        }
        this.form = _form;

        let _detail = util.getItem('preProductDetailStore');
        if(_detail){
            
        }else{
            _detail = {
            }
        }
        this.detail = _detail;

        let _detailOther = util.getItem('preProductDetailOtherStore');
        if(_detailOther){            
        }else{
            _detailOther = {

            }
        }
        this.detailOther = _detailOther;
    }

    clearInfo=()=>{
        this.form = this.c_form;
        sessionStorage.removeItem('preProductFormStore');
        sessionStorage.removeItem('preProductDetailStore');
        sessionStorage.removeItem('preProductDetailOtherStore');
    }

    @action setForm=(ob,callBack)=>{
        this.form = Object.assign(this.form,ob);
        $.setItem('preProductFormStore',this.form);
        callBack && callBack();
    }

    @action setDetail=(ob,callBack)=>{
        this.detail = Object.assign(this.detail,ob);
        $.setItem('preProductDetailStore',this.detail);
        callBack && callBack();
    }

    @action setDetailOther=(ob,callBack)=>{
        this.detailOther = Object.assign(this.detailOther,ob);
        $.setItem('preProductDetailOtherStore',this.detailOther);
        callBack && callBack();
    }

    setTimeText=(ob)=>{
        if(ob.repayType){
            ob.minTxt = '期';
            ob.maxTxt = '期';
        }else{
            if(ob.minTimeUnit){
                ob.minTxt = '个月';
            }else{
                ob.minTxt = '天';
            }

            if(ob.maxTimeUnit){
                ob.maxTxt = '个月';
            }else{
                ob.maxTxt = '天';
            }
        }        
    }

    getXuexinInfo=(ob)=>{
        let arr=new Array();
        if(ob.requireCarInfo){
            arr.push("车产");
        }
        if(ob.requireHouseInfo){
            arr.push("房产");
        }
        if(ob.requireJobInfo){
            arr.push("工作");
        }
        if(ob.requireIncomeInfo){
            arr.push("收入");
        }
        if(ob.requireXuexinInfo){
            arr.push("学历");
        }
        if(ob.requireZhengxinInfo){
            arr.push("征信");
        }
        if(ob.requireJdInfo){
            arr.push("京东");
        }
        if(ob.requireSbInfo){
            arr.push("社保");
        }
        if(ob.requireGjjInfo){
            arr.push("公积金");
        }
        let str=arr.join("、");
        ob.creditInfo=str;
    }
    
}

export default new PreProduct()