#!/bin/bash
scripts/compileReact.sh -p;
git add .;
git commit -am "Reorganized";
git push heroku master;
git push origin master;
