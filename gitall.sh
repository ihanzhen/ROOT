#!/bin/bash
cd /home/tomcat7/webapps/ROOT
git add .
git commit
:wq
git pull
git push
