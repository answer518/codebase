var path = require('path');
module.exports = {
    entry: "./src/index.js",
    output: {
        path: __dirname,
        filename: "app.js"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            query: {
                presets: ['es2015']
            }
        }]
    }
}
