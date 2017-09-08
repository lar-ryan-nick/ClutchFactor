var webpack = require('webpack');
var path = require('path');

var APP_DIR = path.resolve(__dirname, 'client/jsx');
var BUILD_DIR = path.resolve(__dirname, 'client/js');

var config = {
	entry: APP_DIR + '/cart.jsx',
	output: {
		path: BUILD_DIR,
		filename: 'cart.js'
	},
	module : {
		loaders : [
			{
				test : /\.jsx?/,
				include : APP_DIR,
				loader : 'babel-loader'
		   	}
		]
	}
};

module.exports = config;
