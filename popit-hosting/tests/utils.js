var utils = require('../lib/utils'),
    _     = require('underscore'),
    async = require('async');

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


exports.test_password_crypting = function (test) {

    test.expect( 5 );
    var plaintext = 'secr3t';
    var hashed    = null;

    async.series([
        function (cb) {
            // hash the password, check we get something
            utils.password_hash(
                plaintext,
                function (h) { 
                    hashed = h;
                    test.notEqual( null     , hashed, "have a password: " + hashed );
                    test.notEqual( plaintext, hashed, "password changed when hashed" );
                    cb(null);
                }
            );
        },
        function (cb) {
            // generate a new hash, check it is different
            utils.password_hash( plaintext, function (new_hash) {
                test.notEqual( hashed, new_hash, "new salt used" );
                cb(null);
            });
        },
        function (cb) {
            // check that the correct password compares correctly
            utils.password_hash_compare( plaintext, hashed, function (is_same) {
                test.ok( is_same, "password and hash compare as expected" );
                cb(null);
            });             
        },
        function (cb) {
            // check that a wrong password does not match 
            utils.password_hash_compare( 'bogus', hashed, function (is_same) {
                test.ok( !is_same, "bad password and hash compare as expected" );
                cb(null);
            });             
        },
    ], function (err) {
        if (err) throw err;
        test.done()
    });
    
    };