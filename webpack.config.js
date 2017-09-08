var webpack = require('webpack');
var path = require('path');

var APP_DIR = path.resolve(__dirname, 'client/jsx');
var BUILD_DIR = path.resolve(__dirname, 'client/js');

var config = {
	entry: {
		index: APP_DIR + '/index.jsx',
		merchandise: APP_DIR + '/merchandise.jsx',
		account: APP_DIR + '/account.jsx',
		product: APP_DIR + '/product.jsx',
		cart: APP_DIR + '/cart.jsx',
		checkout: APP_DIR + '/checkout.jsx'
	},
	output: {
		path: BUILD_DIR,
		filename: '[name].js'
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
