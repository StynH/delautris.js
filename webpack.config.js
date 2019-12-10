const path = require('path');

module.exports = {
    watch: true,
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    module: {
    rules: [
        {
            test: /\.tsx?$/,
            use: 'babel-loader',
            exclude: /node_modules/,
        },
    ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    output: {
        filename: 'delautris.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        library: 'Delautris',
        umdNamedDefine: true
    },
};