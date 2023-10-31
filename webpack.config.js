const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	entry: './SmartAni.js',
	output: {
		filename: 'smartani_bundle.js',
		path: `${__dirname}/dist`,
	},
	module: {
	rules: [
		{
		test: /\.js$/,
		exclude: /node_modules/,
		use: {
			loader: 'babel-loader',
			options: {
				presets: ['@babel/preset-env'],
			},
		},
		},
	],
	},
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin()],
	}
};
