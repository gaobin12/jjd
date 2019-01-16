const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const project = require('./project.config.js')
const ENV = process.env.NODE_ENV;

const SRC_DIR = path.join(project.basePath, project.srcDir)

const config = {
    entry: {
        app: [SRC_DIR]
    },
    output: {
        path      : path.resolve(project.basePath, project.outDir),
        filename  : '[name].js',
        chunkFilename: '[name].js',
        publicPath: project.publicPath
    },
    mode    : 'development',
    devtool : 'eval-source-map',
    resolve: {
        extensions: ['.js','.jsx', '.json', '.less','.css'],
        alias: {
            ASSET: path.join(SRC_DIR, 'assets'),
            COMPONENT: path.join(SRC_DIR, 'components'),
            MOBX: path.join(SRC_DIR, 'mobx'),
            ROUTE: path.join(SRC_DIR, 'routes'),
            SERVICE: path.join(SRC_DIR, 'services'),
            LESS: path.join(SRC_DIR, 'less'),
            VIEW: path.join(SRC_DIR, 'views')
        }
    },
    module : {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use : {
                    loader: 'babel-loader?cacheDirectory'
                },
                include: SRC_DIR,
                exclude: /node_modules/
            },
            {
                test    : /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader  : 'url-loader',
                options : {
                    limit     : 10000,
                    outputPath: "images"
                }
            }
        ]
    },
    optimization: {
        sideEffects: false,
        splitChunks: {
            chunks     :'all',
            minSize    : 30000,
            minChunks  : 1,
            cacheGroups: {
                common: {
                    name    : 'common',
                    test    : /node_modules/,
                    chunks  : 'initial',
                    priority: -10,
                    enforce : true
                },
                styles: {
                    name   : 'styles',
                    test   : /(\.less|\.css)$/,
                    chunks : 'all',
                    enforce: true,
                }
            }
        }
    },
    performance: {
        hints: false
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(ENV)
        }),
        new webpack.DllReferencePlugin({
            context : project.basePath,
            manifest: path.resolve(project.basePath, 'dll', 'manifest.json')
        }),
        new HtmlWebpackPlugin({
            templateParameters: {
                'name': JSON.stringify(ENV),
                'random': JSON.stringify(66)
            },
            template: './src/tmpl/index.ejs',
            favicon  : path.resolve('favicon.ico'),
            filename: "index.html", //生成的html存放路径，相对于 output.path
        }),
    ]
}

const fontLoader = [['woff', 'application/font-woff'], ['woff2', 'application/font-woff2'], ['otf', 'font/opentype'], ['ttf', 'application/octet-stream'], ['eot', 'application/vnd.ms-fontobject']]//, ['svg', 'image/svg+xml']
fontLoader.forEach((font) => {
    let extension = font[0]
    let mimetype = font[1]
    config.module.rules.push({
        test    : new RegExp(`\\.${extension}$`),
        loader  : 'url-loader',
        options : {
            name  : 'fonts/[name].[ext]',
            limit : 10000,
            mimetype,
        },
    })
})

config.module.rules.push({
    test: /(\.less|\.css)$/,
    use: [{
        loader : "style-loader"
    }, {
        loader : "css-loader"
    }, {
        loader : "less-loader",
        options: {
            javascriptEnabled: true
        }
    }]
})
config.entry.app.push(
    'webpack-hot-middleware/client?path=./__webpack_hmr'
)
config.plugins.push(
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin()
)

module.exports = config