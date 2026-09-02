const path = require("path");
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
        './assets/js/ui-components.js',
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
          './src/drag-and-drop-utils.mjs',
          './src/blossom.mjs',
          './src/blossom-utils.mjs',
          './src/drag-and-drop.js',
          './src/assets-table-utils.mjs',
          './src/assets-table-comments.mjs',
          './src/assets-table-state.mjs',
          './src/assets-table-filters.mjs',
          './src/assets-table-paint.mjs',
          './src/assets-table-profiles.js',
          './src/assets-table-endorsements.mjs',
          './src/assets-table-attachments.mjs',
          './src/assets-table-modal.mjs',
          './src/assets-table-hash.mjs',
          './src/assets-table.js',
          './src/preview-button.js',
          './src/renderShareButton.js',
          './src/renderNostrButton.js',
          './src/zapModal.mjs'
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
        // app-info-parser's zip.js has a `require('path')` call, but only in its
        // Node-only branch (guarded by isBrowser()) — dead code in this bundle,
        // so we don't need a real polyfill, just tell webpack not to error on it.
        path: false,
        fs: false, // 'fs' is not supported in browsers, disable it
        zlib: false,
      },
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
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
      new HtmlWebpackPlugin(
        {
          template: 'src/templates/scripts.html',
          filename: 'scripts.html',
          inject: false
        }
      ),
      new HtmlWebpackPlugin(
        {
          template: 'src/templates/homepage-preloads.html',
          filename: 'homepage-preloads.html',
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
            'mv dist/homepage-preloads.html _includes/homepage-preloads.html 2>/dev/null || true',
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
