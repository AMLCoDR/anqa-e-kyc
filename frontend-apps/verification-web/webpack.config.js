const { resolve } = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { EnvironmentPlugin } = require("webpack");
const { ModuleFederationPlugin } = require("webpack").container;
const { merge } = require('webpack-merge');

const { dependencies: deps } = require("./package.json");
const remotesConfig = require("./remotes.js");

module.exports = (env, argv) => {
    const stage = env.stage || 'dev';
    const remotes = remotesConfig(stage);

    let modeConfig = {};
    if (argv.mode !== "production") {
        modeConfig = {
            devtool: "inline-source-map",
            devServer: {
                port: 3007,
                contentBase: "./dist",
                historyApiFallback: true,
            }
        }
    }

    return merge(modeConfig, {
        mode: argv.mode || "development",
        entry: "./src/index",
        output: {
            publicPath: "auto",
            filename: "[name].[contenthash].js",
            chunkFilename: "[name].[contenthash].js",
        },
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    type: "javascript/auto",
                    resolve: { fullySpecified: false },
                },
                {
                    test: /\.jsx?$/,
                    loader: "babel-loader",
                    exclude: /node_modules/,
                    options: { presets: ["@babel/preset-react"] },
                },
                {
                    test: /\.(png|jpe?g|gif)$/i,
                    use: [{ loader: 'file-loader' }],
                },
            ],
        },
        resolve: {
            extensions: [".js", ".mjs", ".jsx", ".css"],
            alias: { events: "events" },
        },
        plugins: [
            new ModuleFederationPlugin({
                name: "verification",
                filename: "remoteEntry.js",
                remotes: {
                    components: `components@${remotes.components}/remoteEntry.js`,
                    shell: `shell@${remotes.shell}/remoteEntry.js`,
                },
                exposes: {
                    "./Verification": "./src/Verification",
                },
                shared: [
                    {
                        ...deps,
                        react: { singleton: true, eager: true, requiredVersion: deps.react },
                        "react-dom": { singleton: true, requiredVersion: deps["react-dom"] },
                        "@material-ui/core": { singleton: true },
                        "@material-ui/styles": { singleton: true },
                        "react-router-dom": { singleton: true },
                    },
                ],
            }),
            new HtmlWebpackPlugin({
                template: resolve(__dirname, 'public/index.html'),
                favicon: resolve(__dirname, 'public/favicon.ico'),
                filename: './index.html',
                inject: true
            }),
            new EnvironmentPlugin({
                REACT_APP_STAGE: stage,
            }),
        ],
    });
};