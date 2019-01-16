import Loadable from 'react-loadable'

//钱包
export default [
    {        
        //钱包
        path: '/wallet',
        component:Loadable({
            loader: () => import('VIEW/wallet/index'),
            loading: ()=>null
        })
    }
]