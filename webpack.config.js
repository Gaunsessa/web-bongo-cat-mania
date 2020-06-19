module.exports = {
    entry: './src/app/app.ts',
    output: {
        path: __dirname + '/public',
        filename: 'build/bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            { test: /\.ts?$/, loader: 'ts-loader' }
        ]
    }
}