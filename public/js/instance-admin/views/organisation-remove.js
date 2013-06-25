define(
  [
    'jquery',
    'Backbone',
    'underscore',
    'text!templates/organisation/remove.html',
    'instance-admin/models/organisation'
  ],
  function (
    $,
    Backbone,
    _,
    orgTemplate,
    OrganisationModel
  ) {
    "use strict"; 

    var OrganisationRemoveView = Backbone.View.extend({
  
      orgTemplate: _.template( orgTemplate ),

      render: function () {

        // winston.verbose( this.model.toJSON() );

        this.$el.html( this.orgTemplate( {
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
