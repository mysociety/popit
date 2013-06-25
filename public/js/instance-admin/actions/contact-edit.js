// Launch a backbone powered entry box when someone adds/edits a contact

define(
  [
    'jquery',
    'instance-admin/actions/list-item-editor',
    'instance-admin/models/contact',
    'text!templates/contact/view.html'
  ],
  function (
    $,
    ListItemEditor,
    ContactModel,
    contactTemplate
  ) {
    "use strict"; 

    $(function(){

      $('#content').on(
        'click',
        '.contact-edit',
        new ListItemEditor({
          model:    ContactModel,
          template: contactTemplate
        })
      );

    });
  }
);
