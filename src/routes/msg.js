
import Loadable from 'react-loadable'

//消息
export default [
    {        
        path: '/msg',
        component:Loadable({
            loader: () => import('VIEW/msg/index'),
            loading: ()=>null
        })
    }, {
        //交易消息
        path: '/msg/trade',
        component:Loadable({
            loader: () => import('VIEW/msg/trade'),
            loading: ()=>null
        })
    }, {
        //收还款消息
        path: '/msg/pay',
        component:Loadable({
            loader: () => import('VIEW/msg/pay'),
            loading: ()=>null
        })
    }, {
        //举报消息
        path: '/msg/report',
        component:Loadable({
            loader: () => import('VIEW/msg/report'),
            loading: ()=>null
        })
    }, {
        //系统消息
        path: '/msg/system',
        component:Loadable({
            loader: () => import('VIEW/msg/system'),
            loading: ()=>null
        })
    }, {
        //销账消息
        path: '/msg/off',
        component:Loadable({
            loader: () => import('VIEW/msg/off'),
            loading: ()=>null
        })
    }
]