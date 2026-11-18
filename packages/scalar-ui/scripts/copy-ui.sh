#!/usr/bin/env sh

set -e

dist=node_modules/@scalar/api-reference/dist/browser

cp $dist/standalone.js public/
