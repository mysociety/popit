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

    # get the code and change dir into it
    git clone git://github.com/mysociety/popit.git
    cd popit
    
    # start a screen session (naughty, but convenient)
    screen
    
    # install all the dependecies
    npm install .
    
    # look at the configuration files in config - if you want to make local
    # changes then do so by creating a new file that overides the settings in
    # default.js. Use the filename as the NODE_ENV - so if you create
    # 'config/foobar.js' then use 'foobar'.
    
    # run the hosting app
    NODE_ENV=development supervisor hosting-app/app.js
    
    # you should now be able to connect to the app with your browser
    
    # detach from the screen session using Ctrl-A Ctrl-D
