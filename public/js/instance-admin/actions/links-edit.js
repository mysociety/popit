// Launch a backbone powered entry box when someone adds/edits a link

define(
  [
    'jquery',
    'instance-admin/actions/list-item-editor',
    'instance-admin/models/link'
  ],
  function (
    $,
    ListItemEditor,
    LinkModel
  ) {
    "use strict";     

    $(function(){

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
