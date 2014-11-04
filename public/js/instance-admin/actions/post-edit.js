/*global popit:false */
// Launch a backbone powered entry box when someone clicks the new post link

define(
  [
    'jquery',
    'instance-admin/actions/list-item-editor',
    'instance-admin/collections/posts',
    'text!templates/post/post.html',
    'jquery.fancybox'
  ],
  function (
    $,
    ListItemEditor,
    PostCollection,
    postTemplate
  ) {
    "use strict"; 

    $(function(){
      if (typeof popit === 'undefined') {
         return;
      }

      $('#content').on(
        'click',
        '.edit-post',
        new ListItemEditor({
          collection: popit.model.posts,
          defaults: { 'organization_id': popit.model.id },
          direct: true,
          template: postTemplate
        })
      );

    });
  }
);
