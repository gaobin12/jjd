/** 用于开发环境的服务启动 **/
const path = require("path"); // 获取绝对路径有用
const express = require("express"); // express服务器端框架
const env = process.env.NODE_ENV; // 模式（dev开发环境，production生产环境）

const webpack = require("webpack"); // webpack核心
const webpackDevMiddleware = require("webpack-dev-middleware"); // webpack服务器
const webpackHotMiddleware = require("webpack-hot-middleware"); // HMR热更新中间件
const webpackConfig = require("./webpack.local.config.js"); // webpack开发环境的配置文件
const proxyMiddleware = require('http-proxy-middleware');

const app = express(); // 实例化express服务
const DIST_DIR = webpackConfig.output.path; // webpack配置中设置的文件输出路径，所有文件存放在内存中
const PORT = 9001; // 服务启动端口号

if (env === 'local') {
	const compiler = webpack(webpackConfig); // 实例化webpack
	app.use(express.static("dll"));
	app.use(express.static(path.join(__dirname, "./src/assets")));
	app.use(
		webpackDevMiddleware(compiler, {
			// 挂载webpack小型服务器
			publicPath: webpackConfig.output.publicPath, // 对应webpack配置中的publicPath
			quiet: true, // 是否不输出启动时的相关信息
            stats: 'minimal'
		})
	);
	// 挂载HMR热更新中间件
	app.use(webpackHotMiddleware(compiler));
	app.use(proxyMiddleware('/api', {
		target: 'https://dev-h5.jinjiedao.com/',
		//target: 'https://qa-h5.jinjiedao.com/',
		//target: 'https://h5.jinjiedao.com/',
		changeOrigin: true,
		pathRewrite: {
			'^/api': '/'
		}
	}))
} else {
	// 如果是生产环境，则运行dist文件夹中的代码
	app.use(express.static("dist"));
}
/** 启动服务 **/
app.listen(PORT, () => {
	console.log("本地服务启动地址: http://localhost:%s", PORT);
});