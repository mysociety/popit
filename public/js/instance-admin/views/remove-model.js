define(
  [
    'instance-admin/views/remove-modal',
    'underscore'
  ],
  function (
    RemoveModalView,
    _
  ) {
    "use strict";

    var RemoveModelView = RemoveModalView.extend({

      initialize: function(options) {
        RemoveModalView.prototype.initialize.apply(this, arguments);
        this.submitSuccess = options.submitSuccess;
        _.bindAll(this, 'submitSuccess');
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

    return RemoveModelView;

  }
);
