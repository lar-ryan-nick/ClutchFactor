#!/bin/bash
git add .;
git commit -am "Reorganized";
git push heroku master;
git push origin master;
