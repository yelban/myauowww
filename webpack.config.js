const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const env = process.env.NODE_ENV || 'development';
const target = process.env.TARGET || 'web';

module.exports = {

  mode: env,

  target: env === 'development' ? 'web' : 'browserslist',

  entry: {
    index: path.resolve(__dirname, './src/public/js/index.js'),
    ie: path.resolve(__dirname, './src/public/js/ie.js'),
    popular: path.resolve(__dirname, './src/public/js/popular.js'),
    scroll: path.resolve(__dirname, './src/public/js/scroll.js'),
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    clean: true,
  },

  // devtool: env === 'production' ? 'source-map' : 'eval',

  devServer: {
    hot: true,
    open: ['/?env=dev'],
    compress: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        // exclude: /node_modules/,
        exclude: /node_modules\/(?!(dom7|swiper|abscroll(\w)?|whatwg-.*)\/).*/,
        // include: [/whatwg-.*/],
        use: [
          {
            loader: ('babel-loader'),
            // loader: require.resolve('babel-loader'),
          },
        ],
      },
      {
        test: /\.css$/i,
        // exclude: /\.\/css\/ie\.css$/i,
        use: [
          (env === 'development' ? 'style-loader' : {
            loader: MiniCssExtractPlugin.loader,
            // options: {
            //   publicPath: path.resolve(__dirname, './dist/css/'),
            // },
          }),
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, 'postcss.config.js'),
                // plugins: [
                //     [
                //         "postcss-import", {}
                //     ],
                //     [
                //         "postcss-preset-env",
                //         {
                //             browsers: [
                //                 'last 2 versions',
                //                 'ie > 10',
                //             ],
                //             // stage: 0,
                //         },
                //     ],
                // ],
              },
            },
          },
        ],
      },
      {
        test: /\.(sa|sc)ss$/i,
        use: [
          (env === 'development' ? 'style-loader' : {
            loader: MiniCssExtractPlugin.loader,
            // options: {
            //   publicPath: '../',
            // },
          }),
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, 'postcss.config.js'),
              },
            },
          },
          {
            loader: 'sass-loader',
            // options: {
            //   sassOptions: {
            //     indentWidth: 2,
            //   }
            // },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        // type: 'asset/resource',
        type: 'asset',
        generator: {
          filename: 'assets/pic/[name]_[hash:6][ext][query]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 1 * 1024, // 1kb
          },
        },
        // loader: 'url-loader',
        // options: {
        //   limit: 1000,
        //   name: 'assets/pic/[name].[ext]',
        // },
        // type: 'javascript/auto',
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        // options: {
        //   sources: env === 'production' ? {
        //     urlFilter: (attribute, value, resourcePath) => {
        //       // The `attribute` argument contains a name of the HTML attribute.
        //       // The `value` argument contains a value of the HTML attribute.
        //       // The `resourcePath` argument contains a path to the loaded HTML file.

        //       if (/(popular|ie|index)\.css$/.test(value)) {
        //         return false;
        //       }

        //       return true;
        //     },
        //   } : {},
        // },
      },
    ],
  },

  plugins: [

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
      'process.env.TARGET': JSON.stringify(target),
    }),

    new webpack.ProgressPlugin(),

    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),

    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './src/public/index.html',
      inject: 'body',
      excludeChunks: env === 'production' ? ['ie', 'popular', 'scroll'] : ['ie'],
      minify: env === 'production' ? {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: false,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      } : false,
    }),
  ],

  optimization: {
    // Webpack enable CSS optimization only in production mode
    // If you want to run it also in development set the optimization.minimize option to true
    // minimize: true,
    minimizer: (env === 'production') ? [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          compress: {
            // drop_console: true,
          },
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ] : [],
    runtimeChunk: (env === 'production') ? false : 'single',
  },

};
