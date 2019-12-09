const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode:'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/js/',//表示在引入静态资源时，从根路径开始引入https://blog.csdn.net/httguangtt/article/details/84847582
  },
  devServer: {
    open:true,//更多配置查看https://webpack.js.org/configuration/dev-server/#
    port:6868,
    host: '127.0.0.1',
    hot: true,
    historyApiFallback: true,
    contentBase: 'dist'
  },
  module:{
    rules:[
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.jpg|png|gif|bmp$/, use: [
        {
          loader: "url-loader",
          options: {
            name: "[hash:8]-[name].[ext]",
            limit: 7631, // size <= 7KB
            publicPath: "./images/",
            outputPath: "./images/"
          } 
        }
      ]
     },
      { test: /\.vue$/, use: 'vue-loader' }, 
      { test: /\.ttf|woff|woff2|eot|svg$/, use: 'url-loader' } 
    ]
  },
  plugins:[
    new VueLoaderPlugin(),
  ]
};