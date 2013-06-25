define(
  [
    'jquery',
    'Backbone',
    'backbone-forms',
    'underscore',
    'text!templates/person/remove.html',
    'instance-admin/models/person'
  ],
  function (
    $,
    Backbone,
    BackboneForms,
    _,
    personTemplate,
    PersonModel
  ) {
    "use strict"; 

    var PersonRemoveView = Backbone.View.extend({
  
      personTemplate: _.template( personTemplate ),

      render: function () {

        // winston.verbose( this.model.toJSON() );

        this.$el.html( this.personTemplate( {
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
