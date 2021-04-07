// Import Webpack npm module
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = {
  // Which file is the entry point to the application
  entry: './src/index.js',

  // Which file types are in our project, and where they are located
  resolve: {
    extensions: ['.js', '.jsx']
  },

  output: {
    path: path.resolve(__dirname),
    filename: 'bundle.js',
    libraryTarget: 'umd'
  },

  devServer: {
    historyApiFallback: true,
    contentBase: './',
    hot: true,
   // contentBase: path.resolve(__dirname) + '/src/',
    proxy: {
      '/api': 'http://localhost:8080',
      '/datarest': 'http://localhost:8080'
    },
    compress: true,
    port: 9000,
    host: 'localhost',
    open: true,
    before: (app) => {
      app.get('/api/persons', (req, res) => res.send([
        {id: '1', name: 'Привяу'}
      ]));
    }
  },
  devtool: '#source-map',
  module: {
    // How to process project files with loaders
    loaders: [
      // Process any .js or .jsx file with Babel
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}
