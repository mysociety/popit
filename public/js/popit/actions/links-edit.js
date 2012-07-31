// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-person button
// ------------------------

define(
  [
    'jquery',
    'popit/app',
    'popit/actions/list-item-editor',
    'popit/models/link',
    'templates/link/view'
  ],
  function (
    $,
    App,
    ListItemEditor,
    LinkModel,
    linkViewTemplate  
  ) {
    

    App.addInitializer(function(options){

      $('#content').on(
        'click',
        'a.link-edit',
        ListItemEditor({
          model:    LinkModel,
          template: linkViewTemplate
        })
      );

    });
  }
);
