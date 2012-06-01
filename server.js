
/**
 * Module dependencies.
 */

var connect        = require('connect'),
    config         = require('config'),
    hosting_app    = require('./hosting-app/app'),
    utils          = require('./lib/utils'),
    instance_app   = require('./instance-app/app');

connect(
  // match the hosting app host...
  connect.vhost(config.hosting_server.host, hosting_app),

  // ...or fall through to the instance app
  instance_app
)
.listen(config.server.port);

console.log( '\033[1m started at: \033[32m' + new Date() + '\033[0m' );
console.log(
  "\033[1m PopIt hosting and instance apps started: \033[36mhttp://%s:%s\033[0m",
  config.hosting_server.host, config.server.port
);

utils.checkDatabaseConnection();
