define(
  [
    'jquery',
    'Backbone',
    'underscore',
    'text!templates/membership/remove.html',
    'instance-admin/models/membership'
  ],
  function (
    $,
    Backbone,
    _,
    mTemplate,
    MembershipModel
  ) {
    "use strict";

    var MembershipRemoveView = Backbone.View.extend({

      mTemplate: _.template( mTemplate ),

      render: function () {
        this.$el.html( this.mTemplate( {
        } ) );
        return this;
      },

      events: {
        'submit form': 'submitForm'
      },

      submitForm: function (e) {

        e.preventDefault();
        var view = this;
        this.model.destroy(
          {
            success: function (model, response) {
              // Remove attached membership row, and this view
              view.options.attached.remove();
              $.fancybox.close();
              view.remove();
            },
            error: function (model, response) {
              window.alert("Something went wrong with the delete - please try again");
            }
          }
        );
      }

    });

    return MembershipRemoveView;

  }
);
