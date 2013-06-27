define( [ 'Backbone', 'backbone-forms' ], function ( Backbone, BackboneForms ) {
  "use strict"; 

  var NullText = BackboneForms.editors.Text.extend({
    getValue: function() {
      return this.$el.val() || null;
    }
  });

  var OtherNameModel = Backbone.Model.extend({
    schema: {
      name: { dataType: 'Text', validators: [ 'required' ] },
      start_date: { title: 'Start date', type: NullText },
      end_date: { title: 'End date', type: NullText },
      note: { dataType: 'Text' }
    }
  });

  return OtherNameModel;

});
