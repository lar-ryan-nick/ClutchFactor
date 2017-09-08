#!/bin/bash
cp webpack.config1.js webpack.config.js;
./node_modules/.bin/webpack $1;
cp webpack.config2.js webpack.config.js;
./node_modules/.bin/webpack $1;
cp webpack.config3.js webpack.config.js;
./node_modules/.bin/webpack $1;
cp webpack.config4.js webpack.config.js;
./node_modules/.bin/webpack $1;
cp webpack.config5.js webpack.config.js;
./node_modules/.bin/webpack $1;
cp webpack.config6.js webpack.config.js;
./node_modules/.bin/webpack $1;
