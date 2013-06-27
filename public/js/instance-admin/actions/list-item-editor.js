// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-person button
// ------------------------

define(
  [
    'jquery',
    'underscore',
    'instance-admin/views/list-item-edit'
  ],
  function (
    $,
    _,
    ListItemEditView
  ) {
    "use strict"; 

    
    return function (args) {

      var collection = args.collection;

      return function(event) {
        event.preventDefault();

        var $link    = $(this),
            $element = $link.closest('li'),
            cid = $element.data('id'),
            object;

        // create contact. Might be existing one, or a new one.
        if (cid) {
            object = collection.get(cid);
            object.exists = true;
        } else {
            object = new collection.model({}, { collection: collection });
            object.exists = false;
        }
        
        // create the view. Hook it up to the enclosing element.
        var view = new ListItemEditView({
          template: _.template(args.template),
          model:    object,
          el:       $element
        });

        if (!cid) {
          // clone the li item so that the 'create new' link is still present.
          $element.after( $element.clone() );
          $element.data('id', object.cid);
        }

        view.render();
      };
    };

  }
);
