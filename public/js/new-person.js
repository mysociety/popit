// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-person button
// ------------------------

require(   [ 'jquery', 'backbone-forms', 'Backbone', 'underscore', 'slugify' ],
  function (  $,        BackboneForms,    Backbone,   _          ,  slugify  ) {

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
        slug: { dataType: 'Text', validators: ['required'] },
      }
    });

    var NewPersonView = Backbone.View.extend({

      initialize: function () {
        this.form = new BackboneForms({ model: this.model });        
      },
      
      render: function () {
        var form = this.form;
        form.render();
        $(form.el).append('<input type="submit" value="save" />');
        this.$el.append(form.el);
        return this;
      },
      
      events: {
        'submit form ':             'submitForm',
        'keyup input[name=name]':   'nameEdit',
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
      
      // When the name is being entered we should fill in the slug. This will
      // let the user edit the slug, or see that it can't be generated from the
      // name. Also means that we don't need to explain why that field is there.
      nameEdit: function (e) {
        var $name = this.$(':input[name=name]');
        var $slug = this.$(':input[name=slug]');

        // console.log( String.fromCharCode(e.which) );
        
        $slug.val( slugify( $name.val() ) );
                
        return true;
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
