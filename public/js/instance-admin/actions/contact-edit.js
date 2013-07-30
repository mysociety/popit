/*global popit:false */
// Launch a backbone powered entry box when someone adds/edits a contact

define(
  [
    'jquery',
    'instance-admin/actions/list-item-editor',
    'text!templates/contact/view.html'
  ],
  function (
    $,
    ListItemEditor,
    contactTemplate
  ) {
    "use strict"; 

    $(function(){
      if (typeof popit === 'undefined') {
         return;
      }

      $('#content').on(
        'click',
        '.contact-edit',
        new ListItemEditor({
          collection: popit.model.get('contact_details'),
          template: contactTemplate
        })
      );

    });
  }
);
