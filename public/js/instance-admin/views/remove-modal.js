define(
  [
    'Backbone',
    'underscore'
  ],
  function (
    Backbone,
    _
  ) {
    "use strict";

    var RemoveModalView = Backbone.View.extend({

      initialize: function(options) {
        this.template = _.template( options.template );
        this.submitSuccess = options.submitSuccess;
        _.bindAll(this, 'submitSuccess');
      },

      render: function () {

        this.$el.html( this.template( {
            item: this.model.toJSON()
          }
        ));
        return this;
      },

      events: {
        'submit form': 'submitForm'
      },

      submitForm: function (e) {
        e.preventDefault();
        this.model.destroy( {
          success: this.submitSuccess,
          error: function (model, response) {
            window.alert("Something went wrong with the delete - please try again");
          }
        } );
      }

    });

    return RemoveModalView;

  }
);
