if (typeof require.ensure !== 'function') {
    require.ensure = function (dependencies, callback) {
        callback(require)
    }
}

export default [
    {
        //打借条
        path: 'address',
        getComponent(nextState, callback) {
            require.ensure([], require => {
                callback(null, require('VIEW/address/index'))
            }, 'address')
        }
    }
]