build: module browser

module:
	babel --stage=0 src --out-dir lib

browser:
	babel-node ./node_modules/.bin/webpack --config ./webpack.config.js
