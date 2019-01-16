

import Loadable from 'react-loadable'
//贷后
export default [{
        //贷收
        path: '/after/loan_list',
        component:Loadable({
            loader: () => import('VIEW/after/loan_list'),
            loading: ()=>null
        })
    },{
        //贷还
        path: '/after/borrow_list',
        component:Loadable({
            loader: () => import('VIEW/after/borrow_list'),
            loading: ()=>null
        })
    },{
        //筛选
        path: '/after/common_list_filter',
        component:Loadable({
            loader: () => import('VIEW/after/common_list_filter'),
            loading: ()=>null
        })
    },{
        //借条信息  借出
        path: '/after/loan_detail',
        component:Loadable({
            loader: () => import('VIEW/after/loan_detail'),
            loading: ()=>null
        })
    },{   
        //借条信息  借出
        path: '/after/borrow_detail',
        component:Loadable({
            loader: () => import('VIEW/after/borrow_detail'),
            loading: ()=>null
        })
    },{   
        //借条内容
        path: '/after/info',
        component:Loadable({
            loader: () => import('VIEW/after/info'),
            loading: ()=>null
        })
    },{   
        //发起展期
        path: '/after/show_form',
        component:Loadable({
            loader: () => import('VIEW/after/show_form'),
            loading: ()=>null
        })
    },{   
        //展期状态
        path: '/after/show_state',
        component:Loadable({
            loader: () => import('VIEW/after/show_state'),
            loading: ()=>null
        })
    },{   
        //确认展期
        path: '/after/show_confirm',
        component:Loadable({
            loader: () => import('VIEW/after/show_confirm'),
            loading: ()=>null
        })
    },{   
        //展期进度
        path: '/after/show_process',
        component:Loadable({
            loader: () => import('VIEW/after/show_process'),
            loading: ()=>null
        })
    },{   
        //发起销账
        path: '/after/off_form',
        component:Loadable({
            loader: () => import('VIEW/after/off_form'),
            loading: ()=>null
        })
    },{   
        //销账成功
        path: '/after/off_success',
        component:Loadable({
            loader: () => import('VIEW/after/off_success'),
            loading: ()=>null
        })
    },{   
        //销账进度
        path: '/after/off_process',
        component:Loadable({
            loader: () => import('VIEW/after/off_process'),
            loading: ()=>null
        })
    },{   
        //销账进度
        path: '/after/off_confirm',
        component:Loadable({
            loader: () => import('VIEW/after/off_confirm'),
            loading: ()=>null
        })
    },{   
        //发起举报
        path: '/after/report',
        component:Loadable({
            loader: () => import('VIEW/after/report'),
            loading: ()=>null
        })
    },{
        //发起举报
        path: '/after/report_process',
        component: Loadable({
            loader: () => import('VIEW/after/report_process'),
            loading: () => null
        })
    },{   
        //销账管理
        path: '/after/urge',
        component:Loadable({
            loader: () => import('VIEW/after/urge'),
            loading: ()=>null
        })
    },{   
        //销账记录
        path: '/after/urge_log',
        component:Loadable({
            loader: () => import('VIEW/after/urge_log'),
            loading: ()=>null
        })
    },{
        //销账状态
        path: '/after/writeoff_status',
        component: Loadable({
            loader: () => import('VIEW/after/writeoff_status'),
            loading: () => null
        })
    },{   
        //还款状态
        path: '/after/repay_status',
        component:Loadable({
            loader: () => import('VIEW/after/repay_status'),
            loading: ()=>null
        })
    },{   
        //展期状态
        path: '/after/show_status',
        component:Loadable({
            loader: () => import('VIEW/after/show_status'),
            loading: ()=>null
        })
    },

    
    

    
    

]