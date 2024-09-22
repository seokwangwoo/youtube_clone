import path from "path";
import webpack from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const config: webpack.Configuration = {
  mode: "production",
  entry: {
    main: "./src/client/ts/main.ts",
    videoPlayer: "./src/client/ts/videoPlayer.ts",
  },
  watch: true,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].js",
    clean: true,
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
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
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};

export default config;
