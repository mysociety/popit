"use strict";

module.exports = function checkRobots(req, res, next){
  res.type('text/plain');
  if ( req.popit && req.popit.setting('no-spider') ) {
    res.render('no-robots.txt');
  } else {
   res.render( 'robots.txt');
  }
};
