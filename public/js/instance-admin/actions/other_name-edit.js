/*global popit:false */
// Launch a backbone powered entry box when someone adds/edits an alternate name

define(
  [
    'jquery',
    'instance-admin/actions/list-item-editor',
    'text!templates/other_name/view.html'
  ],
  function (
    $,
    ListItemEditor,
    otherNameTemplate
  ) {
    "use strict"; 

    $(function(){
      if (typeof popit === 'undefined') {
         return;
      }

      $('#content').on(
        'click',
        '.other_name-edit',
        new ListItemEditor({
          collection: popit.model.get('other_names'),
          template: otherNameTemplate
        })
      );

    });
  }
);
