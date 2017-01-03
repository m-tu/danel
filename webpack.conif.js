var path = require('path');

const config = {
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'app.js'
	},
	module: {
		rules: [
			{test: /\.(js|jsx)$/, use: 'babel-loader'}
		]
	}
};

module.exports = config;