const webpack = require("webpack");
const TerserPlugin = require('terser-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

module.exports = {
  entry: {
    jquery: [
      './assets/js/_main.js',
      './assets/js/plugins/jquery.fitvids.js',
      './assets/js/plugins/jquery.greedy-navigation.js'
    ],
    attestation: [
      './src/attestation_utils.mjs',
      './src/assets-table.js'
    ]
  },
  output: {
    filename: '[name].bundle.min.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery'
    }),
    new WebpackShellPluginNext({
      onBuildStart: {
        scripts: [
          'printf "last_commit_ref: %s\\n" "$(git rev-parse HEAD)" > ./_data/git.yml',
          'printf "uncommited: %s\\n" "$(git status -s -b | tr \'\\n\' \'*\' | tr \'##\' \' \')" >> ./_data/git.yml'
        ],
        blocking: true
      }
    })
  ]
};
