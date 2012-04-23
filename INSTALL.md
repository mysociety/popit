# Install notes

These notes are for installing PopIt onto a debian-like system.

The resulting installation is not suitable for production use, this is mainly intended for developers and test sites.

## Developers

In addition to these notes please see 'Developer Setup' section in the file `docs/contributing.md` if you want to work on the code.

## Node install notes

Complied and installed from source as per instructions here https://github.com/joyent/node/wiki/Installation. Didn't attempt to use packages as my debian is too old.


## MongoDB install notes

Installed using packages as detailed here:

    http://www.mongodb.org/display/DOCS/Ubuntu+and+Debian+packages

After installing made the following changes to `/etc/mongodb.conf` and then `/etc.init.d/mongodb restart` server:

    noprealloc = true
    smallfiles = true

Could also change `nssize` to be smaller, but left it untouched at default of 16MB.

Only bind to the localhost address - so open only to local machine:

    bind_ip = 127.0.0.1

You can check this is working as expected using `netstat -a` and looking for ports `27017` and `28017`.

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

# Installing behind varnish

[Varnish](https://www.varnish-cache.org/) is a web application accelerator. We can use it to route the HTTP traffic to the right port for the hosting/instance servers.

    # Install varnish as per instructions at https://www.varnish-cache.org/installation/debian

    # Copy `/etc/varnish/default.vcl` to `/etc/varnish/popit.vcl`
    
    # Edit `/etc/varnish/popit.vcl` so that it has the following uncommented lines in it:
    
    backend hosting_server {
        .host = "127.0.0.1";
        .port = "3000";
    }

    backend default {
        .host = "127.0.0.1";
        .port = "3001";
    }

    sub vcl_recv {
        if(req.http.host == "your-hosting-site-domain.com") {
            set req.backend = hosting_server;
        }
    }
    
    # Edit /etc/default/varnish so that it is listening to port 80, and use the popit.vcl
    
    # restart varnish
    /etc/init.d/varnish restart
    
    # set up the production config
    cp config/sample-production.js ../production.js
    ln -s ../../production.js config/
    nano config/production.js
    
    # Run the servers in production env
    # FIXME - should do this at startup using startdard scripts etc
    NODE_ENV=production supervisor hosting-app/app.js
    NODE_ENV=production supervisor instance-app/app.js
    