const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const autoprefixer = require('autoprefixer');
// const swiper = new Swiper(...);

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (ext) =>
  isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;
const filenamecss = (ext) =>
  isDev ? `style.${ext}` : `[name].[contenthash].${ext}`;
const filenameimg = (ext) =>
  isDev ? `[name]${ext}` : `[name].[contenthash]${ext}`;
const filenamefonts = (ext) => 
isDev ? `[name].${ext}` : `[name].${ext}`;

// const optimization = () => {
//   const configObj = {
//     splitChunks: 'all',
//   };

//   if (isProd) {
//     configObj.minimizer = [
//       new MiniCssExtractPlugin(),
//       new TerserWebpackPlugin(),
//     ];
//   }

//   return configObj;
// };

module.exports = {
  devServer: {
    historyApiFallback: true,
    static: path.resolve(__dirname, 'dist'),
    // contentBase: path.join(__dirname, 'dist'),
    open: {
      app: {
        name: 'chrome',
        arguments: [/*'--incognito'  ,*/ '--new-window' ],
      },
    },
    compress: true,
    hot: true,
    port: 3001,
  },

  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: './js/main.js',
  output: {
    filename: `./js/${filename('js')}`,
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    assetModuleFilename: `./img/${filenameimg('[ext]')}`,
    // assetModuleFilename: `./fonts/${filenamefonts('[ext]')}`,
    // assetModuleFilename: 'images/[hash][ext][query]',
  },
  // optimization: optimization(),
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `./css/${filenamecss('css')}`,
    }),
    // new MiniCssExtractPlugin({
    //   template: path.resolve(__dirname, `./css/${filenamecss('css')}`),
    //   filename: `./css/${filenamecss('css')}`,
    // }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
  ],
  devtool: isProd ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) => {
                return path.relative(path.dirname(resourcePath), context) + '/';
              },
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    autoprefixer({
                      overrideBrowserslist: ['ie >= 8', 'last 5 version'],
                    }),
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
        // type: 'asset/resource',
      },
      {
        test: /\.(?:|woff2|woff|eot|ttf|svg)$/i,
        // dependency: { not: ['url'] },
        // use: [
        //   {
        //     loader: 'file-loader',
        //     options: {
        //       name: `./fonts/${filenamefonts('[ext]')}`,
              
        //       // publicPath: '../',
        //       // dependency: { not: ['url'] },
        //     },
        //   },
        // ],
        type: 'asset/resource',
        generator: {
          filename: './assets/fonts/[name][ext]'
        } 
      },
      {
        test: /\.(?:|png|gif|jpg|jpeg|webp|svg)$/i,
        // dependency: { not: ['url'] },
        // use: [
        //   {
        //     loader: 'file-loader',
        //     options: {
        //       name: `./img/[name]/${filenameimg('[ext]')}`,
        //     },
        //   },
        // ],
        // type: 'javascript/auto'
        type: 'asset/resource',
        generator: {
          filename: `./assets/[path]${filenameimg('[ext]')}`
        } 
      },

    ],
  },
};
