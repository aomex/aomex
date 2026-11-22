#!/usr/bin/env sh

set -e

pkg=node_modules/@asyncapi/react-component

cp "$pkg/browser/standalone/index.js" public/asyncapi-standalone.js
cp "$pkg/styles/default.min.css" public/asyncapi.min.css
