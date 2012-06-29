define(
  [
    'jquery',
    'Backbone',
    'backbone-forms',
    'underscore',
    'utils/slugify',
    'templates/person/new',
    'popit/models/person',
    'popit/views/submit-form-helper'
  ],
  function (
    $,
    Backbone,
    BackboneForms,
    _,
    slugify,
    personNewTemplate,
    PersonModel,
		submitFormHelper
  ) {

    var PersonBasicsView = Backbone.View.extend({
  
      initialize: function () {
        this.form = new BackboneForms({
					model: this.model,
					fields: ['name', 'summary']
				});
      },
      
      render: function () {
  
        // render the template and form
        var $content = $( personNewTemplate({}) );
        var $form    = $( this.form.render().el );
  
        // add the contents of the form to the template content
        $content.find('form').prepend( $form.children() );
        
        // update our element
        this.$el.html( $content );
  
        return this;
      },
      
      events: {
        'submit form': 'submitForm'
      },
      
			submitForm: submitFormHelper
        
    });
  
    return PersonNewView;
  
  }
);