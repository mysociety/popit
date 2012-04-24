// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils               = require('../lib/utils'),
    selenium_helpers    = require('../lib/testing/selenium'),
    config              = require('config'),
    async               = require('async');



module.exports = {
  
  setUp: function (setUp_done) {
    
    utils.delete_all_testing_databases( function () {
      selenium_helpers.start_servers( function () {
        setUp_done();
      });            
    });
  },
  
  tearDown: function (tearDown_done) {
    selenium_helpers.stop_servers(tearDown_done);
  },
  
  "Check info pages": function (test) {
  
    var browser = selenium_helpers.new_hosting_browser();
    
    test.expect(2);
    
    browser
      .open('/info/does_not_exist')
      .assertTextPresent('Page not found')
      .open('/info/privacy')
      .assertTextPresent('privacy text goes here')
      .testComplete()
      .end(function (err) {
        test.ifError(err);
        test.ok(true, "end of tests");
        test.done();
      });        
  },
  
};

