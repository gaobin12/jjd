if (typeof require.ensure !== 'function') {
    require.ensure = function (dependencies, callback) {
        callback(require)
    }
}

import {onGoLogin} from './utils'

//服务
export default [
    {        
        path: 'service',
        //onEnter: onGoLogin,
        getComponent(nextState, callback) {
            require.ensure([], require => {
                callback(null, require('VIEW/service/index'))
            }, 'service')
        }
    }
]