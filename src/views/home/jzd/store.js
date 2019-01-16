

'use strict'
import { action,observable } from 'mobx'

class Home{
    // 创建变量
    @observable name = 'home'

    @action changeName=(name)=>{
        this.name = name;
    }

    @observable switchIndex = 1;
    @action doSwitchIndex=(index)=>{
        this.switchIndex = index;
    }

    @observable isLogin = 1;
}

export default new Home()