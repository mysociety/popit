
// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils    = require('../lib/utils'),
    PopIt    = require('../lib/popit');
    
module.exports = {
    
    setUp: function(cb) {
        this.popit  = new PopIt();
        this.popit.set_instance('test');
        this.Person = this.popit.model('Person');
        
        utils.delete_all_testing_databases(cb);
    },
    
    tearDown: function(cb) {
        // close the connections so that the test script can exit
        this.popit.close_db_connections();
        cb(null);
    },
    
    "person name and slug": function ( test ) {    
        test.expect( 11 );
        
        var person = new this.Person();
        test.ok( person, "got new person" );

        // initial settings
        test.equal( person.name, null, 'no name' );
        test.equal( person.slug, null, 'no slug' );

        // set a valid name
        person.name = "Joé Blöggs";
        test.equal( person.name, "Joé Blöggs", 'name set' );
        test.equal( person.slug, "joe-bloggs", 'slug set' );

        // change the name - should not affect slug
        person.name = "New Name";
        test.equal( person.name, "New Name",   'name changed' );
        test.equal( person.slug, "joe-bloggs", 'slug not changed' );
        
        // change slug
        person.slug = "New Slug";
        test.equal( person.name, "New Name", 'name not changed' );
        test.equal( person.slug, "new-slug", 'slug changed (and slugified)' );
        
        // clear slug and set Unicode name
        person.slug = '';
        person.name = "网页";
        test.equal( person.name, "网页", 'new chinese name saved' );
        test.equal( person.slug, "",   'slug blank as expected' );
        
        test.done();
    },
    
};