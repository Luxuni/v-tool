const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  experiments: {
    outputModule: true,
  },
  optimization: {
    minimize: true, // 关闭代码压缩，可选
  },
  mode: 'development', // 环境
  entry: './lib/index.ts', // 入口文件
  output: {
    path: path.resolve(__dirname, './dist'), // 输出文件夹
    filename: 'index.js', // 文件名称
    library: {
      type: 'module',
    },
    globalObject: 'this', // 全局对象
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/, //规则生效的文件
        use: {
          loader: 'ts-loader', //要使用的loader
        },
        exclude: /node_modules/, //编译排除的文件
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // 清除上一次打包内容
  ],
  externals: {
    vue: 'vue',
    gsap: 'gsap',
    lodash: 'lodash',
    echarts: 'echarts',
  },
};
