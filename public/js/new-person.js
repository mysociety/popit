// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-person button
// ------------------------

require(   [ 'jquery', 'backbone', 'templates/person/new' ],
  function (  $,        Backbone,  template               ) {

    // handle the API wrapping the responses in result(s): {...}
    $.ajaxSetup({
      converters: {
        "text json": function (json) {
          var data = $.parseJSON(json);
          return data.results || data.result || data;
        }
      }
    });

    var PersonModel = Backbone.Model.extend({
      urlRoot: '/api/v1/person',
    });

    var NewPersonView = Backbone.View.extend({
      render: function () {
        console.log('render', this.model.toJSON() );
        this.$el.html( template({ person: this.model.toJSON() }) );
        return this;
      },
      
      events: {
        'submit form ': 'submitForm',
      },
      
      submitForm: function (e) {
        e.preventDefault();
        var self = this;

        this.model.save(
          {
            name: this.$('input[name=name]').val(),
            slug: this.$('input[name=slug]').val(),            
          },
          {
            wait: true,
            success: function (model, response) {
              document.location = response.meta.edit_url;
            },
            error: function (model, response) {
              var errors = $.parseJSON( response.responseText ).errors || {};

              self.$('input').siblings('span.error').text('');
              _.each(errors, function( value, key) {
                self.$('input[name=' + key + ']').siblings('span.error').text(value);
              });
            }
          }
        );

        console.log('form submit', name);
      },
    });


    $(function() {
  
    	$('#new-person').click(function(event) {
        event.preventDefault();
        
        var person = new PersonModel({});
        
        var view = new NewPersonView({model: person});
        view.render();
        var $replacement = view.$el;
        $replacement.hide();
        $(this).hide().replaceWith( $replacement );
        $replacement.slideDown();
    	});
  
    });
  }
);
