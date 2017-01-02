var path = require('path');

const config = {
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'my-first-webpack.bundle.js'
	},
	module: {
		rules: [
			{test: /\.(js|jsx)$/, use: 'babel-loader'}
		]
	}
};

module.exports = config;

//
// module: {
// 	loaders: [
// 		{
// 			test: /\.js$/,
// 			exclude: /(node_modules|bower_components)/,
// 			loader: 'babel-loader',
// 			query: {
// 				presets: ['es2015']
// 			}
// 		}
// 	]
// }