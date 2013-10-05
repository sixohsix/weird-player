#!/bin/sh

rm -rf dist
mkdir -p dist
./scrunchItUp.py
cp wcp.js dist/
cp html/*.jpg dist/
cp html/*.png dist/
cp html/*.css dist/
cp html/player-packed.html dist/index.html
