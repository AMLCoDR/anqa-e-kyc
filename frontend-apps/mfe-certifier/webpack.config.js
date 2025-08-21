const { resolve } = require("path");

const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { EnvironmentPlugin } = require("webpack");
const { ModuleFederationPlugin } = require("webpack").container;
const { merge } = require('webpack-merge');

const { dependencies: deps } = require("./package.json");

module.exports = (env, argv) => {
    const stage = env.stage || 'dev';

    let modeConfig = {};
    if (argv.mode !== "production") {
        modeConfig = {
            devtool: "inline-source-map",
            devServer: {
                port: 3001,
                static: "./dist",
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
            ],
        },
        resolve: {
            extensions: [".js", ".mjs", ".jsx", ".css"],
            alias: { events: "events" },
        },
        plugins: [
            new ModuleFederationPlugin({
                name: "certifier",
                filename: "remoteEntry.js",
                exposes: {
                    "./Certifier": "./src/App/Certifier",
                    "./Service": "./src/Service",
                },
                shared: [
                    {
                        ...deps,
                        react: { singleton: true, eager: true, requiredVersion: deps.react },
                        "react-dom": { singleton: true, requiredVersion: deps["react-dom"] },
                        "@auth0/auth0-react": { singleton: true },
                        "@emotion/react": { singleton: true, requiredVersion: deps["@emotion/react"] },
                        "@emotion/styled": { singleton: true },
                        "@material-ui/core": { singleton: true },
                        "@material-ui/icons": { singleton: true },
                        "@material-ui/lab": { singleton: true },
                        "react-router-dom": { singleton: true },
                    },
                    // Workaround explanation: https://www.youtube.com/watch?v=-LNcpralkjM&t=540
                    "./src/Service",
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
            new CopyPlugin({
                patterns: [{ from: "public/logo-small.png", to: "" }],
            }),
        ],
    });
};