

import Loadable from 'react-loadable'

//用户
export default [
    {   
        // 个人信息
        path: '/user',
        component:Loadable({
            loader: () => import('VIEW/user/index'),
            loading: ()=>null
        })
    }, {
        //登陆开始页面
        path: '/user/login',
        component:Loadable({
            loader: () => import('VIEW/user/login'),
            loading: ()=>null
        })
    },{
        path: '/user/setting',
        component:Loadable({
            loader: () => import('VIEW/user/setting'),
            loading: ()=>null
        })
    }, {
        path: '/user/pass',
        component:Loadable({
            loader: () => import('VIEW/user/password'),
            loading: ()=>null
        })
    }, {
        path: '/user/reset_pwd',
        component:Loadable({
            loader: () => import('VIEW/user/reset_pwd'),
            loading: ()=>null
        })
    }, {
        //分享
        path: '/user/share',
        component:Loadable({
            loader: () => import('VIEW/user/share'),
            loading: ()=>null
        })
    }, {
        //风险测评
        path: '/user/risk',
        component:Loadable({
            loader: () => import('VIEW/user/risk'),
            loading: ()=>null
        })
    }, {
        //常见问题
        path: '/user/faqs',
        component:Loadable({
            loader: () => import('VIEW/user/faqs'),
            loading: ()=>null
        })
    }, {
        //问题详情页1
        path: '/user/faqs_list',
        component:Loadable({
            loader: () => import('VIEW/user/faqs_list'),
            loading: ()=>null
        })
    }, {
        //问题详情页2
        path: '/user/faqs_detail',
        component:Loadable({
            loader: () => import('VIEW/user/faqs_detail'),
            loading: ()=>null
        })
    }, {
        //问题详情页2
        path: '/user/faqs_search',
        component:Loadable({
            loader: () => import('VIEW/user/faqs_search'),
            loading: ()=>null
        })
    }, {
        //邀请
        path: '/user/invite',
        component:Loadable({
            loader: () => import('VIEW/user/invite'),
            loading: ()=>null
        })
    }, {
        //风险测评结果页
        path: '/user/risk_result',
        component:Loadable({
            loader: () => import('VIEW/user/risk_result'),
            loading: ()=>null
        })
    }, {
        //输入交易密码
        path: '/user/input_valid',
        component:Loadable({
            loader: () => import('VIEW/user/input_valid'),
            loading: ()=>null
        })
    }, {
        //修改交易密码
        path: '/user/input_valid2',
        component:Loadable({
            loader: () => import('VIEW/user/input_valid2'),
            loading: ()=>null
        })
    }, {
        //登陆页面（密码登录）
        path: '/user/login_pwd',
        component:Loadable({
            loader: () => import('VIEW/user/login_pwd'),
            loading: ()=>null
        })
    }, {
        //注册页面（新）
        path: '/user/regist',
        component:Loadable({
            loader: () => import('VIEW/user/regist'),
            loading: ()=>null
        })
    }, {
        //修改交易密码
        path: '/user/trader_pwd',
        component:Loadable({
            loader: () => import('VIEW/user/trader_pwd'),
            loading: ()=>null
        })
    }, {
        //支付跳转页面
        path: '/user/returnPage',
        component:Loadable({
            loader: () => import('VIEW/user/returnPage'),
            loading: ()=>null
        })
    }, {
        // 实名认证
        path: '/user/id_auth',
        component:Loadable({
            loader: () => import('VIEW/user/id_auth'),
            loading: ()=>null
        })
    }
]