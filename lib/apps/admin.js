"use strict";

var express = require('../express-inherit');
var popit = require('../popit');
var Account = require('../schemas/account');
var Permissions = require('../schemas/permissions');
var user = require('../authorization');
var isEmail = require('../utils').is_email;
var mailer = require('../mailer');
var config = require('config');
var format = require('util').format;

var app = module.exports = express();

function sendInvite(invite, req, res, next) {
  res.render('instance_invite.txt', {
    invite: invite,
    host: config.hosting_server.base_url,
    instance_name: req.popit.instance_name(),
  }, function(err, message) {
    if (err) {
      return next(err);
    }
    mailer.send(req, {
      to: invite.email,
      subject: "[" + req.headers.host + "] You have been invited to a PopIt: " + req.popit.instance_name(),
      text: message,
    });
    req.flash('info', 'We have invited ' + invite.email + ' to collaborate');
    res.redirect('/admin');
  });
}

app.use(function(req, res, next) {
  res.locals.errors = {};
  res.locals.inviteEmail = '';
  next();
});

app.use(function(req, res, next) {
  var Permissions = req.popit.permissions();
  Permissions.find({ instance: req.popit.instance_id() }).populate('account').exec(function(err, permissions) {
    if (err) {
      return next(err);
    }
    res.locals.permissions = permissions;
    next();
  });
});

app.use(function(req, res, next) {
  var Invite = req.popit.master().model('Invite');
  Invite.find({ instance: req.popit.instance_id() }, function(err, invites) {
    if (err) {
      return next(err);
    }
    res.locals.invites = invites;
    next();
  });
});

app.get('/', user.can('access admin page'), function(req, res, next) {
  res.render('admin.html');
});

app.post('/', user.can('access admin page'), function(req, res, next) {
  var Permissions = req.popit.permissions();

  Permissions.findById(req.body.permission_id).populate('account').exec(function(err, permission) {
    if (err) {
      return next(err);
    }
    if (req.body.remove) {
      permission.remove(function(err) {
        if (err) {
          return next(err);
        }
        req.flash('info', 'Access removed for ' + permission.account.name);
        res.redirect('/admin');
      });
      return;
    }
    permission.role = req.body.role;
    permission.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('info', 'Updated ' + permission.account.name);
      res.redirect('/admin');
    });
  });
});

app.get('/invite', user.can('access admin page'), function(req, res, next) {
  res.render('admin.html');
});

app.post('/invite', user.can('access admin page'), function(req, res, next) {
  var inviteEmail = res.locals.inviteEmail = req.body.email;
  if (req.body.resend) {
    var Invite = req.popit.master().model('Invite');
    Invite.findOne({ _id: req.body.invite_id }, function(err, invite) {
      if (err) {
        return next(err);
      }
      return sendInvite(invite, req, res, next);
    });
  }
  if (!inviteEmail) {
    res.locals.errors = { email: 'Please provide an email address' };
    return res.render('admin.html');
  }

  if (!isEmail(inviteEmail)) {
    res.locals.errors = { email: 'Invalid email address' };
    return res.render('admin.html');
  }

  // Check if the account already exists
  var Account = req.popit.accounts();
  Account.findOne({ email: inviteEmail }, function(err, account) {
    if (err) {
      return next(err);
    }
    if (!account) {
      // Create an invite
      var Invite = req.popit.master().model('Invite');
      Invite.findOne({ instance: req.popit.instance_id(), email: inviteEmail }, function(err, invite) {
        if (err) {
          return next(err);
        }
        if (!invite) {
          invite = new Invite();
          invite.instance = req.popit.instance_id();
          invite.email = inviteEmail;
          invite.save(function(err, invite) {
            if (err) {
              return next(err);
            }
            return sendInvite(invite, req, res, next);
          });
        } else {
          req.flash('info', 'We have already invited ' + inviteEmail + ' to collaborate');
          res.redirect('/admin');
        }
      });
    } else {
      // Account already exists, simply add them and notify
      var Permission = req.popit.permissions();
      Permission.findOne({ instance: req.popit.instance_id(), account: account.id }, function(err, permission) {
        if (err) {
          return next(err);
        }
        if (!permission) {
          Permission.create({
            instance: req.popit.instance_id(),
            account: account.id,
            role: 'editor',
          }, function(err) {
            if (err) {
              return next(err);
            }
            res.render('instance_invite.txt', {
              instance_name: req.popit.instance_name(),
              instance_url: format(config.instance_server.base_url_format, req.popit.instance_name()),
            }, function(err, message) {
              if (err) {
                return next(err);
              }
              mailer.send(req, {
                to: inviteEmail,
                subject: "[" + req.headers.host + "] You have been invited to a PopIt: " + req.popit.instance_name(),
                text: message,
              });
              req.flash('info', 'We have invited ' + inviteEmail + ' to collaborate');
              res.redirect('/admin');
            });
          });
        } else {
          req.flash('info', inviteEmail + ' is already allowed collaborate on this instance');
          res.redirect('/admin');
        }
      });
    }
  });
});
