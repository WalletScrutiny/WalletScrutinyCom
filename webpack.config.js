const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require('terser-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { spawn } = require("child_process");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, argv) => {
  const analyze = Boolean(env && env.analyze);

  return {
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
    entry: {
      // Do not change the order of the entries
      site_main: [
        './assets/js/_main.js',
      ],
      dom_sanitization: ['dompurify'],
      verifications_data: {
        import: [
          './src/verifications_utils.mjs',
        ],
        dependOn: ['dom_sanitization'],
      },
      share_ui: {
        import: [
          './src/renderShareButton.js',
          './src/renderNostrButton.js',
        ],
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
          './src/assets-table-profiles.js',
          './src/assets-table-endorsements.js',
          './src/assets-table-attachments.js',
          './src/assets-table-modal.js',
          './src/assets-table-hash.js',
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
      alias: {
        debug: path.resolve(__dirname, 'src/debug-stub.js'),
      },
      fallback: {
        path: require.resolve('path-browserify'),
        fs: false, // 'fs' is not supported in browsers, disable it
        zlib: false,
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

            if (analyze) {
              return;
            }

            if (argv.mode === 'development') {
              console.log("Launching Jekyll server...");

              spawn("bundle", [
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
            }
          });
        },
      },
      ...(analyze ? [new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: 'bundle-report.html',
      })] : []),
    ]
  }
};
