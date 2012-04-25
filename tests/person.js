
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
    
    "increment slug": function (test) {
      test.expect(5);
      
      var Person = this.Person;
      var joe = new Person({name: 'Joe'});
      test.equal( joe.slug, 'joe', 'slug is Joe');
      
      joe.save(function(err, doc) {
        test.ifError(err);
      
        var joe2 = new Person({name: 'Joe'});
        test.equal( joe2.slug, 'joe', 'slug is joe for second joe');
      
        joe2.deduplicate_slug(function(err) {
          test.ifError(err);
          test.equal( joe2.slug, 'joe-1', 'slug has been de-duped');
          test.done();
        });
      });
    },

    "don't increment our own slug": function (test) {
      test.expect(4);
      
      var Person = this.Person;
      var joe = new Person({name: 'Joe'});
      test.equal( joe.slug, 'joe', 'slug is Joe');
      
      joe.save(function(err, doc) {
        test.ifError(err);
      
        joe.deduplicate_slug(function(err) {
          test.ifError(err);
          test.equal( joe.slug, 'joe', 'slug has not changed');
          test.done();
        });
      });
    },

    "slug url": function (test) {
      test.expect(2);
      
      var Person = this.Person;
      var joe = new Person({name: 'Joe'});
      test.equal( joe.slug,     'joe',         'slug is correct');
      test.equal( joe.slug_url, '/person/joe', 'slug_url is correct');
      test.done();
    },
};