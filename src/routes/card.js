
import Loadable from 'react-loadable'

//银行卡
export default [
    {    
        // 银行卡 
        path: '/card',
        component:Loadable({
            loader: () => import('VIEW/card/index'),
            loading: ()=>null
        })
    }, {
        // 绑定银行卡
        path: '/card/bind_card',
        component:Loadable({
            loader: () => import('VIEW/card/bind_card'),
            loading: ()=>null
        })
    }, {
        // 银行卡详情
        path: '/card/bank_detail',
        component:Loadable({
            loader: () => import('VIEW/card/bank_detail'),
            loading: ()=>null
        })
    }, {
        // 更改银行预留号码
        path: '/card/change_bankphone',
        component:Loadable({
            loader: () => import('VIEW/card/change_bankphone'),
            loading: ()=>null
        })
    }, {
        // 提现
        path: '/card/cash',
        component:Loadable({
            loader: () => import('VIEW/card/cash'),
            loading: ()=>null
        })
    }, {
        // 充值
        path: '/card/charge',
        component:Loadable({
            loader: () => import('VIEW/card/charge'),
            loading: ()=>null
        })
    }, {
        // 操作成功
        path: '/card/trade_success',
        component:Loadable({
            loader: () => import('VIEW/card/trade_success'),
            loading: ()=>null
        })
    }
    
    
]