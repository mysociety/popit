var utils = require('../lib/utils'),
    _     = require('underscore');

exports.test_is_email = function ( test ) {

    var good = [
        'bob@example.com',
        'fred@thisdomaindoesnotexist.bogus'
    ];
    
    var bad = [
        'foo',
        'foo@',
        '@example.com',
        '',
        null
    ];

    test.expect( good.length + bad.length );

    _.each( good, function ( email ) {
        test.ok( utils.is_email(email), "is an email: " + email );        
    });

    _.each( bad, function ( email ) {
        test.ok( ! utils.is_email(email), "not an email: " + email );        
    });

    test.done();
};


