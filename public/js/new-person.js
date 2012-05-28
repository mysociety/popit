// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-person button
// ------------------------

require(   [ 'jquery', 'backbone', 'templates/person/new' ],
  function (  $,        Backbone,  template               ) {

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

        this.model.set({
          name: this.$('input[name=name]').val(),
          slug: this.$('input[name=slug]').val(),
        });

        this.model.save();

        console.log('form submit', name);
      },
    });


    $(function() {
  
    	$('#new-person').click(function(event) {
        event.preventDefault();
        
        var person = new PersonModel({name: 'test name', slug: 'test-slug'});
        
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
