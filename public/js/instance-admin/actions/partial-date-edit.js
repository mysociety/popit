// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-person button
// ------------------------

define(
  [
    'jquery',
    'instance-admin/app',
    'instance-admin/models/partial-date',
    'instance-admin/views/partial-date-edit'
  ],
  function (
    $,
    App,
    PartialDateModel,
    PartialDateEditView
  ) {
    "use strict"; 

    App.addInitializer(function(options){

      $('#content').on(
        'click',
        'a.partial-date-edit',
        function(event) {

          event.preventDefault();

          var $link      = $(this);
          var $element   = $(this).closest('li');
          var link_data  = $link.data();

          // create the date model object. The id used is that of the parent document.
          // Also record the path to the partial date so that an update can be sent that
          // only touches the date.
          var dateObject = new PartialDateModel({
            start: link_data.start,
            end:   link_data.end
          });
          dateObject.id            = link_data.id;
          dateObject.urlRoot       = link_data.urlRoot;
          dateObject.path_to_date  = link_data.pathPrefix;
          dateObject.link_data     = link_data;
          
          
          // create the view. Hook it up to the enclosing element.
          var view = new PartialDateEditView({
            model:    dateObject,
            el:       $element
          });
          
          view.render();

        }
        
      );

    });
  }
);
