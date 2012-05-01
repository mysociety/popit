
// Hosting site schemas
exports.Instance = require('./instance');

// Instance site schemas
exports.User     = require('./user');
exports.Setting  = require('./setting');

// Testing etc schemas
exports.Email    = require('./email');

// PopIt embedded schemas - need to be before the schemas that they are embedded in
exports.Link             = require('./link');
exports.ContactDetail    = require('./contact-detail');

// PopIt main schemas
exports.Image            = require('./image');
exports.Person           = require('./person');
exports.Organisation     = require('./organisation');

// Helper schemas
exports.Token = require('./token');



// Make sure that the schemas are loaded into models when the instance is
// configured, otherwise we have odd issues later when one schema relies on
// another that was not pre-loaded.
exports.MasterPreLoadSchemaNames   = [
  'Instance',
  'Email',
];

exports.InstancePreLoadSchemaNames = [
  'User',
  'Setting',
  'Email',
  'Link',
  'ContactDetail',
  'Image',
  'Person',
  'Organisation',
];
