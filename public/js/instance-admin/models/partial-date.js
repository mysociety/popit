define( [ 'Backbone', 'underscore' ], function ( Backbone, _  ) {
  "use strict"; 

  return Backbone.Model.extend({


      /*

        We overide the toJSON method so that we can change the data sent to the
        server by Backbone.sync when it is saved. The data we represent with
        this model is just a subset of the actual document in the database. By
        just returning the dotted path to the date the update will just affect
        the single date.

        The id stored is that of the actual document, so that saves are always
        updates and not creates. To avoid accedentall deleting the document the
        destroy method is overridden to throw an error.

      */

      toJSON: function () {
        var raw      = _.clone(this.attributes);
        var modified = {};
        var path     = this.path_to_date;

        // prepend the path to all the keys so that it goes to the right place
        // on the document.
        _.each( raw, function (value, key) {
          modified[ path + '.' + key] = value;
        });

        return modified;
      },

      destroy: function () {
        throw new Error('destroy not permitted to prevent accidental data loss');
      }
    
  });


});
