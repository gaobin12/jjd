

import React from 'react'

const loadingComponent = ({ isLoading, error }) => {
    if (isLoading) {
        return <div>Loading...</div>;
    }
    else if (error) {
        return <div>Sorry, there was a problem loading the page.</div>;
    }
    else {
        return null;
    }
  };

export default [
    {
        path: '/',   
        component:require('VIEW/home/index/index').default
    },
    {
        path: '/jzd',   
        component:require('VIEW/home/jzd/index').default
    },
    //用户信息
    ...require('./user').default,
    //贷前
    ...require('./pre').default,
    //贷后
    ...require('./after').default,
    //好友
    ...require('./friend').default,
    //信用认证
    ...require('./credit').default,
    //钱包
    ...require('./wallet').default,
    //银行卡
    ...require('./card').default,
    //设置
    ...require('./setting').default,
    //协议
    ...require('./agree').default,
    //消息
    ...require('./msg').default,
    //消息
    ...require('./fast').default,
    // 催收
    ...require('./collection').default,
    ]