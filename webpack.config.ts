import HtmlWebPackPlugin from 'html-webpack-plugin';
import path from 'path';
import Webpack from 'webpack';

const config: Webpack.Configuration = {
  name: 'react',
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
  },
  output: {
    path: __dirname + '/dist',
    publicPath: './',
    filename: 'app.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    hot: true,
    publicPath: '/',
  },
  plugins: [
    new HtmlWebPackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
    }),
  ],
};

export default config;
