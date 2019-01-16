
import Loadable from 'react-loadable'

export default [
    {
        path: '/agree',
        component:Loadable({
            loader: () => import('VIEW/agree/index'),
            loading: ()=>null
        })
    }, {
        // 催收协议
        path: '/agree/collection',
        component:Loadable({
            loader: () => import('VIEW/agree/collection'),
            loading: ()=>null
        })
    }, {
        // 借款展期协议
        path: '/agree/extend',
        component:Loadable({
            loader: () => import('VIEW/agree/extend'),
            loading: ()=>null
        })
    }, {
        // 借款协议
        path: '/agree/iou',
        component:Loadable({
            loader: () => import('VIEW/agree/iou'),
            loading: ()=>null
        })
    }, {
        // 征信授权书
        path: '/agree/auth',
        component:Loadable({
            loader: () => import('VIEW/agree/auth'),
            loading: ()=>null
        })
    },{
        // 送达地址确认书
        path: '/agree/address',
        component:Loadable({
            loader: () => import('VIEW/agree/address'),
            loading: ()=>null
        })
    }
    
]