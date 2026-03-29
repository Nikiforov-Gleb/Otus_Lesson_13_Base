const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const NODE_ENV = process.env.NODE_ENV;
const PREFIX = "/Otus_Lesson_13_Base/";

module.exports = {
  entry: {
    index: "./src/index.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: NODE_ENV === "production" ? PREFIX : "/",
    clean: true,
  },
  devServer: {
    compress: true,
    port: 9000,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "404.html",
    }),
    new webpack.DefinePlugin({
      PRODUCTION: NODE_ENV == "production",
      PREFIX: JSON.stringify(PREFIX),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
