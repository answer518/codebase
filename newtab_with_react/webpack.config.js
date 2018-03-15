var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var plugins = [
    // new webpack.optimize.CommonsChunkPlugin({
    //     name: "vendor",//和配置的入口对应
    //     minChunks: 2,
    // }),
    new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html') // Load a custom template
    }),
]

module.exports = {
    entry: {
        // 'babel-polyfill',
        app: [
            'babel-polyfill',
            './src/main'
        ],
    },
    output: {
        path: __dirname + "/build",
        filename: "bundle.js"
    },
    devtool: 'eval-source-map',
    plugins,
    module: {
        loaders: [
            { test: /\.json$/, loader: "json" },
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel', query: { presets: ['es2015', 'react', 'stage-0'] } },
            { test: /\.css$/, loader: 'style!css?modules!postcss' },
            //配置file-loader，加载图片，字体资源
            { test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=50000&name=[path][name].[ext]' }
        ]
    },
    postcss: [
        require('autoprefixer') //调用autoprefixer插件
    ],
    devServer: { //webpack-dev-server配置热更新以及跨域
        //historyApiFallback: true, //不跳转
        //noInfo: true,
        //inline: true, //实时刷新
        port: '8080',  //不指定固定端口
        hot: true,
        // proxy: {
        //     '/list': {
        //         target: 'http://lol.qq.com/web201310/js/videodata/LOL_VIDEOLIST_IDX3.js',
        //         pathRewrite: { '^/list': '' },
        //         changeOrigin: true,
        //         secure: false
        //     }
        // }
    },
};
