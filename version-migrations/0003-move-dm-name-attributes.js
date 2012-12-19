var mongo = require('mongodb'),
    async = require('async'),
    utils = require('../lib/utils'),
    PopIt = require('../lib/popit');


function for_each_instance( instance_iterator ) {
  var master = new PopIt();
  master.set_as_master();

  master
    .model('Instance')
    .find()
    .exec(function( err, instances ) {
      if (err) throw err;
      async.forEachSeries(
        instances,
        instance_iterator,
        function (err) {
          if (err) throw err;

          console.log('ALL DONE');

          process.exit(); // easier than closing all cached connections
        }
      );
    });
}

for_each_instance( function (instance, next_instance_cb) {

  console.log( 'looking at instance %s', instance.slug );

  var popit = new PopIt();
  popit.set_instance( instance.slug );
  
  popit.model('Person').find().exec(function(err, docs) {
    if ( err ) return next_instance_cb( err );
    
    async.forEachSeries(
      docs,
      function(person, next_person_cb) {
        console.log("  looking at person %s", person.name );

        // copy over the values
        person.set('_internal.name_words', person.name_words);
        person.set('_internal.name_dm',    person.name_dm);
        
        // clear the old locations
        person.name_words = undefined;
        person.name_dm    = undefined;

        // save, and move on
        person.save( next_person_cb );
      },
      next_instance_cb
    );
  });

});
