// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-person button
// ------------------------

define(
  [
    'jquery',
    'instance-admin/app',
    'instance-admin/actions/list-item-editor',
    'instance-admin/models/contact',
    'templates/contact/view'
  ],
  function (
    $,
    App,
    ListItemEditor,
    ContactModel,
    contactViewTemplate    
  ) {
    

    App.addInitializer(function(options){

      $('#content').on(
        'click',
        'a.contact-edit',
        ListItemEditor({
          model:    ContactModel,
          template: contactViewTemplate
        })
      );

    });
  }
);
