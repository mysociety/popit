define( [ 'Backbone', 'backbone-forms' ], function ( Backbone, BackboneForms ) {
  "use strict"; 

  var NullText = BackboneForms.editors.Text.extend({
    getValue: function() {
      return this.$el.val() || null;
    }
  });

  var dateValidator = /^[0-9]{4}(-[0-9]{2}){0,2}$/;

  var OtherNameModel = Backbone.Model.extend({
    schema: {
      name: { dataType: 'Text', validators: [ 'required' ] },
      start_date: { title: 'Start date', type: NullText, validators: [ dateValidator ] },
      end_date: { title: 'End date', type: NullText, validators: [ dateValidator ] },
      note: { dataType: 'Text' }
    }
  });

  return OtherNameModel;

});
