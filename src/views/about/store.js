
'use strict'
import { action,observable } from 'mobx'

class About{
    // 创建变量
    @observable name = 'wpf'

    @action changeName=(name)=>{
        this.name = name;
    }
}

export default new About()