
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

// Helper schemas
exports.Token = require('./token');
