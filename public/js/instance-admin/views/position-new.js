define(
  [
    'jquery',
    'Backbone',
    'backbone-forms',
    'underscore',
    'templates/position/new',
    'instance-admin/models/person',
    'instance-admin/models/organisation',
    'instance-admin/models/position',
    'instance-admin/views/submit-form-helper',
    'instance-admin/views/suggestions',
    'jquery.select2'   
    
  ],
  function (
    $,
    Backbone,
    BackboneForms,
    _,
    positionNewTemplate,
    PersonModel,
    OrganisationModel,
    PositionModel,
    submitFormHelper,
    SuggestionsView
  ) {
    
    function select2_create_arguments_for_model (args) {

      // get the api url from the model
      var ajax_url = new args.model().urlRoot;

      return {
        placeholder: args.placeholder,
        allowClear: true,
        ajax: {
          url: ajax_url,
          data: function (term, page) {
            return {
              name: term
            };
          },
          results: function (data, page) {
            var results = _.map(
              data,
              function (doc) {
                return {
                  id: doc._id,
                  text: doc.name,
                };
              }
            );
            return { results: results };
          }
        },
        createSearchChoice: function (term) {
          return {
            id: 0,
            text: term,
          };
        },
        initSelection: function (element, callback) {
          var val = element.val();
          if ( !val )
            return callback(null);

          var obj = new args.model({id: val});
          obj.fetch({
            success: function (model, response) {
              callback({ id: response._id, text: response.name });
            },
            error: function (model, response) {
              args.errors_list.append("<li>Could not fetch model from server</li>");
              callback(null);
            }
          });
         },
         formatSelection: function (object, container) {
           var text = object.text;
           if (!object.id) text += " <em>(new entry)</em>"; 
           return text;
         },
         formatResult: function (object, container) {
           var $element = $('<span>').text(object.text);
           $element.append(
              object.id
                 ? "<em> &larr; select to use existing entry</em>"
                 : "<em> &larr; select to create new entry</em>"
            );
           return $element;           
         }
      };
    }
    
    function select2_create_arguments_for_autocompleter (args) {
      return {
        placeholder: args.placeholder,
        ajax: {
          url: args.autocomplete_url,
          data: function (term, page) {
            return {
              term: term,
            };
          },
          results: function (data, page) {
            return {
              results: _.map( data, function(i) { return {id: i, text: i}; } )
            };
          }
        },
        createSearchChoice: function (term) {
          return {
            id: term,
            text: term
          };
        }
      };
    }
    
    function create_model_if_needed_for_select2_data (model, data) {
      return function(deferred) {
        if ( data === null ) {   // no doc selected
          deferred.resolve(null);
        } else if ( data.id  ) { // existing doc selected
          deferred.resolve( data.id );
        } else { // New doc needs to be created
          new model({
            name: data.text,
          }).save({}, {
            success: function (model, response) {
              deferred.resolve( response._id );                
            },
            error: function (model, response) {
              deferred.reject(response);
            }
          });
        }
      };
    };
    
    

    var PositionNewView = Backbone.View.extend({
  
      // initialize: function () {},
      
      render: function () {
  
        // Render the template
        var $content = $( positionNewTemplate({}) );
  
        // find the bits that are interesting and store them for easy access
        this.$title_input        = $content.find('[name=title]');
        this.$person_input       = $content.find('[name=person]');
        this.$organisation_input = $content.find('[name=organisation]');
        this.$errors_list        = $content.find('ul.error');
        
        // If we have some details aready set store them
        this.$title_input.val(        this.model.get('title') );
        this.$person_input.val(       this.model.get('person') );
        this.$organisation_input.val( this.model.get('organisation') );
        
        // set up the title as an autocompletor
        this.$title_input.select2(
          select2_create_arguments_for_autocompleter({
            placeholder:      "e.g President, CEO, Professor, Coach",
            autocomplete_url: "/autocomplete/position_title"
          })
        );

        // set up the model lookups
        this.$person_input.select2( select2_create_arguments_for_model({
          placeholder: "e.g Joe Bloggs, Jane Smith",
          model:       PersonModel,
          errors_list: this.$errors_list
        }) );
        this.$organisation_input.select2( select2_create_arguments_for_model({
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
        'submit form ':             'submitForm',
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
            create_model_if_needed_for_select2_data(
              PersonModel,
              view.$person_input.select2('data')
            )
          ),
          $.Deferred(
            create_model_if_needed_for_select2_data(
              OrganisationModel,
              view.$organisation_input.select2('data')
            )
          )
        )
        .then(function(person_id, organisation_id) {

          // create a new position
          var position = new PositionModel({
            person: person_id,
            organisation: organisation_id,
            title: job_title
          });

          // Save it
          position.save({},{
            success: function (model, response ) {
              document.location = response.meta.edit_url;              
            },
            error: function (model, response) {
              view.$errors_list.append('<li>Something went wrong saving the position to the server.</li>');
            }
          });
        });
      },
        
    });
  
    return PositionNewView;
  
  }
);