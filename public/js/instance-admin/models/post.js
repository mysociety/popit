define( [ 'Backbone', 'backbone-forms' ], function ( Backbone, BackboneForms ) {
  "use strict"; 

  var NullText = BackboneForms.editors.Text.extend({
    getValue: function() {
      return this.$el.val() || null;
    }
  });

  return Backbone.Model.extend({
    urlRoot: '/api/v0.1/posts',
    schema: {
      label: { dataType: 'Text', validators: ['required'] },
      role: { dataType: 'Text' },
      start_date: { title: 'Start date', type: NullText },
      end_date: { title: 'End date', type: NullText },
      area: {
        type: 'Object', subSchema: {
          id: {},
          name: {}
        }
      }
    }
  });

});
