"use strict"; 


// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils             = require('../../lib/utils'),
    instanceSelector  = require('../../lib/middleware/instance-selector'),
    _                 = require('underscore'),
    async             = require('async'),
    config            = require('config');


exports.exports = {
    setUp: function (cb) {
        cb();
    },

    "extract slug from popit domain name": function (test) {
    
        var suffix = 'popitdomain.org:1234';
        var tests = {};
    
        // slug.popitdomain.org tests
        tests['foo.'    + suffix] = 'foo';
        tests['test.' + suffix] = 'test';
        tests['f12345.' + suffix] = 'f12345';
            
        test.expect(tests.length);
    
        var selector = instanceSelector();        
    
        _.each( tests, function( slug, hostname ) {
            test.equal(
                utils.extract_slug(hostname, suffix),
                slug,
                "Get '" + slug + "' from '" + hostname + "'"
            );
        });
    
        test.done();    
    },

};

