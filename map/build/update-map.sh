#!/bin/bash

REPO_DIR="/home/pi/github/haraldoalbergaria.page"
MAP_DIR="map"
BUILD_DIR="build"
LOC_FILE="locations.py"
CTY_FILE="countries.py"

rm $REPO_DIR/$MAP_DIR/$BUILD_DIR/last_total.py

$REPO_DIR/$MAP_DIR/$BUILD_DIR/generate-map-data.py

if [[ -f $REPO_DIR/$MAP_DIR/$LOC_FILE && -f $REPO_DIR/$MAP_DIR/$CTY_FILE ]];
  then
    cd $REPO_DIR
    git pull origin master
    git add $MAP_DIR/$LOC_FILE
    git add $MAP_DIR/$CTY_FILE
    git commit -m "[auto] Updated Flickr Photos Map"
    git push origin master
    rm -fr __pycache__
fi

exit 0
