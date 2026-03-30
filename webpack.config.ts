import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";

module.exports = (env: Record<string, string | undefined>) => {
  const NODE_ENV = env.NODE_ENV || "development";
  const PREFIX = "/Otus_Lesson_13_Base/";

  return {
    mode: NODE_ENV === "production" ? "production" : "development",
    entry: {
      index: "./src/index.ts",
    },
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: NODE_ENV === "production" ? PREFIX : "/",
      clean: true,
    },
    resolve: {
      extensions: [".js", ".ts"],
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
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
  };
};
