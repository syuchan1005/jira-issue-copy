// eslint-disable-next-line import/no-extraneous-dependencies
import { merge } from 'webpack-merge';
// eslint-disable-next-line import/no-unresolved
import baseConfig from './webpack.config';

export default merge(baseConfig, {
  mode: 'development',
  devtool: 'hidden-source-map',
});
