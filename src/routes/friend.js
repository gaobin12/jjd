
import Loadable from 'react-loadable'

//好友
export default [
    {   
        // 首页
        path: '/friend',
        component:Loadable({
            loader: () => import('VIEW/friend/index'),
            loading: ()=>null
        })
    }, {
        // 共同好友
        path: '/friend/commons',
        component:Loadable({
            loader: () => import('VIEW/friend/commons'),
            loading: ()=>null
        })
    }, {   
        // 认证等级
        path: '/friend/auth_level',
        component:Loadable({
            loader: () => import('VIEW/friend/auth_level'),
            loading: ()=>null
        })
    }, {   
        // 备注
        path: '/friend/remarks',
        component:Loadable({
            loader: () => import('VIEW/friend/remarks'),
            loading: ()=>null
        })
    }, {   
        // 高法失信
        path: '/friend/gfsx',
        component:Loadable({
            loader: () => import('VIEW/friend/gfsx'),
            loading: ()=>null
        })
    },{
        // 好友列表
        path: '/friend/list',
        component:Loadable({
            loader: () => import('VIEW/friend/list'),
            loading: ()=>null
        })
    },{
        // 添加好友
        path: '/friend/add',
        component:Loadable({
            loader: () => import('VIEW/friend/add'),
            loading: ()=>null
        })
    },{
        // 新的好友
        path: '/friend/new',
        component:Loadable({
            loader: () => import('VIEW/friend/new'),
            loading: ()=>null
        })
    },
]