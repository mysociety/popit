define(
  [
    'jquery',
    'Backbone',
    'backbone-forms',
    'underscore',
    'popit/views/submit-form-helper'
  ],
  function (
    $,
    Backbone,
    BackboneForms,
    _,
    submitFormHelper
  ) {

    var ListItemEditView = Backbone.View.extend({
  
      initialize: function () {
      
        this.model.on( 'change', this.render, this );
      
        this.form = new BackboneForms({
          model: this.model,
        });
      
      },
      
      render: function () {
      
        // render the form and add save button
        var $form    = $( this.form.render().el );
        $form
          .find('ul')
            .append('<input type="submit" name="save" value="Save" />')
            .append('<button name="delete">Delete</button>');
      
        // update our element
        this.$el.html( $form );
      
        return this;
      },

      events: {
        'submit form ':                'submitForm',
        'click button[name:"delete"]': 'deleteEntry',
      },
      
      deleteEntry: function (event) {
        event.preventDefault();
        this.model.destroy();
        this.remove();
      },
      
      submitForm: function (event) {
        var view = this;
        
        var success_cb = function ( model, response ) {

          var template_args = {
            item: model.toJSON(),
            api_url_root: model.urlRoot,
          };
          
          view.$el.html( view.template( template_args ) );
        };

        var submitter = submitFormHelper({
          success_cb: success_cb,
          view: view
        });
        
        submitter(event);
      },
      
    });
  
    return ListItemEditView;
  
  }
);