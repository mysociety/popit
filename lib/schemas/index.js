
// Hosting site schemas
exports.Instance = require('./instance');

// Instance site schemas
exports.User     = require('./user');
exports.Setting  = require('./setting');

// Testing etc schemas
exports.Email    = require('./email');

// PopIt schemas
exports.Link             = require('./link');           // needs to be before person
exports.ContactDetail    = require('./contact-detail'); // needs to be before person
exports.Person           = require('./person');

// Helper schemas
exports.Token = require('./token');