
// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils    = require('../lib/utils'),
    _        = require('underscore'),
    async    = require('async');

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

exports.password_and_hash_generate = function (test) {
    test.expect(3);
    
    utils.password_and_hash_generate( function (plaintext, hash) {
        test.ok( plaintext, "got plaintext: " + plaintext );
        test.ok( hash,      "got hash: " + hash );
    
        utils.password_hash_compare( plaintext, hash, function(is_same) {
            test.ok( is_same, "the two match" );
            test.done();
        });
    });

};

exports.mongodb_connection_string = function (test) {
    test.expect(3);
    
    test.equal( process.env.NODE_ENV, 'testing', 'running in test mode' );
    
    test.equal(
        utils.mongodb_connection_string(),
        'mongodb://localhost/popittest_all',
        "no param"
    ); 
    
    test.equal(
        utils.mongodb_connection_string('foobar'),
        'mongodb://localhost/popittest_foobar',
        "instance slug provided"
    ); 
    
    test.done();
}

exports.delete_all_testing_databases = function (test) {

    test.expect(1);
    utils.delete_all_testing_databases(function(){
        test.ok(true, 'done');
        test.done();        
    });

}

