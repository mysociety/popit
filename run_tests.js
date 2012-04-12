#!/usr/bin/env node

// switch to testing mode
process.env.NODE_ENV = 'testing';

var reporter = require('nodeunit').reporters.verbose;

reporter.run([ 'tests' ]);

