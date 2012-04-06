# Contributing

Contributions to the PopIt project are very welcome.

## Code (and test) contributions

We use the _Fork & Pull_ development model and so the easiest way to contribute code changes is via a [pull request](http://help.github.com/send-pull-requests/).

We welcome pull requests for several things:

 * **new test cases** that fail because they point out bugs in our code. We're happy to accept these and then fix the code ourselves.
 * **code changes** are also welcome, and even more so when they come with tests too.
 * **documentation** corrections and clarifications - if you find something is wrong or confusing please reword it and let us know.

Please note that no contribution is too small :) If you do **not** want to be added to the thanks page please let us know.

## Developer Setup

These notes are in addition to the notes in `INSTALL.md`. If you'd like to work on the code and run the tests you'll need the following:

### MongoDB

You'll need access to a MongoDB server on which you can create and delete databases. The test suite does this a lot, so you'll probably want to run it with `smallfiles` and `noprealloc` to save on time consuming disk writes.

### Two free ports

The test suite will start a hosting and instance server on your machine and will use the ports specified in `config/testing.js`. You'll need to check that these are not used. The loopback address `127.0.0.1` will be used to access these servers.

### Working DNS

Because the PopIt instance server can host several instances which are differentiated by the host name used to access them we use the `*.vcap.me` domain name for the tests. This is wildcarded to `127.0.0.1` but you'll need a network connection for the DNS lookups.

### Selenium

There are selenium tests that test the website and the interactions with it. They expect to find a Selenium Server running on `localhost` port `4444` (the default). The server is available free from http://seleniumhq.org/download/ - download it and then leave it running in a shell. You'll also need FireFox installed as the browser that will be used for the testing.

If you use Mac OSX then the homebrew package `selenium-server-standalone might be of interest.

### Running the tests

In the `popit` directory just run `npm test`.

