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
		.run(function( err, instances ) {
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

for_each_instance( function (instance, next_instance) {

	console.log( 'looking at instance %s', instance.slug );
	var db = utils.mongo_native_connect( instance.slug );

	db.open( function( err, client ) {
		if (err) throw err;

		function process_person ( person, next_person ) {

			console.log( '  updating person %s', person.name );

			// change that list to be an array of image objects
			async.map( person.images, retrieve_image, function(err, image_objects) {
				if (err) throw err;
				person.images = image_objects;
				
				client.collection('people', function( err, people_collection ) {
					if (err) throw err;
					people_collection.save(person,{safe:true}, next_person);					
				});
				
			});
			// save that back to the person

		}

		// Find the image by ID and return it to the cb. If the image id is actually
		// an image object just return that - to avoid errors if we run multiple
		// times on the same entry.
		function retrieve_image (image_id, image_retrieved ) {

			// check that this is not already an object (in case it's already been processed)
			if (image_id._id) return image_retrieved(null, image_id);

			client.collection('images', function (err, image_collection) {
				if (err) throw err;
				image_collection.findOne( {_id: image_id}, image_retrieved );
			});
		}

		// Drop the image collection
		function drop_image_collection ( dropped_collection ) {

			console.log('  dropping images collection...');

			client.dropCollection( 'images', function (err) {

				// don't worry if the collection did not exist - as it's gone which is
				// what we want
				if ( err && err.errmsg != 'ns not found' ) throw err;

				console.log('  ...dropped images collection');
				dropped_collection();
			});
		}
		
		// run the code above over each person
		client.collection('people', function (err, people_collection) {
			if (err) throw err;

			people_collection
				.find({ images: { $exists: true } })
				.toArray(function(err, people) {
					if (err) throw err;

					async.forEachSeries(
						people,
						process_person,       // runs for each person
						function (err) {
							if (err) throw err;
							drop_image_collection(next_instance);
						}
					);

				});
		});		

		
		
	});
});
