const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: "production",

    // output: {
    //     path: path.resolve(__dirname, 'dist/js')
    // },
    // Enable sourcemaps for debugging webpack's output.
    // devtool: "source-map",
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 3000,
        historyApiFallback: true,
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".js", ".ts", ".tsx"]
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            // {
            //     test: /\.html$/i,
            //     loader: 'html-loader',
            // },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            // {
            //     enforce: "pre",
            //     test: /\.js$/,
            //     loader: "source-map-loader"
            // }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.API_ENDPOINT': JSON.stringify(process.env.API_ENDPOINT),
            'process.env.CLIENT_ID': JSON.stringify(process.env.CLIENT_ID),
            'process.env.DOMAIN': JSON.stringify(process.env.DOMAIN),
            'process.env.REDIRECT_URI': JSON.stringify(process.env.REDIRECT_URI)
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            hash: true,
            base: '/',
            title: "NoteTaker",
            template: "./src/index.html",
            filename: 'index.html', //relative to root of the application
            devServer: 3000,
        })
    ],
    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    }
};