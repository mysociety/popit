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

The `production` branch is also special in that the public-production folder is not `.gitignore`d - so it is ready to deploy. On the other branches this folder is ignored so that generated assets don't clog up the diffs.

## Developer Setup

These notes are in addition to the notes in `INSTALL.md`. If you'd like to work on the code and run the tests you'll need the following:


## Node module dependencies

We list the dependencies as normal in `packages.json`. However we also take advantage of [npm shrinkwrap](http://npmjs.org/doc/shrinkwrap.html) to lock down the dependencies so that the development and production versions all match exactly.

After you've added a module to `packages.json` please run `make npm-shrinkwrap` which builds the shrink-wrapped node_modules dir, deletes the shrinkwrap file, runs another build to pick up you changes and then freezes it.

The shrinkwrap is applied before the tests are run (if you use `make test`) to check that no dependencies have been forgotten.

## SCSS to CSS

Generate the CSS from the SCSS by running `make css`. When developing it is more convenient to run `compass watch` and let it detect changes to the SCSS and recompile as needed. Ideally this would run automatically as a middleware - patches welcome.


## Emails

The system send emails at various points. When developing these are also output to the logs so that it is easy to see them and follow embedded links etc.


## Minifying public to public-production

This is done by running `make public-production`. When NODE_ENV is 'development' the unminified assets are used to make development easier. Otherwise the minified assets in public-production are used. When you run the test suite using `make test` the public-production folder is generated and the production assets used for the tests.

Note that the paths used in the templates are the same for both - the JS is either a loader script which gets the required parts individually, or the single combined script.


## Watir

There are Watir tests that test the website and the interactions with it. You'll need to install Ruby (the programming language) and (by default) Chrome as the browser, and possibly chrome driver too.

You can change the browser used, and the url to the test server, with environment variables:

    $ export WATIR_BROWSER=firefox
    $ export WATIR_HOSTING_URL="http://www.127.0.0.1.xip.io:3000/"
    $ make test-browser

Watir supports [many different browsers](http://watirwebdriver.com/) (click the 'Browsers' tab). With the url note that the test suite uses sub-domains - so either use a service like [xip.io](http://xip.io) to map to your IP address, or add entries to your `/etc/hosts` or equivalent. You'll also need to change the PopIt config files.

If you've not set `WATIR_HOSTING_URL` the tests decide which server to connect to based on the `NODE_ENV`. If it is `testing` they'll connect to port `3100`, otherwise they'll use port `3000`. This is convenient as you can go to the `tests/browser-based` dir and run the tests manually using `ruby -I. name_of_test.rb`. Combining this with [pry](http://pry.github.com/) and dropping in `binding.pry` breakpoints leads to a very nice test developing environment (write tests in the repl shell, see results in the browser, copy to text editor when happy).


## Running the tests

In the `popit` directory just run `make test`. The tests run in several stages and will trigger the building of generated assets etc.

The test suite is also run on the [Travis continuous integration service](http://travis-ci.org/mysociety/popit). If you create a merge-able pull request it will be tested for you automatically.
