/*global popit:false */

require(['jquery', 'instance-admin/views/person-edit'], function($, PersonEditView) {
  "use strict";

  if (typeof popit === 'undefined') {
    return;
  }

  var fields = [
    'name',
    'summary',
    'birth_date',
    'death_date',
    'organization',
    'organization_id',
    'membership-area'
  ];

  $(function() {
    if (popit.type === 'person') {
      var view = new PersonEditView({el: '#content', fields: fields});
    }
  });
});
