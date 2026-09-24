const path = require('node:path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  // mode: 'development', // Desativa minificação
  // devtool: 'hidden-source-map', // Gera source maps sem incluir no bundle
  optimization: {
    // minimize: false,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true, // Preserva nomes de classes
          keep_fnames: true, // Preserva nomes de funções
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
      util: require.resolve('util/'),
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
