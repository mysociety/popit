#!/bin/bash

set -e

# start a server and put pid in know file location
cd "$(dirname $BASH_SOURCE)"/..

export PID_FILE=tests/test-server.pid

if test -e $PID_FILE; then
  if kill -0 `cat $PID_FILE`; then
    echo Stopping process with pid `cat $PID_FILE`;
    kill `cat $PID_FILE` || true
    rm $PID_FILE
  fi
fi
