// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils       = require('../lib/utils'),
    new_browser = require('./browser').new_browser;

module.exports = {
    setUp: function (cb) {
        utils.delete_all_testing_databases(cb);
    },

    check_title: function(test) {

        var browser = new_browser();
        
        test.expect(1);
        
        browser
            .waitForTextPresent('Welcome to PopIt')
            .assertTextPresent('Welcome to PopIt')
            .testComplete()
            .end(function (err) {
                if (err) throw err;
                test.ok(true);
                test.done();
            });        
    },
};

