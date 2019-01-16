
export default [
    {
        //关于我们
        path: '/about',
        component:Loadable({
            loader: () => import('VIEW/about/index'),
            loading: ()=>null
        })
    }
]