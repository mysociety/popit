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


## Branches

We use a modified form of this [Git branch strategy](http://nvie.com/posts/a-successful-git-branching-model/). The `master` branch is used for development and the `production` branch is deployed to our servers. So before a deploy we merge `master` into `production`.

Once the code is more stable and has more users we will probably add in release branches, and start tagging with released version numbers.


## Developer Setup

These notes are in addition to the notes in `INSTALL.md`. If you'd like to work on the code and run the tests you'll need the following:


## SCSS to CSS

Generate the CSS from the SCSS by running `make scss`. When developing it is more convenient to run `compass watch` and let it detect changes to the SCSS and recompile as needed.


## Emails

The system send emails at various points. When developing these are also output to the logs so that it is easy to see them and follow embedded links etc.


## Minifying public to public-production

This is done by running `make public-production` and the results committed to the repository. When NODE_ENV is 'development' the unminified assets are used to make development easier. Otherwise the minified assets are used (this includes testing - public-productioning the assets is a part of the `make test` process).

Note that the paths used in the templates are the same for both - the JS is either a loader script which gets the required parts individually, or the single combined script.


## Watir

There are Watir tests that test the website and the interactions with it. You'll need to install Ruby (the programming language) and Chrome as the browser, and possibly chrome driver too.


## Running the tests

In the `popit` directory just run `npm test`.
