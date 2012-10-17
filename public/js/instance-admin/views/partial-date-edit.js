define(
  [
    'jquery',
    'underscore',
    'Backbone',
    'templates/partial-date/person-birth-date',
    '../models/person',
    'jquery.select2'
  ],
  function (
    $,
    _,
    Backbone,
    partialDateTemplate,
    Person    
  ) {
    "use strict"; 

    // from http://stackoverflow.com/a/3067896/5349
    var format_date = function (date) {
      var yyyy = date.getFullYear().toString();
      var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
      var dd  = date.getDate().toString();
      return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]); // padding
    };

    return Backbone.View.extend({
      
      render: function () {
        var model = this.model;

        var start =  format_date( new Date(model.get('start')) );
        var end   =  format_date( new Date(model.get('end'  )) );

        var initial_value = start;
        if (start != end) {
          initial_value += ' to ' + end;
        } 

        // this is the input that we will add the smarts to
        var $date_input = $('<input type="text" />');
        $date_input.val( initial_value );
        
        // construct the whole form
        var $form = $('<form />')
          .append($date_input)
          .append('<input type="submit" value="Save" />');
          // .append('<button name="delete">Delete</button>')
          // .append('<button name="cancel">Cancel</button>');
            
        $date_input.select2({
          placeholder: "Please enter a date, either exact or partial",
          allowClear: true,
          initSelection: function (element, callback) {
            callback({
              id: element.val(),
              text: element.val()
            });
          },
          ajax: {
            url: '/autocomplete/partial_date',
            data: function (term, page) {
              if ( !term ) {
                term = $date_input.val();
              }
              return { term: term };
            },
            results: function (data) {
              // console.log( 'data', data );

              var results = _.map(data, function(item) {
                return {
                  id:   item.formatted,
                  text: item.formatted,
                  raw:  item
                };
              });

              // console.log( 'results', results );

              return { results: results };
            }
          },
          width: '100%'
        });

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
              // the same way as it is done on the server. This is fairly wasteful, but the
              // template seems to limit our options as it is not possible to easily pass
              // arguments to a partial using Jade
              
              var person = new Person();
              person.id = partialDate.id;
              person.fetch({
                success: function(model, response) {

                  // create arguments for the template that matches what we would have on the
                  // server.
                  var person_json =  model.toJSON();
                  person_json.api_base_url = model.urlRoot;
                  person_json.id           = model.id;

                  var template_args = {
                    person: person_json
                  };
                  
                  var html = partialDateTemplate( template_args );
                  var replacement =  $('<li />').html( html );

                  view.$el.parent().append( replacement );                
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