const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');

// variables
const isProduction = process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV === 'production';
const sourcePath = path.join(__dirname, './src');
const outPath = path.join(__dirname, './dist');

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// env
const env = dotenv.config().parsed;
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
  entry: {
    index: ["babel-polyfill", "./src/index.tsx"]
  },
  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].[chunkhash].js",
    path: outPath,
    publicPath: '/'
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre", test: /\.js$/,
        loader: "source-map-loader",
        exclude: [
          /node_modules/,
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: true,
          },
        },
      },
      {
        test: /\.(svg|jpg|jpeg|png|gif)$/,
        use: {
          loader: 'file-loader'
        },
      }
    ]
  },
  devServer: {
    historyApiFallback: {
      disableDotRule: true
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './resources/index.html',
      filename: './index.html',
      hash: true,
      chunksSortMode: "none"
    }),
    new CopyWebpackPlugin([
      { from: './resources/sw.js', to: './' }
    ]),
    new CopyWebpackPlugin([
      { from: './resources/favicon.ico', to: './' }
    ]),
    new webpack.DefinePlugin({
      ...envKeys,
      apiUrl: JSON.stringify('https://api.poolc.org/graphql'),
      permissions: JSON.stringify({
        "ADMIN": ["ADMIN", "MEMBER", "PUBLIC"],
        "MEMBER": ["MEMBER", "PUBLIC"],
        "PUBLIC": ["PUBLIC"]
      }),
      uploadUrl: JSON.stringify('https://api.poolc.org/files'),
      logoUrl: JSON.stringify('https://api.poolc.org/files/poolc-logo.png')
    })
  ]
};
