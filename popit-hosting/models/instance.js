var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var instance_schema = new Schema({
    name: {
        lowercase: true,
        trim: true,
        match: /^[a-z][a-z0-9\-]{3,19}$/,
        unique: true,
        required: true,
    },
    created_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Instance', instance_schema);
