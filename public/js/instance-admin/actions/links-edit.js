/*global popit:false */
// Launch a backbone powered entry box when someone adds/edits a link

define(
  [
    'jquery',
    'instance-admin/actions/list-item-editor',
    'text!templates/link/view.html'
  ],
  function (
    $,
    ListItemEditor,
    LinkTemplate
  ) {
    "use strict";     

    $(function(){
      if (typeof popit === 'undefined') {
         return;
      }

      $('#content').on(
        'click',
        '.link-edit',
        new ListItemEditor({
          collection: popit.model.get('links'),
          template: LinkTemplate
        })
      );

    });
  }
);
