#!/usr/bin/env sh

set -e

dist=node_modules/swagger-ui/dist

cp $dist/swagger-ui.css* public/
cp $dist/swagger-ui.js* public/
