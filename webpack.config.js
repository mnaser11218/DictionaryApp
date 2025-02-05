const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js',  // Your entry point
  output: {
    filename: 'bundle.js',  // Output file name
    path: path.resolve(__dirname, 'dist'),  // Output directory
  },
  resolve: {
    extensions: ['.js', '.json'],  // Resolve file extensions
  },
  module: {
    rules: [
      {
        test: /\.js$/,  // Transpile JavaScript files (if needed)
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new Dotenv(),  // Use dotenv-webpack to load the .env variables
  ],
  node: {
    process: true,  // Ensure `process` is available in the browser
  },
};