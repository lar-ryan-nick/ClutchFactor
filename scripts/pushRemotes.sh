#!/bin/bash
./node_modules/.bin/webpack -p;
git add .;
git commit -am "Reorganized";
git push heroku master;
git push origin master;
