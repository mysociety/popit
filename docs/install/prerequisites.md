---
title: Prerequisites
layout: default
---

The following services are needed by PopIt and you'll need to install them manually. If you use the instructions for a specific platform then you'll be guided through the steps needed.

## Server and DB

  * [Node.js](http://nodejs.org/) - the platform that the codebase runs on.
  * [MongoDB](http://www.mongodb.org/) - the database we store all the data in.


## Dev tools

If you want to contribute code or run the test suite you'll need the following additional deps:

  * [Ruby](http://www.ruby-lang.org/) used for the browser based tests
  * [Watir WebDriver](http://watirwebdriver.com/) - to run the browser tests
  * [Chrome](https://www.google.com/chrome) - browser used for the automated tests
  * [Chrome Driver](http://code.google.com/p/chromedriver/) - interface for the webdriver code
  * [Compass](http://compass-style.org/) - to compile the stylesheets

## Documentation

The documentation part of the site is constructed using:

  * [Jekyll](http://jekyllrb.com/) which turns compiles the documentation source into the doc site
  * [kramdown](http://kramdown.rubyforge.org/) for converting to HTML, and the pretty syntax highlighting

