define(
  [
    'jquery',
    'Backbone',
    'backbone-forms',
    'underscore',
    'templates',
    'instance-admin/models/person',
    'instance-admin/views/suggestions'
  ],
  function (
    $,
    Backbone,
    BackboneForms,
    _,
    templates,
    PersonModel,
    submitFormHelper,
    SuggestionsView
  ) {
    "use strict"; 

    var PersonRemoveView = Backbone.View.extend({
  
      render: function () {

        // winston.verbose( this.model.toJSON() );

        this.$el.html( templates.render(
          'person/remove.html',
          {
            person: this.model.toJSON()
          }
        ));
        return this;
      },
      
      events: {
        'submit form': 'submitForm'
      },
      
      submitForm: function (e) {

        e.preventDefault();
            
        this.model.destroy(
          {
            success: function (model, response) {
              document.location = '/person';
            },
            error: function (model, response) {
              window.alert("Something went wrong with the delete - please try again");
            }
          }
        );
      }
        
    });
  
    return PersonRemoveView;
  
  }
);