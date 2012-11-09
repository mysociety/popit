define(
  [
    'jquery',
    'underscore',
    'Backbone',
    'templates',
    '../models/person',
    'instance-admin/utils/select2-helpers'
  ],
  function (
    $,
    _,
    Backbone,
    templates,
    Person,
    select2Helpers
  ) {
    "use strict"; 

    // from http://stackoverflow.com/a/3067896/5349
    var format_date = function (dateOrString) {
      var date = new Date(dateOrString);
      var yyyy = date.getFullYear().toString();
      var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
      var dd  = date.getDate().toString();
      return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]); // padding
    };

    return Backbone.View.extend({
      
      render: function () {
        var model = this.model;

        var start, end, initial_value;
        
        if (model.get('start')) {
          start =  format_date( model.get('start') );
          end   =  format_date( model.get('end'  ) );

          initial_value = start;
          if (start != end) {
            initial_value += ' to ' + end;
          }           
        }

        // this is the input that we will add the smarts to
        var $date_input = $('<input type="text" name="' + model.path_to_date + '"/>');

        // Set the initial value - needed so that select2 will run the initSelection block
        $date_input.val( initial_value );
        // $date_input.data({ raw: _.clone(model.attributes) });
        
        // construct the whole form
        var $form = $('<form />')
          .append($date_input)
          .append('<input type="submit" value="Save" />');
          // .append('<button name="delete">Delete</button>')
          // .append('<button name="cancel">Cancel</button>');
            
            
        $date_input.select2(
          select2Helpers.create_arguments_for_partial_date({
            initial_date: {
              start:     start,
              end:       end,
              formatted: initial_value
            }
          })
        );

        // update our element
        this.$el.html( $form );
      
        return this;
      },
    
      events: {
        'submit form ': 'submitForm'
      },
                
      submitForm: function (event) {

        event.preventDefault();

        var data = this.$el.find('input[type="text"]').select2('data');        

        var view = this;
        var partialDate = this.model;

        data = data || {
          raw: {
            start: '',
            end: ''
          }
        };
        
        partialDate.save(
          {
            start: data.raw.start,
            end:   data.raw.end
          },
          {
            success: function (model, response) {

              // We are fetching the whole model here so that we can process the template in
              // the same way as it is done on the server. This is fairly wasteful, and we
              // should look at changing it.
              
              var person = new Person();
              person.id = partialDate.id;
              person.fetch({
                success: function(model, response) {

                  // create arguments for the template that matches what we would have on the
                  // server.
                  var person_json =  model.toJSON();
                  person_json.api_base_url = model.urlRoot;
                  person_json.id           = model.id;

                  // hacky little function to recurse down the object and extract the part we are
                  // interested in.
                  var drill_down = function ( dotted_path, object ) {
                    if (!dotted_path) return object;

                    var paths = dotted_path.split('.');
                    var first = paths.shift();
                    var remaining = paths.join('.');

                    return drill_down( remaining, object[first] );                    
                  };

                  var template_args = {
                    person:           person_json,
                    date:             drill_down( partialDate.link_data.pathPrefix, person_json ),
                    data_path_prefix: partialDate.link_data.pathPrefix,
                    data_url_root:    partialDate.link_data.urlRoot,
                    data_id:          partialDate.link_data.id,
                    title:            partialDate.link_data.title
                  };
                  
                  var html = templates.render( 'partial-date/view.html', template_args );
                  var replacement = view.$el.clone().empty().html( html );

                  view.$el.after( replacement );                
                  view.remove();
                },
                error: function(model, response) {
                  // TODO improve error handling
                  window.alert("Something went wrong fetching person to render template");
                }                
              });


            },
            error: function(model, response) {
              // TODO improve error handling
              window.alert("Something went wrong saving the date");
            }
          }
        );
      }
      
    });
  
  }
);