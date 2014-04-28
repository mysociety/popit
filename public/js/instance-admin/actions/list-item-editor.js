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
      var defaults = args.defaults || {};

      return function(event) {
        event.preventDefault();

        var $link    = $(this);
        var $element = $link.hasClass('add') ?
            null :
            $link.closest('li');

        if (!$element || !$element.length) {
            $element = $('<li/>');
            $link.closest('ul').prepend($element);
        }

        var cid = $element.data('id'),
            object;

        // create contact. Might be existing one, or a new one.
        if (cid) {
            object = collection.get(cid);
            object.exists = true;
        } else {
            object = new collection.model(defaults, { collection: collection });
            object.exists = false;
            $element.data('id', object.cid);
        }
        object.direct = args.direct;
        
        // create the view. Hook it up to the enclosing element.
        var view = new ListItemEditView({
          template: _.template(args.template),
          model:    object,
          el:       $element
        });

        view.render();
      };
    };

  }
);
