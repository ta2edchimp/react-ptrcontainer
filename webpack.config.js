import path from 'path';
import webpack from 'webpack';

export default {
	entry: path.join(__dirname, 'src', 'index.js'),
	output: {
		path: path.join(__dirname, 'standalone'),
		filename: 'react-ptrcomponent.js',
		library: 'ReactPtrComponent',
		libraryTarget: 'umd',
		target: 'web'
	},
	externals: [
		'React',
		{
			react: 'React'
		}
	],
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel',
				query: {
					stage: 0
				}
			}
		]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin()
	]
}
