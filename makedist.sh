#!/bin/sh

rm -rf dist
mkdir -p dist
./scrunchItUp.py
cp wcp.js dist/
cp html/wclogo.jpg dist
cp html/player-packed.html dist/index.html

