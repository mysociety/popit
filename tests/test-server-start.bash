#!/bin/bash

set -e

# start a server and put pid in know file location
cd "$(dirname $BASH_SOURCE)"/..

export PID_FILE=tests/test-server.pid

# start the server (in testing env) and background.
NODE_ENV=testing node server.js &

# print out the pid
echo $! > $PID_FILE

# give the server time to start.
sleep 5
