# Install notes

We hope that PopIt is quite easy to install and get running. If you have any issues please let us know at popit@mysociety.org or by reporting it on the [GitHub issue tracker](https://github.com/mysociety/popit/issues).

## Just want a PopIt site?

We run a free PopIt hosting service at http://popit.mysociety.org/ - if you just want to create a site to put data in that might be a better option. If you want to run your own, or contribute to the code then read on!

## Pre-requisites

The following services are needed by PopIt and you'll need to install them manually:

  * [Node.js](http://nodejs.org/) - the platform that the codebase runs on.
  * [MongoDB](http://www.mongodb.org/) - the database we store all the data in.

If you want to contribute code or run the test suite you'll need the following additional deps:

  * [Ruby](http://www.ruby-lang.org/) used for the browser based tests
  * [Watir WebDriver](http://watirwebdriver.com/) - to run the browser tests
  * [Chrome](https://www.google.com/chrome) - browser used for the automated tests
  * [Chrome Driver](http://code.google.com/p/chromedriver/) - interface for the webdriver code
  * [Compass](http://compass-style.org/) - to compile the stylesheets

The documentation part of the site is constructed using:
  * [Jekyll](http://jekyllrb.com/) which turns compiles the documentation source into the doc site
  * [kramdown](http://kramdown.rubyforge.org/) for converting to HTML, and the pretty syntax highlighting


### MacOS X

If you use [Homebrew](http://mxcl.github.com/homebrew/) on a Mac then these commands will install some of the needed components:

    # to run PopIt
    brew install git node mongodb graphicsmagick

    # to develop PopIt (in addition to the above) - Ruby and the gems are used 
    # for the browser tests and for rendering the docs
    brew install ruby
    gem install watir-webdriver pry jekyll

If you use [MacPorts](http://www.macports.org/) then these commands will install some of the needed components:

    # to run PopIt
    port install git-core npm mongodb graphicsmagick

    # to develop PopIt (in addition to the above)
    port install rb-haml

### Ubuntu

The following instructions have been used successfully on a default installation of the Server edition of Ubuntu 12.04 (Precise Pangolin), if you're using a different version your mileage may vary, but they should give you a good idea of where to start.

Almost all the packages required are available from apt-get repositories in the standard install, however there are a few extra steps needed. The following is a quick rundown of the commands you might need:

    # 1. Install extra repositories for Node.js and MongoDB

    # Instructions from: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
    sudo apt-get install python-software-properties
    sudo add-apt-repository ppa:chris-lea/node.js

    # Instructions from: http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/
    sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
    sudo echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" > /etc/apt/sources.list.d/10gen.list

    # 2. Update apt-get so that it's aware of the new packages available
    sudo apt-get update

    # 3. Install all the packages you need to run PopIt 
    # (you may have some of these already)
    # Note you need version 1.9 of Ruby, which in Ubuntu packages is helpfully
    # labelled 1.9.1, version 1.8 won't work.
    sudo apt-get install nodejs npm mongodb-10gen build-essential ruby1.9.1 ruby1.9.1-dev

    # 4. Install gems needed to build the code
    sudo gem install compass 

    # (Optional
    # If you wish to develop Popit, you'll need some extra packages in order
    # to run the tests

    # 5. Chromium browser and the chromedriver (including X11 if you've 
    # started with a server edition of Ubuntu, which will add ~150MB of X11
    # related dependencies
    sudo apt-get install chromium-browser unzip

    # chromedriver is only available as a binary download:
    wget http://chromedriver.googlecode.com/files/chromedriver_linux64_23.0.1240.0.zip
    unzip chromedriver_linux64_23.0.1240.0.zip
    rm chromedriver_linux64_23.0.1240.0.zip
    # You could put this anywhere you like, as long as it's in your $PATH
    sudo mv chromedriver /usr/local/bin

    # 6. Extra gems for running browser-based tests
    sudo gem install watir-webdriver pry

    # Finally, if you've been running all this on a headless server, you need
    # to start some kind of display to enable the browser based tests to run. 
    # (If you've got a gui already, you can skip this step).
    
    # The easiest way to do this is by using Xvfb:
    sudo apt-get install xvfb

    # You need to configure this to run, for which you can use something like:
    Xvfb :99 -ac &
    # Then you need to let programs know where to find the display:
    export DISPLAY=:99

    # You'll need to run these last two commands everytime you log in, or 
    # configure it to run automatically. 
    # One of the many ways to do that is to add the xvfb command to 
    # `/etc/rc.local` (above the last line that reads exit 0) and the export 
    # command to your `~/.bashrc` file.

### Vagrant
If you wish to use [Vagrant](http://www.vagrantup.com) to manage your development environment this is possible, see `docs/vagrant.md` for further details.

## Getting the PopIt code

Currently PopIt is not available over npm - perhaps it will be in future if there is sufficient demand.

To install from git do the following:

    # Get the code from GitHub
    git clone git://github.com/mysociety/popit.git
    cd popit
    
    # Optional - change to the 'production' branch (more stable). If you're 
    # hoping to contribute please stay on the 'master' branch.
    git checkout -b production origin/production
    
    # Install the dependencies and build the css
    make
    
    # Optional - run the test suite (requires additional software to be 
    # installed - see above)
    npm test
    
    # Start the app locally
    npm start
    
    # If you want to run the app from your /etc/init.d directory there is a 
    # sample script in './config' that you can use. Don't forget to create the
    # production config file too.

## Generated assets

If you don't want to develop the code but just want to deploy it you should use the `production` branch. This is updated less frequently that the `master` branch and also has all the generated assets (like the CSS, the minified and combined javascript) in it.

## Configuration

All the config is in the `config` folder. These are loaded by the [config](http://lorenwest.github.com/node-config/latest/index.html) module. There is a sample production config that you'll want to copy and edit. For dev and testing the provided config should be fine.

## DNS config

You'll need to setup a wildcard DNS if you want to let instances be created. If
your main site is `your-hosting-site-domain.com` you'll need to wildcard
`*.your-hosting-site-domain.com`, or create DNS entries for
`your-instance.your-hosting-site-domain.com`. For development and in the tests
we use `127.0.0.1.xip.io` which points at `127.0.0.1` - see http://xip.io for
details.

## Developers

In addition to these notes please see 'Developer Setup' section in the file `docs/contributing.md` if you want to work on the code.

## MongoDB suggestion

PopIt creates and destroys lots of MongoDB databases during testing. To make this less disk intensive set the following in the MongoDB config file:

    noprealloc = true
    smallfiles = true

Probably not a good idea on a production system though.

