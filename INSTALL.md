# Install notes

These notes are for installing PopIt onto a debian-like system.

The resulting installation is not suitable for production use, this is mainly intended for developers and test sites.

## Node install notes

Complied and installed from source as per instructions here https://github.com/joyent/node/wiki/Installation. Didn't attempt to use packages as my debian is too old.


## MongoDB install notes

Installed using packages as detailed here:

    http://www.mongodb.org/display/DOCS/Ubuntu+and+Debian+packages

After installing made the following changes to `/etc/mongodb.conf` and then `/etc.init.d/mongodb restart` server:

    noprealloc = true
    smallfiles = true

Could also change `nssize` to be smaller, but left it untouched at default of 16MB.

No auth was set up - but should be in production.

## MongoDB Node Driver

    sudo npm install -g mongodb --mongodb:native

## Other Node packages that might be useful

    sudo npm install -g supervisor

## PopIt install notes

    # Created a new user `popit` to run service under.
    adduser popit

    # check that the popit user can see sendmail
    which sendmail
    
    # if nothing returned then as root do something like
    ln -s `which sendmail` /usr/bin/

    # Change to `popit` user and cd to home dir.
    ssh popit@host
    cd

    # get the code
    git clone git://github.com/mysociety/popit.git
    cd popit
    git checkout -b js-try-out origin/js-try-out # TODO - change when on master
    
    # start a screen session (naughty, but convenient)
    screen
    
    # go to the hosting app and setup env
    cd popit-hosting
    npm install .
    
    # run the app
    NODE_ENV=development supervisor app.js
    
    # you should now be able to connect to the app with your browser
    
    # detach from the screen session using Ctrl-A Ctrl-D
