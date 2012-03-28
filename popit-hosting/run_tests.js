#!/usr/bin/env node

var reporter = require('nodeunit').reporters.default;

reporter.run([
    // normal unit tests
    'tests',

    // FIXME add smarts here to check that selenium and a local node are running,
    // and offer help if they are not.
    'selenium_tests',
]);

