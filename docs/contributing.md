# Contributing

Contributions to the PopIt project are very welcome. Really very welcome indeed. If you submit a pull request we'll be sure to look at it as soon as we can and hopefully merge it in or comment on it.

If you just want to keep up with developments there is a [dev blog](http://www.tumblr.com/blog/popit-dev) that you might find interesting.

## Code (and test) contributions

We use the _Fork & Pull_ development model and so the easiest way to contribute code changes is via a [pull request](http://help.github.com/send-pull-requests/).

We welcome pull requests for several things:

 * **new test cases** that fail because they point out bugs in our code. We're happy to accept these and then fix the code ourselves.
 * **code changes** are also welcome, and even more so when they come with tests too.
 * **documentation** corrections and clarifications - if you find something is wrong or confusing please reword it and let us know.

Please note that no contribution is too small :) If you do **not** want to be added to the thanks page please let us know.


## Developer Setup

These notes are in addition to the notes in `INSTALL.md`. If you'd like to work on the code and run the tests you'll need the following:


## SCSS to CSS

Generate the CSS from the SCSS by running `make scss`. When developing it is more convenient to run `compass watch` and let it detect changes to the SCSS and recompile as needed.


## Emails

The system send emails at various points. When developing these are also output to the logs so that it is easy to see them and follow embedded links etc.


## Minifying public to public-minified

This is done by running `make minify` and the results committed to the repository. When NODE_ENV is 'development' the unminified assets are used to make development easier. Otherwise the minified assets are used (this includes testing - minifying the assets is a part of the `make test` process).

Note that the paths used in the templates are the same for both - the JS is either a loader script which gets the required parts individually, or the single combined script.


## Selenium

There are selenium tests that test the website and the interactions with it. They expect to find a Selenium Server running on `localhost` port `4444` (the default). The server is available free from http://seleniumhq.org/download/ - download it and then leave it running in a shell. You'll also need FireFox installed as the browser that will be used for the testing.

If you use Mac OSX then the homebrew package `selenium-server-standalone` might be of interest.


## Running the tests

In the `popit` directory just run `npm test`.
