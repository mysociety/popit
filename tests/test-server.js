
// All this module does is return the real server. Use a different file though
// so that forever can handle it more cleanly allowing us to issue a 'stop'
// command to shut it down.
module.exports = require('../server');
