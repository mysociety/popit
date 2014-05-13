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
          .find('ul').first()
            .append('<input type="submit" name="save" value="Save" />')
            .append('<a class="delete"><i class="foundicon-trash"></i> Delete</a> ')
            .append('<a class="cancel">Cancel</a>');
      
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
        'submit form': 'submitForm',
        'click a.cancel': 'cancelEntry',
        'click a.delete': 'deleteEntry'
      },
      
      deleteEntry: function (event) {
        event.preventDefault();
        // removing from the collection fires the save event on the
        // model in which they are nested for most things so we don't
        // need to destroy them
        this.model.collection.remove(this.model.cid);
        // posts aren't a nested collection so we explicitely need
        // to destroy them
        if ( $(this).parent('ul.posts').length ) {
          this.model.destroy();
        }
        this.remove();
      },
      
      cancelEntry: function (event) {
        event.preventDefault();
        if ( this.model.exists ) {
          // model saved on server - re-render it.
          this.render_listing();
        } else {
          // model a new one - remove the whole input form.
          this.remove();
        }
      },
      
      render_listing: function () {
        var template_args = {
          item: this.model.toJSON()
        };

        this.$el.html( this.options.template( template_args ) );
        this.$el.children('.view-mode').hide();
        this.$el.children('.edit-mode').show();
        return this;
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
              model.collection.add(model, { at: 0 });
          }
          this.undelegateEvents(); // As might be different view next time
        }
      }

    });
  
    return ListItemEditView;
  
  }
);
