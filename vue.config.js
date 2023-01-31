const { defineConfig } = require("@vue/cli-service");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const JsonMinimizerPlugin = require("json-minimizer-webpack-plugin");
const path = require("path");
const pages = require("./pages");
const { DefinePlugin } = require("webpack");
const fs = require("fs");
const profile = process.env["NODE_ENV"];
console.log(`build for ${profile}..`);
function getFiles(dir) {
  return fs.readdirSync(dir).flatMap((item) => {
    const path = `${dir}/${item}`;
    if (fs.statSync(path).isDirectory()) {
      return getFiles(path);
    }

    return path;
  });
}
const getSupportedLanguages = () => {
  return getFiles("_locales").map((path) => {
    const messages = JSON.parse(fs.readFileSync(path).toString());
    return {
      label: messages["app_language"]["message"],
      key: path.split("/")[1],
    };
  });
};
module.exports = defineConfig({
  transpileDependencies: true,
});
module.exports = {
  pages,
  filenameHashing: false,
  configureWebpack: {
    devtool: "source-map",
    plugins: [
      new DefinePlugin({
        __SUPPORTED_LANGUAGES__: JSON.stringify(getSupportedLanguages()),
        __DATE_FORMAT_STRING__: JSON.stringify("yyyy-MM-dd"),
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve("manifest.json"),
            to: `${path.resolve("dist")}/manifest.json`,
          },
          {
            from: path.resolve("_locales"),
            to: `${path.resolve("dist")}/_locales`,
          },
        ],
      }),
    ],
    optimization: {
      minimize: profile.startsWith("prod"),
      minimizer: [new JsonMinimizerPlugin()],
    },
  },
};
