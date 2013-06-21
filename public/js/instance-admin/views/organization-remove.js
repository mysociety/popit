define(
  [
    'jquery',
    'Backbone',
    'underscore',
    'text!templates/organization/remove.html',
    'instance-admin/models/organization'
  ],
  function (
    $,
    Backbone,
    _,
    orgTemplate,
    OrganizationModel
  ) {
    "use strict"; 

    var OrganizationRemoveView = Backbone.View.extend({
  
      orgTemplate: _.template( orgTemplate ),

      render: function () {

        // winston.verbose( this.model.toJSON() );

        this.$el.html( this.orgTemplate( {
            organization: this.model.toJSON()
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
              document.location = '/organization';
            },
            error: function (model, response) {
              window.alert("Something went wrong with the delete - please try again");
            }
          }
        );
      }
        
    });
  
    return OrganizationRemoveView;
  
  }
);
