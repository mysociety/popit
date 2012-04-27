
// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils    = require('../lib/utils'),
    PopIt    = require('../lib/popit');
    
module.exports = {
    
  setUp: function(cb) {
    this.popit  = new PopIt();
    this.popit.set_instance('test');
    this.Image = this.popit.model('Image');
    
    utils.delete_all_testing_databases(cb);
  },
  
  tearDown: function(cb) {
    this.popit.close_db_connections();
    cb(null);
  },
  
  "image local path": function ( test ) {    
    test.expect( 1 );    

    var image = new (this.Image)();
    
    test.ok(
      image.local_path_original.match( /^.{2}\/.{2}\/.{24}\-original$/ ),
      "local_path_original looks right"
    );

    test.done();
  },
};
