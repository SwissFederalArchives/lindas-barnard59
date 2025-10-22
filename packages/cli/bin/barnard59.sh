#!/usr/bin/env bash

# find local lindas-barnard59
barnard59=$(node -e "console.log(require.resolve('lindas-barnard59/bin/barnard59.js'))" 2> /dev/null)

if [ -z "$barnard59" ]
then
  # find global lindas-barnard59
  NODE_PATH=$(npm config get prefix)
  barnard59=$(node -e "console.log(require('path').join('$NODE_PATH', '/lib/node_modules/lindas-barnard59/bin/barnard59.js'))")
fi

if [ -z "$barnard59" ]
then
  echo "Could not find lindas-barnard59/bin/barnard59.js" >&2
  exit 1
fi

# if tsx or ts-node exists in path, use them
if command -v tsx > /dev/null 2>&1
then
  node --import tsx --no-warnings "$barnard59" "$@"
elif command -v ts-node &> /dev/null
then
  # use ts-node
  node --loader ts-node/esm/transpile-only --no-warnings "$barnard59" "$@"
else
  # use plain node
  node "$barnard59" "$@"
fi
