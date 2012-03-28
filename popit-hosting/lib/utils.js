var check      = require('validator').check,
    bcrypt     = require('bcrypt');


module.exports.is_email = function (val) {
    try {
        check(val).isEmail();
        return true;
    } catch(err) {
        return false;
    }
};


module.exports.password_hash = function (plaintext, cb) {
    bcrypt.genSalt(10, function(err, salt) {
        if (err) throw err;
        bcrypt.hash(plaintext, salt, function(err, hash) {
            if (err) throw err;
            cb(hash);
        });
    });
};

module.exports.password_hash_compare = function (plaintext, hash, cb) {
    bcrypt.compare( plaintext, hash, function (err, is_same) {
        if (err) throw err;
        cb(is_same);
    });
}