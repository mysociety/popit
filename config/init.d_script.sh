#! /bin/sh
# /etc/init.d/popit


### BEGIN INIT INFO
# Provides:          popit
# Required-Start:    $network mongodb varnish
# Required-Stop:
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Run PopIt service.
### END INIT INFO


# This is a script that can be used to start the popit service at boot, and
# control it using the default sysadmin techniques. It is really a wrapper
# around the `forever` process that is used to handle errors and logging.

FOREVER=/usr/local/bin/forever
POPIT_USER=popit
POPIT_DIR=/home/popit/popit
LOGS_DIR=/home/popit/logs
POPIT_SCRIPT="production-server.js"

# NOTE: as well as copying and editing this script you'll need to create a 
# production config file - there is a sample in `$POPIT_DIR/config/`


# ensure that the logs directory exists
su -c "mkdir -p $LOGS_DIR" $POPIT_USER

# create the various commands
CD_POPIT="cd $POPIT_DIR"
START_POPIT="$CD_POPIT; $FOREVER start -a -l $LOGS_DIR/forever.log -o $LOGS_DIR/out.log -e $LOGS_DIR/err.log $POPIT_SCRIPT"
STOP_POPIT="$CD_POPIT; $FOREVER stop $POPIT_SCRIPT"
RESTART_POPIT="$CD_POPIT; $FOREVER restart $POPIT_SCRIPT"

# Carry out specific functions when asked to by the system
case "$1" in
  start)
    echo "Starting PopIt"
    su -c "$START_POPIT" $POPIT_USER    
    ;;
  stop)
    echo "Stopping PopIt"
    su -c "$STOP_POPIT" $POPIT_USER    
    ;;
  restart)
    echo "Restarting PopIt"
    su -c "$RESTART_POPIT" $POPIT_USER    
    ;;
  *)
    echo "Usage: /etc/init.d/popit {start|stop|restart}"
    exit 1
    ;;
esac

exit 0
