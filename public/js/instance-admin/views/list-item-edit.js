define(
  [
    'jquery',
    'underscore',
    'Backbone',
    'backbone-forms',
    'instance-admin/views/submit-form-helper',
    'jqueryui/autocomplete'
  ],
  function (
    $,
    _,
    Backbone,
    BackboneForms,
    submitFormHelper
  ) {
    "use strict"; 

    var ListItemEditView = Backbone.View.extend({
  
      initialize: function () {
      
        this.form = new BackboneForms({
          model: this.model
        });
        
      },
      
      render: function () {
        var model_schema = this.model.schema;
      
        // render the form and add save button
        var $form    = $( this.form.render().el );
        $form
          .find('ul')
            .append('<input type="submit" name="save" value="Save" />')
            .append('<button name="delete">Delete</button>')
            .append('<button name="cancel">Cancel</button>');
      
        // add an autocomplete to those fields that want one
        var ac_field_names = _.filter(
          _.keys(model_schema),
          function(field_name) {
            return model_schema[field_name].autocomplete_source;
          }
        );

        _.each( ac_field_names, function ( field_name ) {
          
          var ac_source = model_schema[field_name].autocomplete_source;
          
          $form
            .find('input[name="' + field_name + '"]')
            .autocomplete({
              source: ac_source
            });
          
        });
      
        // update our element
        this.$el.html( $form );
      
        return this;
      },

      events: {
        'submit form ':                'submitForm',
        'click button[name="cancel"]': 'cancelEntry',
        'click button[name="delete"]': 'deleteEntry'
      },
      
      deleteEntry: function (event) {
        event.preventDefault();
        this.model.destroy();
        this.remove();
      },
      
      cancelEntry: function (event) {
        event.preventDefault();
        if ( this.model.exists ) {
          // model soved on server - re-render it.
          this.render_listing();
        } else {
          // model a new one - remove the whole input form.
          this.remove();
        }
      },
      
      render_listing: function () {
        var view = this;

        var template_args = {
          item: this.model.toJSON()
        };
        
        view.$el.html( view.options.template( template_args ) );
      },


      submitForm: function (e) {
        e.preventDefault();
        var form = this.form,
            model = this.model,
            errors = form.commit();
        if (_.isEmpty(errors)) {
          this.render_listing();
          if (model.direct) {
              model.save();
          }
          if (!model.exists) {
              model.collection.add(model);
          }
        }
      }

    });
  
    return ListItemEditView;
  
  }
);
