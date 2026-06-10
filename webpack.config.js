const webpack = require("webpack");
const TerserPlugin = require('terser-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { spawn } = require("child_process");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, argv) => {
  return {
    devtool: 'source-map',
    entry: {
      // Do not change the order of the entries
      jquery: [
        './assets/js/_main.js',
        './assets/js/plugins/jquery.fitvids.js',
        './assets/js/plugins/jquery.greedy-navigation.js'
      ],
      dom_sanitization: ['dompurify'],
      verifications_data: {
        import: [
          './src/verifications_utils.mjs',
        ],
        dependOn: ['dom_sanitization'],
      },
      verifications_ui: {
        import: [
          './src/drag-and-drop-utils.js',
          './src/blossom.js',
          './src/blossom-utils.js',
          './src/drag-and-drop.js',
          './src/assets-table-utils.js',
          './src/assets-table-comments.js',
          './src/assets-table-state.js',
          './src/assets-table-filters.js',
          './src/assets-table-paint.js',
          './src/assets-table-attachments.js',
          './src/assets-table-modal.js',
          './src/assets-table.js',
          './src/preview-button.js',
          './src/renderShareButton.js',
          './src/renderNostrButton.js',
          './src/zapModal.js'
        ],
        dependOn: ['dom_sanitization', 'verifications_data'],
      },
      font_awesome: [
        './src/font-awesome.js'
      ]
    },
    output: {
      filename: argv.mode === 'production' ? '[name].[contenthash].bundle.min.js' : '[name].bundle.min.js',
    },
    resolve: {
      fallback: {
        path: require.resolve('path-browserify'),
        fs: false, // 'fs' is not supported in browsers, disable it
        zlib: false,
        util: require.resolve('util/'),
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert'),
        process: require.resolve('process/browser'),
      },
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
      usedExports: true
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery',
        process: 'process/browser',
      }),
      new HtmlWebpackPlugin(
        {
          template: 'src/templates/scripts.html',
          filename: 'scripts.html',
          inject: false
        }
      ),
      new WebpackShellPluginNext({
        onBuildStart: {
          scripts: [
            'echo "Creating git.yml file..."',
            'printf "last_commit_ref: %s\\n" "$(git rev-parse HEAD)" > ./_data/git.yml',
            'printf "uncommited: %s\\n" "$(git status -s -b | tr \'\\n\' \'*\' | tr \'##\' \' \')" >> ./_data/git.yml',
          ],
          blocking: true
        },
        onAfterDone:  {
          scripts: [
            'mv dist/scripts.html _includes/scripts.html 2>/dev/null || true',
          ],
          blocking: false,
          parallel: false
        }
      }),
      {
        apply: (compiler) => {
          let firstRun = true;
  
          compiler.hooks.done.tap("RunJekyllFirstBuild", () => {
            if (!firstRun) return;
            firstRun = false;

            if (argv.mode === 'development') {
              // Development build: just launch jekyll server
              console.log("🚀 Launching Jekyll server...");
    
              const jekyll = spawn("bundle", [
                "exec",
                "jekyll",
                "serve",
                "--profile",
                "--trace",
                "--host=localhost",
                "--config",
                "_config.yml,_config.dev.yml",
                "--incremental",
              ], {
                stdio: "inherit",
                shell: true
              });
            } else {
              // Production build: build jekyll and then compress
              spawn("bundle", [
                "exec",
                "jekyll",
                "build",
              ], {
                stdio: "inherit",
                shell: true
              });
            }
          });
        },
      },
      // new BundleAnalyzerPlugin()
    ]
  }
};
