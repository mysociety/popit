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
    'templates/person/compact_list',
    'popit/models/person'
  ],
  function (
    $,
    BackboneForms,
    Backbone,
    _,
    slugify,
    personTemplate,
    compactListTemplate,
    PersonModel
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

    var PossibleMatchesCollection = Backbone.Collection.extend({
      url: '/api/v1/person'
    });

    var PossibleMatchesView = Backbone.View.extend({
      tagName:   'ul',
      className: 'potential-matches',

      initialize: function() {
        var self = this;
        this.collection.bind("reset", function() { self.render() } );
      },

      render: function () {
        var content = compactListTemplate({ persons: this.collection.toJSON() });
        this.$el.html( content );
        return this;
      }
    });

    var NewPersonView = Backbone.View.extend({

      initialize: function () {
        this.form = new BackboneForms({ model: this.model });        
        this.possibleMatches     = new PossibleMatchesCollection();
        this.possibleMatchesView = new PossibleMatchesView({collection: this.possibleMatches});
      },
      
      render: function () {

        // render the template and form
        var $content = $( personTemplate({}) );
        var $form    = $( this.form.render().el );

        // add the contents of the form to the template content
        $content.find('form').prepend( $form.children() );
        
        // update our element
        this.$el.html( $content );

        // give the list to the PossibleMatches view for rendering
        this.$('ul.potential-matches').html( this.possibleMatchesView.render().el );

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
          self.possibleMatches.fetch({
            data: { name: $name.val() },
            success: function () {
              self.possibleMatchesView.render();
            }
          });          
        } else {
          self.possibleMatches.reset();
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
