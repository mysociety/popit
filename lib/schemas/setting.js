"use strict"; 

var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema,
    ObjectId    = Schema.ObjectId;


module.exports = new Schema({
    key: {
        type:      String,
        unique:    true,
        required:  true,        
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required:  true,        
    }
}, { strict: true } );
