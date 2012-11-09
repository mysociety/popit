// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-person button
// ------------------------

define(
  [
    'jquery',
    'instance-admin/views/list-item-edit'
  ],
  function (
    $,
    ListItemEditView
  ) {
    "use strict"; 

    
    return function (args) {

      var Model    = args.model;

      return function(event) {
        var $link    = $(this);
        var $element = $(this).closest('li');

        event.preventDefault();

        // create contact. Might be existing one, or a new one.
        var object = new Model({});
        var id = $link.attr('data-id');
        if (id) object.id = id;
        

        // Manually set the urlRoot for this contact. It needs to include the 
        // document id that this contact is embedded in. (Don't seem to be able 
        // to set it in contructor above)
        object.urlRoot = $link.attr('data-url-root');

        // create the view. Hook it up to the enclosing element.
        var view = new ListItemEditView({
          model:    object,
          el:       $element
        });

        // set the template on the view
        view.template = args.template;
        
        if (object.isNew()) {
          // clone the li item so that the 'create new' link is still present.
          $element.after( $element.clone() );
          // render the form - no need to fetch content.
          view.render();
        } else {
          // If it is existing then fetch latest details from the API (they'll
          // get rendered by the 'change' event).
          object.fetch();
        }
        
      };
    };

  }
);
