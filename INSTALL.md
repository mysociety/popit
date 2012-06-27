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


### MacOS X

If you use [Homebrew](http://mxcl.github.com/homebrew/) on a Mac then these commands will install some of the needed components:

    # to run PopIt
    brew install git node mongodb

    # to develop PopIt (in addition to the above) - Ruby and the gems are used 
    # for the browser tests
    brew install ruby
    gem install watir-webdriver pry

If you use [MacPorts](http://www.macports.org/) then these commands will install some of the needed components:

    # to run PopIt
    port install git-core npm mongodb

    # to develop PopIt (in addition to the above)
    port install rb-haml


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

## Configuration

All the config is in the `config` folder. These are loaded by the [config](http://lorenwest.github.com/node-config/latest/index.html) module. There is a sample production config that you'll want to copy and edit. For dev and testing the provided config should be fine.

## DNS config

You'll need to setup a wildcard DNS if you want to let instances be created. If
your main site is `your-hosting-site-domain.com` you'll need to wildcard
`*.your-hosting-site-domain.com`, or create DNS entries for
`your-instance.your-hosting-site-domain.com`. By default the `127-0-0-1.org.uk` domain is used which wildcards to localhost.

## Developers

In addition to these notes please see 'Developer Setup' section in the file `docs/contributing.md` if you want to work on the code.

## MongoDB suggestion

PopIt creates and destroys lots of MongoDB databases during testing. To make this less disk intensive set the following in the MongoDB config file:

    noprealloc = true
    smallfiles = true

Probably not a good idea on a production system though.

