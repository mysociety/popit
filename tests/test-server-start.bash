#!/bin/bash

set -e

# start a server and put pid in know file location
cd "$(dirname $BASH_SOURCE)"/..

export PID_FILE=tests/test-server.pid

# start the server (in testing env) and background.
NODE_ENV=testing node server.js &

# print out the pid
echo $! > $PID_FILE

# give the server time to start, this assumes the server is running on
# port 3100.
until nc -z localhost 3100; do
  echo "Waiting for test server to start on port 3100"
  sleep 1
done
