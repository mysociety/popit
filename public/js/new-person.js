// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-person button
// ------------------------

require(
  [
    'jquery',
    'backbone-forms',
    'Backbone',
    'underscore',
    'utils/slugify',
    'templates/person/new',
    'popit/models/person',
    'popit/views/suggestions',
    'popit/collections/suggestions'
  ],
  function (
    $,
    BackboneForms,
    Backbone,
    _,
    slugify,
    personTemplate,
    PersonModel,
    SuggestionsView,
    SuggestionsCollection
  ) {

    // handle the API wrapping the responses in result(s): {...}
    $.ajaxSetup({
      converters: {
        "text json": function (json) {
          var data = $.parseJSON(json);
          return data.results || data.result || data;
        }
      }
    });

    var NewPersonView = Backbone.View.extend({

      initialize: function () {
        this.form = new BackboneForms({ model: this.model });        
        this.suggestions     = new SuggestionsCollection();
        this.suggestionsView = new SuggestionsView({collection: this.suggestions});
      },
      
      render: function () {

        // render the template and form
        var $content = $( personTemplate({}) );
        var $form    = $( this.form.render().el );

        // add the contents of the form to the template content
        $content.find('form').prepend( $form.children() );
        
        // update our element
        this.$el.html( $content );

        // give the list to the Suggestions view for rendering
        this.$('ul.suggestions').html( this.suggestionsView.render().el );

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
      
      nameEdit: function (e) {
        // When the name is being entered we should fill in the slug. This will
        // let the user edit the slug, or see that it can't be generated from the
        // name. Also means that we don't need to explain why that field is there.
        var $name = this.$(':input[name=name]');
        var $slug = this.$(':input[name=slug]');
        $slug.val( slugify( $name.val() ) );
                
        // Try to load matching people from the server and display them in the
        // 'possible matches' list.
        var self = this;
        
        if ($name.val()) {
          self.suggestions.fetch({
            data: { name: $name.val() },
            success: function () {
              self.suggestionsView.render();
            }
          });          
        } else {
          self.suggestions.reset();
        }
        
        

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
