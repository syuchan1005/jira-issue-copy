/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
// @ts-ignore
// eslint-disable-next-line no-unused-vars
import webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WriteFilePlugin from 'write-file-webpack-plugin';
import sveltePreprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import cssnano from 'cssnano';
import sass from 'sass';
import Fiber from 'fibers';

const fileExtensions = ['jpg', 'jpeg', 'png', 'gif', 'eot', 'otf', 'svg', 'ttf', 'woff', 'woff2'];

const config: webpack.Configuration = {
  context: path.normalize(path.join(__dirname, 'src')),
  entry: {
    popup: './popup/popup.ts',
    background: './background/background.ts',

    // content scripts
    // getIssueData: './js/getIssueData.js',
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.mjs', '.js', '.svelte'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: sass,
              sassOptions: {
                fiber: Fiber,
                includePaths: [
                  './node_modules',
                ],
              },
            },
          },
        ],
      },
      {
        test: new RegExp(`.(${fileExtensions.join('|')})$`),
        loader: 'file-loader?name=[name].[ext]',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: false,
            hotReload: false,
            preprocess: sveltePreprocess({
              postcss: {
                plugins: [
                  autoprefixer(),
                ],
              },
            }),
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].[id].css',
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: '../icons/*.png', flatten: true },
        'contentsScript/raw',
        {
          from: 'manifest.json',
          transform(content) {
            return Buffer.from(JSON.stringify({
              description: process.env.npm_package_description,
              version: process.env.npm_package_version,
              ...JSON.parse(content.toString()),
            }));
          },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: 'popup/popup.html',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new WriteFilePlugin(),
  ],
};

export default config;
