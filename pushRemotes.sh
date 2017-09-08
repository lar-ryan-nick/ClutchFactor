#!/bin/bash
./compileReact.sh -p;
git add .;
git commit -am "Clean up and just setting up";
git push heroku master;
git push origin master;
