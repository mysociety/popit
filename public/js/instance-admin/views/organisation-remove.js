define(
  [
    'jquery',
    'Backbone',
    'underscore',
    'templates',
    'instance-admin/models/organisation'
  ],
  function (
    $,
    Backbone,
    _,
    templates,
    OrganisationModel
  ) {
    "use strict"; 

    var OrganisationRemoveView = Backbone.View.extend({
  
      render: function () {

        // winston.verbose( this.model.toJSON() );

        this.$el.html( templates.render(
          'organisation/remove.html',
          {
            organisation: this.model.toJSON()
          }
        ) );
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
              document.location = '/organisation';
            },
            error: function (model, response) {
              window.alert("Something went wrong with the delete - please try again");
            }
          }
        );
      }
        
    });
  
    return OrganisationRemoveView;
  
  }
);