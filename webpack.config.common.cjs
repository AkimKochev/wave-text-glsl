const path = require('path');
const webpack = require('webpack');

const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev';

const dirApp = path.join(__dirname, 'app'); // This is where the js files are stored
const dirStatic = path.join(__dirname, 'static'); // This is where images, fonts etc. are stored
const dirStyles = path.join(__dirname, ''); // This is where all the SCSS files are stored
const dirNode = 'node_modules';

module.exports = {
	entry: [path.join(dirApp, 'index.js'), path.join(dirStyles, 'style.css')],

	resolve: {
		modules: [dirApp, dirStatic, dirStyles, dirNode], // [..., dirStatic, ...]
	},

	plugins: [
		new webpack.DefinePlugin({
			IS_DEVELOPMENT,
		}),

		new CopyWebpackPlugin({
			patterns: [
				{
					from: './static',
					to: '',
					noErrorOnMissing: true,
				},
			],
		}),

		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),

		new ImageMinimizerPlugin({
			minimizer: {
				implementation: ImageMinimizerPlugin.imageminMinify,
				options: {
					plugins: [
						['gifsicle', {interlaced: true}],
						['jpegtran', {progressive: true}],
						['optipng', {optimizationLevel: 8}],
					],
				},
			},
		}),

		new CleanWebpackPlugin(),
	],

	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
				},
			},

			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},

			{
				test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/,
				loader: 'file-loader',
				options: {
					name(file) {
						return '[hash].[ext]';
					},
				},
			},

			{
				test: /\.(jpe?g|png|gif|svg|webp)$/i,
				use: [
					{
						loader: ImageMinimizerPlugin.loader,
					},
				],
			},

			{
				test: /\.(glsl|frag|vert)$/,
				loader: 'raw-loader',
				exclude: /node_modules/,
			},

			{
				test: /\.(glsl|frag|vert)$/,
				loader: 'glslify-loader',
				exclude: /node_modules/,
			},
		],
	},

	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin()],
	},
};