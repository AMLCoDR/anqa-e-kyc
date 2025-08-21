const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

/**
 * Webpack Configuration for eKYC Testing Suite
 * Optimized for testing frontend applications and build validation
 */

module.exports = (env = {}, argv = {}) => {
  const isProduction = argv.mode === 'production';
  const isDevelopment = !isProduction;

  return {
    mode: argv.mode || 'development',
    
    // Entry points for testing different frontend apps
    entry: {
      'test-runner': './test-webpack-runner.js',
      'validation-tests': './webpack-validation-tests.js'
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      chunkFilename: isProduction ? '[name].[contenthash].chunk.js' : '[name].chunk.js',
      clean: true,
      publicPath: '/'
    },

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        '@': path.resolve(__dirname, '../frontend-apps'),
        '@customer': path.resolve(__dirname, '../frontend-apps/customer-web'),
        '@certifier': path.resolve(__dirname, '../frontend-apps/mfe-certifier'),
        '@org': path.resolve(__dirname, '../frontend-apps/organisation-web'),
        '@verification': path.resolve(__dirname, '../frontend-apps/verification-web'),
        '@remitter': path.resolve(__dirname, '../frontend-apps/remitter-ux'),
        '@website': path.resolve(__dirname, '../frontend-apps/website')
      }
    },

    module: {
      rules: [
        // JavaScript/TypeScript files
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    browsers: ['> 1%', 'last 2 versions']
                  },
                  modules: false
                }]
              ]
            }
          }
        },

        // CSS files
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: {
                  auto: true,
                  localIdentName: isDevelopment 
                    ? '[name]__[local]__[hash:base64:5]'
                    : '[hash:base64]'
                }
              }
            }
          ]
        },

        // Asset files
        {
          test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name].[hash][ext]'
          }
        }
      ]
    },

    plugins: [
      // Generate HTML file for testing
      new HtmlWebpackPlugin({
        template: './test-template.html',
        filename: 'index.html',
        inject: true,
        minify: isProduction ? {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        } : false
      }),

      // Compression for production
      ...(isProduction ? [
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 8192,
          minRatio: 0.8
        })
      ] : [])
    ],

    optimization: {
      minimize: isProduction,
      minimizer: isProduction ? [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true
            },
            mangle: true,
            format: {
              comments: false
            }
          },
          extractComments: false
        })
      ] : [],

      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },

    devtool: isDevelopment ? 'eval-source-map' : 'source-map',

    devServer: {
      static: {
        directory: path.join(__dirname, 'dist')
      },
      port: 3200,
      hot: true,
      open: false,
      historyApiFallback: true,
      compress: true,
      client: {
        overlay: {
          errors: true,
          warnings: false
        }
      }
    },

    // Performance hints
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },

    // Stats configuration
    stats: {
      preset: 'minimal',
      moduleTrace: true,
      errorDetails: true
    }
  };
};
