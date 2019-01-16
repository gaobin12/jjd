import Loadable from 'react-loadable'
//设置
export default [
    {        
        path: '/setting',
        component:Loadable({
            loader: () => import('VIEW/setting/index'),
            loading: ()=>null
        })  
    }, {
        //更换手机号码验证码
        path: '/setting/change_phone',
        component:Loadable({
            loader: () => import('VIEW/setting/change_phone'),
            loading: ()=>null
        })  
        
    },
    {
        //修改交易密码
        path: '/setting/change_trade_pwd',
        component:Loadable({
            loader: () => import('VIEW/setting/change_trade_pwd'),
            loading: ()=>null
        }) 
    },
    {
        //手机验证码
        path: '/setting/phone_code',
        component:Loadable({
            loader: () => import('VIEW/setting/phone_code'),
            loading: ()=>null
        })
    }, {
        //版本介绍
        path: '/setting/update_history',
        component:Loadable({
            loader: () => import('VIEW/setting/update_history'),
            loading: ()=>null
        })
    }, {
        //短信验证码（新的共用）
        path: '/setting/note_code',
        component:Loadable({
            loader: () => import('VIEW/setting/note_code'),
            loading: ()=>null
        })
    }, {
        //关于我们
        path: '/setting/about',
        component:Loadable({
            loader: () => import('VIEW/setting/about'),
            loading: ()=>null
        })
    }, {
        //输入验证码
        path: '/setting/valid/:type',        
        component:Loadable({
            loader: () => import('VIEW/setting/valid'),
            loading: ()=>null
        })
    }
    
]