#!/usr/bin/env node

// switch to testing mode
process.env.NODE_ENV = 'testing';

var reporter = require('nodeunit').reporters.verbose;

reporter.run([
    // normal unit tests
    'tests',

    // FIXME add smarts here to check that selenium and a local node are running,
    // and offer help if they are not.
    'selenium_tests',
]);

