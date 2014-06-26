/*global popit:false */

require([
  'jquery',
  'instance-admin/views/organization-edit'
], function($, OrganizationEditView) {
  "use strict";

  if (typeof popit === 'undefined') {
    return;
  }

  var fields = [
    'name',
    'summary',
    'classification',
    'parent_id',
    'founding_date',
    'dissolution_date'
  ];

  $(function() {
    if (popit.type === 'organization') {
      var view = new OrganizationEditView({el: '#content', fields: fields});
    }
  });
});
