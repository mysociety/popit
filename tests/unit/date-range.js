
// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils    = require('../../lib/utils'),
    PopIt    = require('../../lib/popit'),
    async    = require('async'),
    _        = require('underscore');
    
    
    
var test_dates = [
  { name: '2012',       start: '2012-01-01', end: '2012-12-31', },
  { name: '2013',       start: '2013-01-01', end: '2013-12-31', },

  { name: 'Q1 2012',    start: '2012-01-01', end: '2012-03-31', },
  { name: 'Q2 2012',    start: '2012-04-01', end: '2012-06-30', },

  { name: 'Jan 2012',   start: '2012-01-01', end: '2012-01-31', },
  { name: 'Feb 2012',   start: '2012-02-01', end: '2012-02-28', },
  { name: 'Mar 2012',   start: '2012-03-01', end: '2012-03-31', },
  { name: 'Apr 2012',   start: '2012-04-01', end: '2012-04-30', },
  { name: 'May 2012',   start: '2012-05-01', end: '2012-05-31', },
                                                                
  { name: '1 Jan 2012', start: '2012-01-01', end: '2012-01-01', },
  { name: '2 Jan 2012', start: '2012-01-02', end: '2012-01-02', },
  { name: '3 Jan 2012', start: '2012-01-03', end: '2012-01-03', },
];


var mongoose          = require('mongoose'),
    Schema            = mongoose.Schema;

function dateRangePlugin (schema, options) {

  var fieldName = options.fieldName;

  var args = {};
  args[fieldName] = {
    start: Date,
    end:   Date,
  };

  schema.add(args);

}

var TestSchema = new Schema({
    name: String,  
});
TestSchema.plugin( dateRangePlugin, {fieldName: 'theDate'} );


module.exports = {
    
  setUp: function(cb) {

    this.popit  = new PopIt();
    this.popit.set_instance('test');

    var db = this.popit.instance_db();

    var test_model = this.test_model = db.model( 'TestModel', TestSchema );

    utils.delete_all_testing_databases(function(err) {

      if (err) return cb(err);
      
      async.forEach(
        test_dates,
        function(item, done) {

          var entry = new test_model({
            name: item['name'],
            theDate: {
              start: item['start'],
              end:   item['end'],
            },
          });

          entry.save(done);

        },
        cb
      );
      
    });
  },
  
  tearDown: function(cb) {
    this.popit.close_db_connections(cb);
  },
  
  "test sorting asc": function ( test ) {    
    test.expect( 2 );    

    this.test_model
      .find()
      .sort('theDate.start theDate.end')
      // .sort('theDate')
      .exec(function(err, docs) {
        test.ifError(err);
        test.deepEqual(
          _.pluck(docs, 'name'),
          [ 
            '1 Jan 2012',
            'Jan 2012',
            'Q1 2012',
            '2012',
            '2 Jan 2012',
            '3 Jan 2012',
            'Feb 2012',
            'Mar 2012',
            'Apr 2012',
            'Q2 2012',
            'May 2012',
            '2013',
          ],
          "asc sorting as expected"
        );
      test.done();
    });
  },

  "test sorting desc": function ( test ) {    
    test.expect( 2 );    

    this.test_model
      .find()
      .sort('-theDate.end -theDate.start')
      // .sort('-theDate')
      .exec(function(err, docs) {
        test.ifError(err);
        test.deepEqual(
          _.pluck(docs, 'name'),
          [
            '2013',
            '2012',
            'Q2 2012',
            'May 2012',
            'Apr 2012',
            'Mar 2012',
            'Q1 2012',
            'Feb 2012',
            'Jan 2012',
            '3 Jan 2012',
            '2 Jan 2012',
            '1 Jan 2012',
          ],
          "desc sorting as expected"
        );
      test.done();
    });
  },


};
