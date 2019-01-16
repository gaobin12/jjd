if (typeof require.ensure !== 'function') {
    require.ensure = function (dependencies, callback) {
        callback(require)
    }
}

import {onGoLogin} from './utils'

export default [
    {
        //打借条
        path: 'order',
        //onEnter: onGoLogin,
        getComponent(nextState, callback) {
            require.ensure([], require => {
                callback(null, require('VIEW/order/index'))
            }, 'order')
        }
    }
]