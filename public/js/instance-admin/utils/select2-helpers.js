define(
  [
    'jquery',
    'underscore',
    'jquery.select2'
  ],
  function (
    $,
    _
  ) {
    "use strict"; 


    var helpers = {};
    
    /*
    
      Create the select2 arguments needed to represent a model. This includes
      fetching the details needed to fill out an id, the possible autocompletes
      etc
    
      Usage:
      
        $(input_element).select2( select2Helpers.create_arguments_for_model({
          placeholder: "e.g Joe Bloggs, Jane Smith",
          model:       PersonModel,
          errors_list: $(errors_ul_list)
        }) );     
    
    */
    
    helpers.create_arguments_for_model = function (args) {
    
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
                  text: doc.name
                };
              }
            );
            return { results: results };
          }
        },
        createSearchChoice: function (term) {
          return {
            id: 0,
            text: term
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
              object.id ?
                 "<em> &larr; select to use existing entry</em>" :
                 "<em> &larr; select to create new entry</em>"
            );
           return $element;           
         }
      };
    };
    
    
    /*
    
      Create the arguments needed for an autocompletor. This sends the request and
      marshals the response.
    
      Usage:
      
        $(title_input).select2(
          select2Helpers.create_arguments_for_autocompleter({
            placeholder:      "e.g President, CEO, Professor, Coach",
            autocomplete_url: "/autocomplete/position_title"
          })
        );
    
    */
    
    helpers.create_arguments_for_autocompleter = function (args) {
      return {
        placeholder: args.placeholder,
        ajax: {
          url: args.autocomplete_url,
          data: function (term, page) {
            return {
              term: term
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
    };
    
    
    /*
    
      Create the arguments for a partial date select box.

      If the date already has a value then the formatted string needs to be set
      as the inputs .val() so that select2 will show run the initSelection code.

      Usage:

        $(date_input).select2(a
          select2Helpers.create_arguments_for_partial_date({
            initial_date: { start: ..., end: ..., formatted: ... }
          })
        );

    */
    
    helpers.create_arguments_for_partial_date = function (args) {

      var initial_date = args.initial_date || {};

      return {
        placeholder: "no date",
        allowClear: true,
        initSelection: function (element, callback) {
          // Would also like to pre-fill input field - see https://github.com/ivaynberg/select2/issues/505

          callback({
            id:   initial_date.formatted,
            text: initial_date.formatted,
            raw:  initial_date
          });            
        },
        ajax: {
          url: '/autocomplete/partial_date',
          data: function (term, page) {
            if ( !term ) {
              term = initial_date.formatted;
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
      };
    };
    
    
    
    
    /*
    
      Helper that creates a document using the API if needed and then passes the
      id on to the next step.
      
       Usage:
      
       $.when( $.Deferred( select2Helpers.create_model_if_needed_for_data(
      PersonModel, view.$person_input.select2('data') ) ) )
      .then(function(person_id) { ... do something here ... });
    
    */
    
    helpers.create_model_if_needed_for_data = function (Model, data) {
      return function(deferred) {
        if ( data === null ) {   // no doc selected
          deferred.resolve(null);
        } else if ( data.id  ) { // existing doc selected
          deferred.resolve( data.id );
        } else { // New doc needs to be created
          new Model({
            name: data.text
          }).save({}, {
            success: function (Model, response) {
              deferred.resolve( response._id );                
            },
            error: function (Model, response) {
              deferred.reject(response);
            }
          });
        }
      };
    };
    
    return helpers;

  }
);