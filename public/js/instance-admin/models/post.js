define( [ 'Backbone', 'backbone-forms' ], function ( Backbone, BackboneForms ) {
  "use strict"; 

  var NullText = BackboneForms.editors.Text.extend({
    getValue: function() {
      return this.$el.val() || null;
    }
  });

  var dateValidator = /^[0-9]{4}(-[0-9]{2}){0,2}$/;

  return Backbone.Model.extend({
    urlRoot: '/api/v0.1/posts',
    schema: {
      label: { dataType: 'Text', validators: ['required'] },
      role: { dataType: 'Text' },
      start_date: { title: 'Start date', type: NullText, validators: [ dateValidator ] },
      end_date: { title: 'End date', type: NullText, validators: [ dateValidator ] },
      area: {
        type: 'Object', subSchema: {
          id: {},
          name: {}
        }
      }
    }
  });

});
