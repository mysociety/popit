---
layout: default
title: Installing on MacOS X
---

If you use [Homebrew](http://mxcl.github.com/homebrew/) on a Mac then these commands will install some of the needed components:

    # to run PopIt
    brew install git node mongodb graphicsmagick

    # to develop PopIt (in addition to the above) - Ruby and the gems are used 
    # for the browser tests and for rendering the docs
    brew install ruby
    gem install watir-webdriver pry jekyll

If you use [MacPorts](http://www.macports.org/) then these commands will install some of the needed components:

    # to run PopIt
    port install git-core npm mongodb graphicsmagick jekyll

    # to develop PopIt (in addition to the above)
    port install rb-haml
