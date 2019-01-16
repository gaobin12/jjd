
if (typeof require.ensure !== 'function') {
    require.ensure = function (dependencies, callback) {
        callback(require)
    }
}

import {onGoLogin} from './utils'

//攻略
export default [
    {  
        path: 'strategy',
        //onEnter: onGoLogin,
        getComponent(nextState, callback) {
            require.ensure([], require => {
                callback(null, require('VIEW/strategy/index'))
            }, 'strategy')
        }
    },
    {
        // 今借到出借攻略
        path: 'strategy/lend_ious',
        //onEnter: onGoLogin,
        getComponent(nextState, callback) {
            require.ensure([], require => {
                callback(null, require('VIEW/strategy/lend_ious'))
            }, 'strategy/lend_ious')
        }
    },    
    {
        // 今借到借款攻略
        path: 'strategy/borrow_ious',
        //onEnter: onGoLogin,
        getComponent(nextState, callback) {
            require.ensure([], require => {
                callback(null, require('VIEW/strategy/borrow_ious'))
            }, 'strategy/borrow_ious')
        }
    },     
    {
        // 超级认证
        path: 'strategy/super_credit',
        //onEnter: onGoLogin,
        getComponent(nextState, callback) {
            require.ensure([], require => {
                callback(null, require('VIEW/strategy/super_credit'))
            }, 'strategy/super_credit')
        }
    },    
    {
        // 今借到新手攻略
        path: 'strategy/new_hands',
        //onEnter: onGoLogin,
        getComponent(nextState, callback) {
            require.ensure([], require => {
                callback(null, require('VIEW/strategy/new_hands'))
            }, 'strategy/new_hands')
        }
    },
         
]