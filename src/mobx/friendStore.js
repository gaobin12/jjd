
'use strict'
import { action,observable } from 'mobx'
import { util } from 'SERVICE'

//好友
class Friend{

    //添加 表单
    @observable form = null;

    //好友 详情
    @observable detail = null; 
    
    //被选择好友
    @observable selected = null;

    constructor() {
    }
 
    @action setForm=(ob,callBack)=>{
        // this.form = Object.assign(this.form,ob);
        // $.setItem('preIouFormStore',this.form);
        // callBack && callBack();
    }

    @action setDetail=(ob,callBack)=>{
        // this.detail = Object.assign(this.detail,ob);
        // $.setItem('preIouDetailStore',this.detail);
        // callBack && callBack();
    }

    @action selected=(ob,callBack)=>{
        this.selected = Object.assign(this.selected,ob);
        $.setItem('friendSelectedStore',this.selected);
        callBack && callBack();
    }
    
}

export default new Friend()