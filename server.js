
/**
 * Module dependencies.
 */

var connect        = require('connect'),
    config         = require('config'),
    hosting_app    = require('./hosting-app/app'),
    instance_app   = require('./instance-app/app');

connect(
  // match the hosting app host...
  connect.vhost(config.hosting_server.host, hosting_app),

  // ...or fall through to the instance app
  instance_app
)
.listen(config.server.port);

console.log(
  "PopIt hosting and instance apps started: http://%s:%s",
  config.hosting_server.host, config.server.port
);
