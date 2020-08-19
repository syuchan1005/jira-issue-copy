/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WriteFilePlugin from 'write-file-webpack-plugin';
import sveltePreprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';

const fileExtensions = ['jpg', 'jpeg', 'png', 'gif', 'eot', 'otf', 'svg', 'ttf', 'woff', 'woff2'];

export default {
  context: path.normalize(path.join(__dirname, 'src')),
  entry: {
    popup: './js/popup.ts',

    // content scripts
    // getIssueData: './js/getIssueData.js',
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
        exclude: /node_modules/,
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
        exclude: /node_modules/,
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
    new CopyWebpackPlugin({
      patterns: [
        { from: 'img/*.png', flatten: true },
        'js/raw',
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
      template: 'popup.html',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new WriteFilePlugin(),
  ],
};
