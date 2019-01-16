
import Loadable from 'react-loadable'

export default [
    {
        //补借条表单
        path: '/pre/iou_form',
        component:Loadable({
            loader: () => import('VIEW/pre/iou_form'),
            loading: ()=>null
        })
    }, {
        //补借条 详情
        path: '/pre/iou_detail',
        component:Loadable({
            loader: () => import('VIEW/pre/iou_detail'),
            loading: ()=>null
        })
    }, {
        //求借款表单
        path: '/pre/borrow_form',
        component:Loadable({
            loader: () => import('VIEW/pre/borrow_form'),
            loading: ()=>null
        })
    }, {
        //去出借产品列表
        path: '/pre/product_list',
        component:Loadable({
            loader: () => import('VIEW/pre/product_list'),
            loading: ()=>null
        })
    }, {
        //去出借表单
        path: '/pre/product_form',
        component:Loadable({
            loader: () => import('VIEW/pre/product_form'),
            loading: ()=>null
        })
    }, {
        //求借款 详情 （求借款）
        path: '/pre/borrow_detail',
        component:Loadable({
            loader: () => import('VIEW/pre/borrow_detail'),
            loading: ()=>null
        })
    }, {
        //去出借产品详情
        path: '/pre/product_detail',
        component:Loadable({
            loader: () => import('VIEW/pre/product_detail'),
            loading: ()=>null
        })
    }, {
        //生成的借条产品详情
        path: '/pre/loan_detail',
        component:Loadable({
            loader: () => import('VIEW/pre/loan_detail'),
            loading: ()=>null
        })
    }, {
        //作担保
        path: '/pre/borrow_guarantee',
        component:Loadable({
            loader: () => import('VIEW/pre/borrow_guarantee'),
            loading: ()=>null
        })
    }, {
        //求借款成功
        path: '/pre/borrow_success',
        component:Loadable({
            loader: () => import('VIEW/pre/borrow_success'),
            loading: ()=>null
        })
    }, {
        //借给Ta
        path: '/pre/borrow_ta',
        component:Loadable({
            loader: () => import('VIEW/pre/borrow_ta'),
            loading: ()=>null
        })
    }, {
        //借条不存在
        path: '/pre/iou_no',
        component:Loadable({
            loader: () => import('VIEW/pre/iou_no'),
            loading: ()=>null
        })
    }, {
        //添加出借
        path: '/pre/loan_apply',
        component:Loadable({
            loader: () => import('VIEW/pre/loan_apply'),
            loading: ()=>null
        })
    }, {
        //出借成功
        path: '/pre/loan_success',
        component:Loadable({
            loader: () => import('VIEW/pre/loan_success'),
            loading: ()=>null
        })
    }, {
        //借条草稿
        path: '/pre/draft_form',
        component:Loadable({
            loader: () => import('VIEW/pre/draft_form'),
            loading: ()=>null
        })
    }, {
        //草稿详情
        path: '/pre/draft_detail',
        component:Loadable({
            loader: () => import('VIEW/pre/draft_detail'),
            loading: ()=>null
        })
    }
    
    // {
    //     //求借款详情 别人查看
    //     path: 'pre/borrow_detail',
    //     //onEnter: onGoLogin,
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/borrow_detail'))
    //         }, 'pre/borrow_detail')
    //     }
    // }, 
    // // {
    // //     //求借款详情 别人查看
    // //     path: 'pre/borrow_detail_other',
    // //     //onEnter: onGoLogin,
    // //     getComponent(nextState, callback) {
    // //         require.ensure([], require => {
    // //             callback(null, require('VIEW/pre/borrow_detail_other'))
    // //         }, 'pre/borrow_detail_other')
    // //     }
    // // }, {
    // //     //求借款详情 自己查看
    // //     path: 'pre/borrow_detail_self',
    // //     //onEnter: onGoLogin,
    // //     getComponent(nextState, callback) {
    // //         require.ensure([], require => {
    // //             callback(null, require('VIEW/pre/borrow_detail_self'))
    // //         }, 'pre/borrow_detail_self')
    // //     }
    // // }, 
    // {
    //     //求借款 表单
    //     path: 'pre/borrow_form',
    //     //onEnter: onGoLogin,
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/borrow_form'))
    //         }, 'pre/borrow_form')
    //     }
    // }, {
    //     //补借条 表单创建成功
    //     path: 'pre/borrow_form_success',
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/borrow_form_success'))
    //         }, 'pre/borrow_form_success')
    //     }
    // }, {
    //     //创建成功
    //     path: 'pre/borrow_guarantee',
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/borrow_guarantee'))
    //         }, 'pre/borrow_guarantee')
    //     }
    // }, {
    //     //出借详情
    //     path: 'pre/borrow_ta',
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/borrow_ta'))
    //         }, 'pre/borrow_ta')
    //     }
    // }, {
    //     //补借条 详情 （去出借）
    //     path: 'pre/iou_detail',
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/iou_detail'))
    //         }, 'pre/iou_detail')
    //     }
    // },
    // // {
    // //     //补借条 详情 （去出借）
    // //     path: 'pre/iou_detail_other',
    // //     getComponent(nextState, callback) {
    // //         require.ensure([], require => {
    // //             callback(null, require('VIEW/pre/iou_detail_other'))
    // //         }, 'pre/iou_detail_other')
    // //     }
    // // }, {
    // //     //补借条 详情
    // //     path: 'pre/iou_detail_self',
    // //     //onEnter: onGoLogin,
    // //     getComponent(nextState, callback) {
    // //         require.ensure([], require => {
    // //             callback(null, require('VIEW/pre/iou_detail_self'))
    // //         }, 'pre/iou_detail_self')
    // //     }
    // // },
    // {
    //     //补借条表单
    //     path: 'pre/iou_form',
    //     //onEnter: onGoLogin,
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/iou_form'))
    //         }, 'pre/iou_form')
    //     }
    // }, {
    //     //借条用途
    //     path: 'pre/iou_purpose',
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/iou_purpose'))
    //         }, 'pre/iou_purpose')
    //     }
    // }, {
    //     //去出借 别人查看
    //     path: 'pre/loan_detail',
    //     //onEnter: onGoLogin,
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/loan_detail'))
    //         }, 'pre/loan_detail')
    //     }
    // },
    // // {
    // //     //去出借 别人查看
    // //     path: 'pre/loan_detail_other',
    // //     //onEnter: onGoLogin,
    // //     getComponent(nextState, callback) {
    // //         require.ensure([], require => {
    // //             callback(null, require('VIEW/pre/loan_detail_other'))
    // //         }, 'pre/loan_detail_other')
    // //     }
    // // }, {
    // //     //去出借 自己查看
    // //     path: 'pre/loan_detail_self',
    // //     //onEnter: onGoLogin,
    // //     getComponent(nextState, callback) {
    // //         require.ensure([], require => {
    // //             callback(null, require('VIEW/pre/loan_detail_self'))
    // //         }, 'pre/loan_detail_self')
    // //     }
    // // },
    // {
    //     //去出借 表单
    //     path: 'pre/loan_form',
    //     //onEnter: onGoLogin,
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/loan_form'))
    //         }, 'pre/loan_form')
    //     }
    // }, {
    //     //我的出借
    //     path: 'pre/loan_mine',
    //     //onEnter: onGoLogin,
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/loan_mine'))
    //         }, 'pre/loan_mine')
    //     }
    // }, {
    //     //马上申请
    //     path: 'pre/loan_apply',
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/loan_apply'))
    //         }, 'pre/loan_apply')
    //     }
    // }, {
    //     //申请成功
    //     path: 'pre/loan_apply_success',
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/loan_apply_success'))
    //         }, 'pre/loan_apply_success')
    //     }
    // }, {
    //     //申请成功
    //     path: 'pre/loan_info',
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/loan_info'))
    //         }, 'pre/loan_info')
    //     }
    // },{
    //     //下载列表
    //     path: 'pre/download',
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/download'))
    //         }, 'pre/download')
    //     }
    // },{
    //     //下载名片
    //     path: 'pre/business_card',
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/business_card'))
    //         }, 'pre/business_card')
    //     }
    // }, {
    //     //下载挂牌
    //     path: 'pre/signboard',
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/signboard'))
    //         }, 'pre/signboard')
    //     }
    // }, {
    //     //下载桌贴
    //     path: 'pre/desk_card',
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/desk_card'))
    //         }, 'pre/desk_card')
    //     }
    // }, {
    //     //产品详情
    //     path: 'pre/product_detail',
    //     //onEnter: onGoLogin,
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/product_detail'))
    //         }, 'pre/product_detail')
    //     }
    // }, {
    //     //关闭借条
    //     path: 'pre/send_close1',
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/send_close1'))
    //         }, 'pre/send_close1')
    //     }
    // }, {
    //     //产品详情
    //     path: 'pre/send_close2',
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/send_close2'))
    //         }, 'pre/send_close2')
    //     }
    // }, {
    //     //产品详情
    //     path: 'pre/send_close3',
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/send_close3'))
    //         }, 'pre/send_close3')
    //     }
    // }
    // {
    //     //产品详情
    //     path: 'pre/product_detail_other',
    //     //onEnter: onGoLogin,
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/product_detail_other'))
    //         }, 'pre/product_detail_other')
    //     }
    // }, {
    //     //产品详情
    //     path: 'pre/product_detail_self',
    //     //onEnter: onGoLogin,
    //     getComponent(nextState, callback) {
    //         require.ensure([], require => {
    //             callback(null, require('VIEW/pre/product_detail_self'))
    //         }, 'pre/product_detail_self')
    //     }
    // }
]