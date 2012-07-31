// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-person button
// ------------------------

define(
  [
    'jquery',
    'popit/app',
    'popit/actions/list-item-editor',
    'popit/models/contact',
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
