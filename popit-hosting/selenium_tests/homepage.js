
var new_browser = require('./browser').new_browser;

exports.check_title = function(test) {

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

};

