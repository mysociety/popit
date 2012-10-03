define(
  [
    'jquery',
    'Backbone',
    'underscore',
    'templates/organisation/remove',
    'instance-admin/models/organisation'
  ],
  function (
    $,
    Backbone,
    _,
    organisationRemoveTemplate,
    OrganisationModel
  ) {

    var OrganisationRemoveView = Backbone.View.extend({
  
      render: function () {

        // winston.verbose( this.model.toJSON() );

        this.$el.html( organisationRemoveTemplate({
          organisation: this.model.toJSON()
        }) );
        return this;
      },
      
      events: {
        'submit form':             'submitForm',
      },
      
      submitForm: function (e) {

        e.preventDefault();
            
        this.model.destroy(
          {
            success: function (model, response) {
              document.location = '/organisation';
            },
            error: function (model, response) {
              alert("Something went wrong with the delete - please try again");
            }
          }
        );
      },
        
    });
  
    return OrganisationRemoveView;
  
  }
);