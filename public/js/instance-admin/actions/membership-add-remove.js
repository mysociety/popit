/*global popit:false */
// ------------------------
// Launch a backbone powered entry box when someone clicks the new membership button
// ------------------------

define(
  [
    'jquery',
    'instance-admin/models/membership',
    'instance-admin/models/person',
    'instance-admin/models/organization',
    'instance-admin/models/post',
    'instance-admin/views/membership-new',
    'instance-admin/views/remove-model',
    'text!templates/membership/remove.html',
    'jquery.fancybox'
  ],
  function (
    $,
    MembershipModel,
    PersonModel,
    OrganizationModel,
    PostModel,
    MembershipNewView,
    RemoveModelView,
    mTemplate
  ) {
    "use strict";
  }
);
