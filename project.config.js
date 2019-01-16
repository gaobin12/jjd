
module.exports = {
    //env        : NODE_ENV,
    basePath   : __dirname,
    srcDir     : 'src',
    outDir     : 'dist',
    publicPath : '/',
    //sourceMap  : NODE_ENV == 'development' ? true : false,
    externals  : {},
    vendor     : [
        'classnames','prop-types','react','react-dom',
        'react-loadable','mobx-react','react-router-dom','mobx',
        'react-tappable','rc-form','antd-mobile'
    ]
}
