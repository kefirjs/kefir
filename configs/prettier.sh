#!/bin/sh

PRETTIER="`npm bin`/prettier --no-bracket-spacing --print-width 120 --single-quote --trailing-comma es5"

if [ "$1" == "check" ]; then
  echo "Running prettier check. Files that should be formatted:"
  $PRETTIER --list-different '{src,configs,test}/**/*.js' '*.js'
else
  echo "Running prettier formatter on files:"
  $PRETTIER --write '{src,configs,test}/**/*.js' '*.js'
fi
