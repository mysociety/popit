// Launch a backbone powered entry box when someone adds/edits a link

define(
  [
    'jquery',
    'instance-admin/app',
    'instance-admin/actions/list-item-editor',
    'instance-admin/models/link'
  ],
  function (
    $,
    App,
    ListItemEditor,
    LinkModel
  ) {
    "use strict";     

    App.addInitializer(function(options){

      $('#content').on(
        'click',
        '.link-edit',
        new ListItemEditor({
          model:    LinkModel,
          template: 'link/view.html'
        })
      );

    });
  }
);
