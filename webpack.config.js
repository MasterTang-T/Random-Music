const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin } = require('clean-webpack-plugin');
const {
    VueLoaderPlugin
} = require('vue-loader');

// 配置
const config = {
    mode: process.env.NODE_ENV,
    context: __dirname + '/src', // base path
    entry: {
        'popup/index': './popup/index.js',
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.js', '.vue'],
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loaders: 'vue-loader',
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.sass$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader?indentedSyntax'],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: '../icons/',
                    emitFile: false,
                    esModule:false,
                },
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: '/fonts/',
                    emitFile: false,
                    esModule:false,
                },
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            global: 'window',
          }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin([{
                from: 'icons',
                to: 'icons',
                ignore: ['icon.xcf']
            },
            {
                from: 'popup/popup.html',
                to: 'popup/popup.html',
                ignore: []
            },
            {
                from: 'background.js',
                to: 'background.js',
                ignore: []
            },
            {
                from: 'jquery.js',
                to: 'jquery.js',
                ignore: []
            },
            {
                from: 'manifest.json',
                to: 'manifest.json',
                // transform: (content) => {
                //   const jsonContent = JSON.parse(content);
                //   jsonContent.version = version;

                //   if (config.mode === 'development') {
                //     jsonContent['content_security_policy'] = "script-src 'self' 'unsafe-eval'; object-src 'self'";
                //   }
                //   return JSON.stringify(jsonContent, null, 2);
                // },
                ignore: []
            },
        ]),
    ]
}

module.exports = config;