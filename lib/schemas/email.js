"use strict"; 

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    utils    = require('../utils');

module.exports = new Schema({
    created: {
        type:    Date,
        'default': Date.now,
    },
    message: {
        type:      {},
        required:  true,
    },
}, { strict: true } );
