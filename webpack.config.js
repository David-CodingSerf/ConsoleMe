const webpack = require('webpack'); //to access built-in plugins
module.exports = {
  entry: './index.js',
  output: {
    filename: './dist/consoleme.min.js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
}