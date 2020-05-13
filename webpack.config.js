var path = require('path');
var webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const glob = require('glob');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const extractSass = new ExtractTextPlugin({
    filename: "../../../css/style.min.css"
});

var NODE_ENV = process.env.NODE_ENV;
console.log("RUN[" + NODE_ENV + "]");

var plugins;
var isWatching = false;
var source_map = '';

switch (NODE_ENV){
    case 'develop':
        isWatching = true;
        source_map = '';//'source-map';
        plugins = [
            //new UglifyJsPlugin(),
            extractSass
        ];
        break;
    case 'production':
        isWatching = false;
        source_map = '';
        plugins = [
            new UglifyJsPlugin(),
            extractSass
        ];
        break;
}


module.exports = {
    entry: glob.sync('./js/es6/src/*/*.js').reduce((entries, entry) => Object.assign(entries, {[entry.replace('js/es6/src', '').replace('.js', '')]: entry }), {}),
output: {
        path: path.resolve(__dirname + "/js/es6/builds_js", ''),
        filename: '[name].js',
        publicPath: '/'
},
module: {
        rules: [
            {
                test: /\.mustache$/,
                loader: 'mustache-loader'
                // loader: 'mustache-loader?minify'
                // loader: 'mustache-loader?{ minify: { removeComments: false } }'
                // loader: 'mustache-loader?noShortcut'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.js/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: { presets: ["es2015"] }
                    }
                ]
            },
            {
                test: /\.woff2?$|\.ttf$|\.eot$|\.svg$|\.png|\.jpe?g|\.gif$/,
                use: [
                    {
                        loader: 'url-loader'
                    }
                ]
            },

            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            minimize: true
                        }
                    }, {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                            minimize: true
                        }
                            
                    }],
                    fallback: "style-loader"
                })
            }
        ]
},
stats: {
        colors: true
},
devtool: source_map,
    watch: isWatching,
plugins: plugins
};