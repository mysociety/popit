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

    var PositionNewView = Backbone.View.extend({
  
      // initialize: function () {},
      
      render: function () {
  
        // render the template and form
        var $content = $( positionNewTemplate({}) );
  
        this.$title_input = $content.find('[name=title]');
        this.$title_input.select2({
          placeholder: "Job Title",
          minimumInputLength: 1,
          ajax: {
            url: "/autocomplete/position_title",
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
        });

        var select2_args = function (args) {
          return {
            placeholder: args.placeholder,
            minimumInputLength: 1,
            allowClear: true,
            ajax: {
              url: args.ajax_url,
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
            }
          };
        }

        this.$person_input = $content.find('[name=person]');
        this.$person_input.select2( select2_args({
          placeholder: "Person's Name",
          ajax_url: "/api/v1/person",
        }) );
          
        this.$organisation_input = $content.find('[name=organisation]');
        this.$organisation_input.select2( select2_args({
          placeholder: "Organisation's Name",
          ajax_url: "/api/v1/organisation",
        }) );          
  
        // update our element
        this.$el.html( $content );
  
        return this;
      },
      
      events: {
        'submit form ':             'submitForm',
      },
      
      submitForm: function (e) {
        e.preventDefault();
        
        var view = this;

        // Get the title, error if it is not set
        var job_title_data = view.$title_input.select2('data');
        var job_title = job_title_data ? job_title_data.text : false;        
        if (!job_title) {
          alert("Job Title required - FIXME don't use an alert" );
          return;
        }
        

        var create_model_if_needed = function (model, data) {
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


        $.when(
          // get the person id, creating them if needed.
          $.Deferred(
            create_model_if_needed(
              PersonModel,
              view.$person_input.select2('data')
            )
          ),
          $.Deferred(
            create_model_if_needed(
              OrganisationModel,
              view.$organisation_input.select2('data')
            )
          )
        )
        .then(function(person_id, organisation_id) {
          var position = new PositionModel({
            person: person_id,
            organisation: organisation_id,
            title: job_title
          });
          position.save({},{
            success: function (model, response ) {
              console.log(response);
              document.location = response.meta.edit_url;              
            },
            error: function (model, response) {
              alert('something went wrong');
              console.log("ERROR:", response);
            }
          });
        });
      },
        
    });
  
    return PositionNewView;
  
  }
);