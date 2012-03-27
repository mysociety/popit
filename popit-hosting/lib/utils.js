var check = require('validator').check;


module.exports.is_email = function (val) {
    try {
        check(val).isEmail();
        return true;
    } catch(err) {
        return false;
    }
};
