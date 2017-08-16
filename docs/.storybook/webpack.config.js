const path = require("path");
const webpack = require("webpack");

module.exports = {
    resolve: {
        modules: [ path.resolve(__dirname, "../node_modules/"), "node_modules" ]
    },

    plugins: [
        new webpack.ProvidePlugin({
            React: "react",
            ReactDom: "react-dom"
        }),
    ],

    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: [
                    { loader: "style-loader" },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            localIdentName: "[name]-[local]-[hash:base64:8]"
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            outputStyle: "expanded",
                            sourceMap: true,
                            sourceMapContents: true
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },

            {
                test: /\.jsx?$/,
                include: [
                    path.join(__dirname, "../../components"),
                    path.join(__dirname, "../../libs"),
                    path.join(__dirname, "../../helpers")
                ],
                loader: "babel-loader"
            },


            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [{
                    loader: "url-loader",
                    options: {
                        name: "[name].[hash].[ext]",
                        limit: 10000
                    }
                }]
            },

            {
                test: /\.(ttf|eot|woff2?)$/,
                use: [{
                    loader: "file-loader",
                    // options: {
                    //     prefix: "font/"
                    // }
                }]
            },
        ]
    }
};
