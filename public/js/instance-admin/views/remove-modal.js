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
      },

      render: function (args) {
        args = _.extend({}, args);
        if (this.model) {
          args.item = this.model.toJSON();
        }
        this.$el.html( this.template( args ) );
        return this;
      }

    });

    return RemoveModalView;

  }
);
