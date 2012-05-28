// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-person button
// ------------------------

require(   [ 'jquery', 'backbone-forms', 'Backbone', 'underscore' ],
  function (  $,        BackboneForms,    Backbone,   _           ) {

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
      schema: {
        name: { dataType: 'Text', validators: ['required'] },
        slug: { dataType: 'Text' },
      }
    });

    var NewPersonView = Backbone.View.extend({

      render: function () {
        // put in init
        var form = this.form || new BackboneForms({ model: this.model });
        this.form = form;
        form.render();
        $(form.el).append('<input type="submit" value="save" />');
        this.$el.append(form.el);
        return this;
      },
      
      events: {
        'submit form ': 'submitForm',
      },
      
      submitForm: function (e) {
        e.preventDefault();

        var self   = this;
        var form   = self.form;        
        var errors = form.commit();

        if (_.isEmpty(errors)) {
          this.model.save(
            {},
            {
              success: function (model, response) {
                document.location = response.meta.edit_url;
              },
              error: function (model, response) {
                var errors = $.parseJSON( response.responseText ).errors || {};
                _.each(errors, function(val, key) {
                  form.fields[key] && form.fields[key].setError(val);
                });         
              }
            }
          );
        }

      },


    });


    $(function() {
  
    	$('#new-person').click(function(event) {

        event.preventDefault();
        
        var person = new PersonModel({});
        var view   = new NewPersonView({model: person});

        view.render();

        var $replacement = view.$el;
        $replacement.hide();
        $(this).hide().replaceWith( $replacement );
        $replacement.slideDown();

        view.$(':input:first').focus();
    	});
  
    });
  }
);
