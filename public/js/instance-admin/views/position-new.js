define(
  [
    'jquery',
    'Backbone',
    'backbone-forms',
    'underscore',
    'text!templates/position/new.html',
    'instance-admin/models/person',
    'instance-admin/models/organisation',
    'instance-admin/models/position',
    'instance-admin/utils/select2-helpers'   
    
  ],
  function (
    $,
    Backbone,
    BackboneForms,
    _,
    positionTemplate,
    PersonModel,
    OrganisationModel,
    PositionModel,
    select2Helpers
  ) {
    "use strict"; 
  
    var PositionNewView = Backbone.View.extend({
  
      positionTemplate: _.template(positionTemplate),
      // initialize: function () {},
      
      render: function () {
  
        // Render the template
        var $content = $( this.positionTemplate() );
  
        // find the bits that are interesting and store them for easy access
        this.$title_input        = $content.find('[name=title]');
        this.$person_input       = $content.find('[name=person]');
        this.$organisation_input = $content.find('[name=organisation]');
        this.$start_date_input   = $content.find('[name=start-date]');
        this.$end_date_input     = $content.find('[name=end-date]');
        this.$errors_list        = $content.find('ul.error');
        
        // If we have some details aready set store them
        this.$title_input.val(        this.model.get('title') );
        this.$person_input.val(       this.model.get('person') );
        this.$organisation_input.val( this.model.get('organisation') );
        
        // set up the title as an autocompletor
        this.$title_input.select2(
          select2Helpers.create_arguments_for_autocompleter({
            placeholder:      "e.g President, CEO, Professor, Coach",
            autocomplete_url: "/autocomplete/position_title"
          })
        );

        // set up the model lookups
        this.$person_input.select2( select2Helpers.create_arguments_for_model({
          placeholder: "e.g Joe Bloggs, Jane Smith",
          model:       PersonModel,
          errors_list: this.$errors_list
        }) );
        this.$organisation_input.select2( select2Helpers.create_arguments_for_model({
          placeholder: "e.g Apple Inc, UK Parliament, Kenyatta University",
          model:       OrganisationModel,
          errors_list: this.$errors_list
        }) );
        
        // hide inputs if requested (not happy with this - not very elegant :( )
        if (this.options.fields_to_hide.title        ) $content.find('p.title').hide();
        if (this.options.fields_to_hide.person       ) $content.find('p.person').hide();
        if (this.options.fields_to_hide.organisation ) $content.find('p.organisation').hide();
        
        // add our content to the page
        this.$el.html( $content );
  
        return this;
      },
      
      events: {
        'submit form': 'submitForm'
      },
      
      submitForm: function (e) {
        e.preventDefault();
        
        var view = this;

        // clear the errors
        view.$errors_list.html('');

        // Get the title, error if it is not set
        var job_title_data = view.$title_input.select2('data');
        var job_title = job_title_data ? job_title_data.text : false;        
        if (!job_title) {
          view.$errors_list.append("<li>Title is required</li>");
          return;
        }

        // for the person and organisation create the entry on the server if
        // it is a new one (ie does not have an id)
        $.when(
          // get the person id, creating them if needed.
          $.Deferred(
            select2Helpers.create_model_if_needed_for_data(
              PersonModel,
              view.$person_input.select2('data')
            )
          ),
          $.Deferred(
            select2Helpers.create_model_if_needed_for_data(
              OrganisationModel,
              view.$organisation_input.select2('data')
            )
          )
        )
        .then(function(person_id, organisation_id) {

          var start_date_data = view.$start_date_input.select2('data') || {};
          var end_date_data   = view.$end_date_input.select2('data')   || {};

          // create a new position
          var position = new PositionModel({
            person:       person_id,
            organisation: organisation_id,
            title:        job_title,
            start_date:   start_date_data.raw || {},
            end_date:     end_date_data.raw   || {}
          });
          
          // Save it
          position.save({},{
            success: function (model, response ) {
                document.location.reload();
            },
            error: function (model, response) {
              view.$errors_list.append('<li>Something went wrong saving the position to the server.</li>');
            }
          });
        });
      }
        
    });
  
    return PositionNewView;
  
  }
);
