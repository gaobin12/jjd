import Loadable from 'react-loadable'

export default [
    {
        // 催收
        path: '/collection/apply',
        //onEnter: onGoLogin,
        component:Loadable({
            loader: () => import('VIEW/collection/apply'),
            loading: ()=>null
        })
    },
    {
        // 记录
        path: '/collection/borrow',
        //onEnter: onGoLogin,
        component:Loadable({
            loader: () => import('VIEW/collection/borrow'),
            loading: ()=>null
        })
    },
    {
        // 下载证据
        path: '/collection/download',
        //onEnter: onGoLogin,
        component:Loadable({
            loader: () => import('VIEW/collection/download'),
            loading: ()=>null
        })
    },
    {
        // 电话催收
        path: '/collection/log',
        //onEnter: onGoLogin,
        component:Loadable({
            loader: () => import('VIEW/collection/log'),
            loading: ()=>null
        })
    },
    {
        // 支付成功
        path: '/collection/pay',
        //onEnter: onGoLogin,
        component:Loadable({
            loader: () => import('VIEW/collection/pay'),
            loading: ()=>null
        })
    },
    {
        // 反馈借款人信息
        path: '/collection/process',
        //onEnter: onGoLogin,
        component:Loadable({
            loader: () => import('VIEW/collection/process'),
            loading: ()=>null
        })
    },
    {
        // 还款提醒
        path: '/collection/repayment',
        //onEnter: onGoLogin,
        component:Loadable({
            loader: () => import('VIEW/collection/repayment'),
            loading: ()=>null
        })
    },
    {
        // 新还款提醒
        path: '/collection/remind',
        //onEnter: onGoLogin,
        component:Loadable({
            loader: () => import('VIEW/collection/remind'),
            loading: ()=>null
        })
    },
    {
        // 还款统计
        path: '/collection/statistics',
        //onEnter: onGoLogin,
        component:Loadable({
            loader: () => import('VIEW/collection/statistics'),
            loading: ()=>null
        })
    },
    {
        // 还款管理
        path: '/collection/admin',
        //onEnter: onGoLogin,
        component:Loadable({
            loader: () => import('VIEW/collection/admin'),
            loading: ()=>null
        })
    }
]