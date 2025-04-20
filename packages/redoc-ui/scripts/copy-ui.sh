#!/usr/bin/env sh

set -e

bundles=node_modules/redoc/bundles

cp $bundles/redoc.standalone.js* public/
