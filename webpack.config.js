const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = (env) => {
  const NODE_ENV = env.NODE_ENV || "development";
  const PREFIX = "/Otus_Lesson_13_Base/";

  return {
    mode: NODE_ENV === "production" ? "production" : "development",
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
};
