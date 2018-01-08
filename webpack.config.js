const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const glob = require('glob');
const PurifyCSSPlugin = require("purifycss-webpack");
const CleanWebpackPlugin = require('clean-webpack-plugin');


module.exports = {
	entry: {
		entry: './src/js/index.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
        publicPath: '../'
    },
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.css$/,
				// use: ['style-loader', 'css-loader', 'postcss-loader'] //css和js打包在一起的时候用
                use: ExtractTextPlugin.extract({  //css和js分开的时候用
                    fallback: "style-loader",
                    use: ["css-loader", "postcss-loader"] //根据can i use 自动添加前缀
                })
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192,
                            outputPath: 'imgs/'
						}
					}
				]
			},
			{
				test: /\.(htm|html)$/i,
				loader: 'html-withimg-loader' //解决img标签无法直接引用图片
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		// new UglifyJsPlugin(), //生产环境压缩js代码
		new HtmlWebpackPlugin({
			template: './src/index.html',  //html模板
            minify: {
                removeAttributeQuotes: true  //去掉html中的引号
			},
            hash: true //script引入的js加入hash，防止缓存
		}),
        new ExtractTextPlugin("css/styles.css"),
		new PurifyCSSPlugin({
			paths: glob.sync(path.join(__dirname, './src/*.html'))
		})
	],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
		host: 'localhost',
        port: 9000
    }
};