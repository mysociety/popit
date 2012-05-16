
exports.deduplicate_slug = function deduplicate_slug (cb) {
  var self = this;
  
  // find other entries in the database that have the same slug
  this.collection.findOne({slug: self.slug, _id: { $ne: self._id } }, function(err, doc) {

    if (err) return cb(err);
    
    // if nothing found then no need to change slug
    if ( ! doc ) return cb(null);
    
    // we have a conflict, increment the slug
    var matches = self.slug.match(/^(.*)\-(\d+)$/);
    
    if ( !matches ) {
      self.slug = self.slug + '-1';
    } else {
      var base_slug = matches[1];
      var counter   = parseInt(matches[2]) + 1;
      self.slug     = base_slug + '-' + counter;
    }

    return deduplicate_slug.apply( self, [cb] ); // recurse

  });
};
