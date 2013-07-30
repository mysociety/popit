/*global popit:false */
// Launch a backbone powered entry box when someone adds/edits an alternate name

define(
  [
    'jquery',
    'instance-admin/actions/list-item-editor',
    'text!templates/identifier/view.html'
  ],
  function (
    $,
    ListItemEditor,
    identifierTemplate
  ) {
    "use strict";

    $(function(){
      if (typeof popit === 'undefined') {
         return;
      }

      $('#content').on(
        'click',
        '.identifier-edit',
        new ListItemEditor({
          collection: popit.model.get('identifiers'),
          template: identifierTemplate
        })
      );

    });
  }
);
