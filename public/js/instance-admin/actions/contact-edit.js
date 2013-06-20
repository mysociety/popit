// Launch a backbone powered entry box when someone adds/edits a contact

define(
  [
    'jquery',
    'instance-admin/app',
    'instance-admin/actions/list-item-editor',
    'instance-admin/models/contact'
  ],
  function (
    $,
    App,
    ListItemEditor,
    ContactModel
  ) {
    "use strict"; 

    App.addInitializer(function(options){

      $('#content').on(
        'click',
        '.contact-edit',
        new ListItemEditor({
          model:    ContactModel,
          template: 'contact/view.html'
        })
      );

    });
  }
);
