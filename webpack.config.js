const path = require('node:path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  // mode: 'development', // Disables minification
  // devtool: 'hidden-source-map', // Generates source maps without including in bundle
  optimization: {
    // minimize: false,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true, // Preserves class names
          keep_fnames: true, // Preserves function names
          compress: {
            defaults: true,
            unused: true,
          },
          mangle: true,
        },
      }),
    ],
  },

  target: 'node',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },

  node: {
    __filename: true,
    __dirname: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'esbuild-loader',
        options: {
          target: 'es2020',
        },
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  },
  externals: {
    'zlib-sync': 'commonjs2 ./src/lib/zlib-sync-polyfill.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'zlib-sync': path.resolve(
        __dirname,
        'node_modules/fflate/esm/browser.js',
      ),
    },
    fullySpecified: false,
    fallback: {
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util/'),
      buffer: require.resolve('buffer/'),
      zlib: require.resolve('browserify-zlib'),
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'package.json'),
          to: path.resolve(__dirname, 'build/package.json'),
          force: true,
        },
      ],
    }),
  ],
};
