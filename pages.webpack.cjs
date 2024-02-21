const path = require('path');
// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

/* need to install:

npm i --save-dev webpack-cli 
npm i --save-dev node-polyfill-webpack-plugin stream-browserify

*/


module.exports = [{
	entry: './client-js/pages.mjs',
	mode: 'development',
	"devtool": 'source-map',
	experiments: {
		outputModule: true,
	},
	output: {
		filename: 'pages.js',
		path: path.resolve(__dirname, 'public/js'),
		library: {
			type: 'module',
		}
	},
	module: {
		rules: [
			{ test: /\.tmpl$/, use: 'tripartite/webpack-loader.mjs' }
			, { test: /\.tri$/, use: 'tripartite/webpack-loader.mjs' }
			, {
				test: /\.txt$/i,
				use: 'raw-loader',
			}
		],
	},
	resolve: {
		fallback: {
			// stream: require.resolve('stream-browserify'),
		}
	},
	plugins: [
		// new NodePolyfillPlugin()
	],
	stats: {
		colors: true,
		reasons: true
	},

}
]