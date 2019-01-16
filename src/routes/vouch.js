if (typeof require.ensure !== 'function') {
    require.ensure = function (dependencies, callback) {
        callback(require)
    }
}

import {onGoLogin} from './utils'

//担保
export default [
    {        
        path: 'vouch',
        //onEnter: onGoLogin,
        getComponent(nextState, callback) {
            require.ensure([], require => {
                callback(null, require('VIEW/vouch/index'))
            }, 'vouch')
        }
    }
]