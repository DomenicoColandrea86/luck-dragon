'use strict';

// Modules
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function makeWebpackConfig (options) {
  /**
   * Environment type
   * BUILD is for generating minified builds
   */
  var BUILD = !!options.BUILD;

  /**
   * Config
   * This is the object where all configuration gets set
   */
  var config = {};

  /**
   * Entry
   */
  config.entry = {
    app: ['webpack-hot-middleware/client?reload=true', path.join(__dirname, 'client/index.js')]
  }

  /**
   * Output
   */
  config.output = {
    // Absolute output directory
    path: BUILD ? path.join(__dirname, 'dist/') : __dirname,

    // Output path from the view of the page
    publicPath: BUILD ? '/' : 'http://localhost:4242/',

    // Filename for entry points
    // Only adds hash in build mode
    filename: BUILD ? '[name].[hash].js' : '[name].bundle.js',

    // Filename for non-entry points
    // Only adds hash in build mode
    chunkFilename: BUILD ? '[name].[hash].js' : '[name].bundle.js'
  }

  /**
   * Devtool
   * Type of sourcemap to use per build type
   */
  if (BUILD) {
    config.devtool = 'source-map';
  } else {
    config.devtool = 'eval-source-map';
  }

  /**
   * Loaders
   * This handles most of the magic responsible for converting modules
   */

  // Initialize module
  config.module = {
    preLoaders: [],
    loaders: [{
      // JS LOADER
      // Transpile .js files using babel-loader
      // Compiles ES6 and ES7 into ES5 code
      test: /\.js$/,
      loader: 'babel?optional=runtime',
      exclude: /node_modules/
    }, {
      // ASSET LOADER
      // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
      // Rename the file using the asset hash
      // Pass along the updated reference to your code
      // You can add here any file extension you want to get copied to your output
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
      loader: 'file'
    }, {
      // HTML LOADER
      // Allow loading html through js
      test: /\.html$/,
      loader: 'raw'
    }, {
      // SASS/SCSS LOADER
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
    }]
  };

  // CSS LOADER
  // Allow loading css through js
  //
  // Postprocess your css with PostCSS plugins
  var cssLoader = {
    test:   /\.css$/,
    loader: "style-loader!css-loader!postcss-loader"
  };

  // Add cssLoader to the loader list
  config.module.loaders.push(cssLoader);

  /**
   * sassLoader
   */
  config.sassLoader = {
    includePaths: [path.resolve(__dirname, './client')]
  }

  /**
   * PostCSS
   * Add vendor prefixes to your css
   */
  config.postcss = [
    autoprefixer({
      browsers: ['last 2 version']
    })
  ];

  /**
   * Plugins
   */
  config.plugins = [
    new ExtractTextPlugin('[name].[hash].css', {
      disable: !BUILD
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ];

  // Render index.html
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: './client/index.html',
      inject: 'body',
      minify: BUILD
    }));

  // Add build specific plugins
  if (BUILD) {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin()
    )
  } else {
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    })
  }

  // Workaround https://github.com/Reactive-Extensions/RxJS/issues/832, until it's fixed
  config.resolve = {
    alias: {
      'rx$': path.join(__dirname, 'node_modules/rx/dist/rx.min.js')
    }
  }

  return config;
};
