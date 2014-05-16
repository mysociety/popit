define( [ 'Backbone',
    'instance-admin/models/nested',
    'instance-admin/collections/contacts',
    'instance-admin/collections/other_names',
    'instance-admin/collections/identifiers',
    'instance-admin/collections/links'
],
function ( Backbone, NestedModel, ContactCollection, OtherNamesCollection, IdentifierCollection, LinkCollection ) {
  "use strict"; 

  var PersonModel = NestedModel.extend({
    urlRoot: '/api/v0.1/persons',

    set: function(attrs, options) {
      this.nest('links', LinkCollection, attrs);
      this.nest('contact_details', ContactCollection, attrs);
      this.nest('other_names', OtherNamesCollection, attrs);
      this.nest('identifiers', IdentifierCollection, attrs);
      return Backbone.Model.prototype.set.call(this, attrs, options);
    },

    initialize: function() {
      Backbone.on('in-place-edit', this.inPlaceEdited, this);
    },

    inPlaceEdited: function(chg) {
      this.save(chg);
    },

    schema: {
      name: { dataType: 'Text', validators: ['required'] }
    },

    validate: function(attrs) {
        var errs = {}, invalid = false;
        if ( !attrs.name ) {
            invalid = true;
            errs.name = 'Name is required';
        }
        if ( attrs.birth_date && !attrs.birth_date.match(/^[0-9]{4}(-[0-9]{2}){0,2}$/) ) {
            invalid = true;
            errs.birth_date = 'Wrong date format, expects YYYY, YYYY-MM or YYYY-MM-DD';
        }
        if ( attrs.death_date && !attrs.death_date.match(/^[0-9]{4}(-[0-9]{2}){0,2}$/) ) {
            invalid = true;
            errs.death_date = 'Wrong date format, expects YYYY, YYYY-MM or YYYY-MM-DD';
        }

        if ( invalid ) {
            return errs;
        }
    }
  });

  return PersonModel;

});
