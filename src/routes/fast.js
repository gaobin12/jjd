
import Loadable from 'react-loadable'

export default [
    {   
        // 急速补借条
        path: '/fast/index',
        component:Loadable({
            loader: () => import('VIEW/fast/index'),
            loading: ()=>null
        })
    },{   
        // 补借条页面
        path: '/fast/form',
        component:Loadable({
            loader: () => import('VIEW/fast/form'),
            loading: ()=>null
        })
    },{   
        // 借条已生成
        path: '/fast/success',
        component:Loadable({
            loader: () => import('VIEW/fast/success'),
            loading: ()=>null
        })
    }, {   
        // 单独为极速借条做的学信认证
        path: '/fast/xuexin',
        component:Loadable({
            loader: () => import('VIEW/fast/xuexin'),
            loading: ()=>null
        })
    },{   
        // 单独为极速借条做的学信认证
        path: '/fast/xuexin_first',
        component:Loadable({
            loader: () => import('VIEW/fast/xuexin_first'),
            loading: ()=>null
        })
    },
    

]