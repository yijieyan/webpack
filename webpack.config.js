const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = env => {
    if (!env) {
        env = {}
    }
    let plugins=[
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({template: './app/views/index.html'}),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ];
    if(env.production){
        plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            }),
            new ExtractTextPlugin("style.css", {ignoreOrder: true}),
            new UglifyJsPlugin({sourceMap: true}) // todo UglifyJsPlugin 配合devtool一起实现sourceMap
        )
    }
    return {
        entry: ['./app/viewport.js', './app/js/main.js'],
        devtool: 'source-map',
        module: {
            loaders: [
                {
                    test: /\.html$/,
                    loader: 'html-loader'
                }, {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        cssModules: {
                            localIdentName: '[path][name]---[local]---[hash:base64:5]',
                            camelCase: true
                        },
                        extractCSS: true,
                        loaders: env.production?{ //todo 通过给css-loader传minimize参数压缩css
                            css: ExtractTextPlugin.extract({use: 'css-loader?minimize!px2rem-loader?remUnit=40&remPrecision=8', fallback: 'vue-style-loader'}),
                            scss: ExtractTextPlugin.extract({use: 'css-loader?minimize!px2rem-loader?remUnit=40&remPrecision=8!sass-loader', fallback: 'vue-style-loader'})
                        }:{
                            css: 'vue-style-loader!css-loader!px2rem-loader?remUnit=40&remPrecision=8',
                            scss: 'vue-style-loader!css-loader!px2rem-loader?remUnit=40&remPrecision=8!sass-loader'
                        } // todo px2rem-loader把px转换成rem更好的适配
                    }
                }, {
                    test: /\.scss$/,
                    loader: 'style-loader!css-loader!sass-loader'
                }
            ]
        },
        resolve: {
            extensions: [
                '.js', '.vue', '.json'
            ],
            alias: {
                'vue$': 'vue/dist/vue.esm.js'
            }
        },
        plugins,
        output: {
            filename: '[name].min.js',
            path: path.resolve(__dirname, 'dist')
        },
        devServer: {
            contentBase: path.resolve(__dirname, 'dist'),
            hot: true,
            compress: true,
            port: 8080,
            clientLogLevel: "none",
            host: '0.0.0.0',
            quiet: true
        },
    }
};
