#!/bin/bash

PRETTIER="`npm bin`/prettier"

if [ "$1" == "check" ]; then
  echo "Running prettier check. Files that should be formatted (shouldn't be any):"
  "$PRETTIER" --list-different '{src,configs,test}/**/*.js' '*.js'
else
  echo "Running prettier formatter on files:"
  "$PRETTIER" --write '{src,configs,test}/**/*.js' '*.js'
fi
