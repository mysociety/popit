"use strict"; 

var express            = require('../express-inherit'),
    winston            = require('winston'),
    Error404           = require('../errors').Error404,
    image              = require('./image'),
    utils              = require('../utils'),
    _                  = require('underscore'),
    async              = require('async'),
    getLangs           = require('../utils').getLangs,
    translationDecorator = require('../utils').translationDecorator,
    translationDecoratorWithLang = require('../utils').translationDecoratorWithLang,
    user               = require('../authorization');


/*

  Generic app for documents. Takes a hash of options that configures it:
  
  var opts = {
    model_name:            'Person',
    template_dir:          'person',
    template_object_name:  'person',
    template_objects_name: 'people',
    url_root:              '/person',
  };
  

*/

module.exports = function (opts) {

  var app = express();

  app.locals({
    image_proxy: utils.image_proxy_helper
  });

  app.locals({
    image_url: function(type, object, image) {
      return '/' + type + 's/images/' + image.id + '/' + object.id;
    },
    relatedObject: function(membership, object, lang, defaultLang) {
      var obj = null;
      if (opts.model_name === 'Person') {
        if (membership.person_id && membership.person_id.id !== object.id) {
          obj =  membership.person_id;
        } else if (membership.organization_id) {
          obj =   membership.organization_id;
        } else if (membership.post_id) {
          obj =  membership.post_id.organization_id;
        } else {
          obj =  membership.memberObject;
        }
      } else if (opts.model_name === 'Organization') {
        if (membership.organization_id && membership.organization_id.id !== object.id) {
          obj =  membership.organization_id;
        } else if (membership.person_id) {
          obj =  membership.person_id;
        } else {
          obj =  membership.memberObject;
        }
      } else if (opts.model_name === 'Post') {
        if (membership.organization_id) {
          obj =  membership.organization_id;
        } else if (membership.memberObject) {
          obj =  membership.memberObject;
        } else {
          obj =  object.organization_id;
        }
      }
      return translationDecoratorWithLang(obj, lang, defaultLang);
    },
    validMembership: function(membership, objectId) {
      if (opts.model_name === 'Person') {
        if (membership.organization_id || membership.post_id) {
          return true;
        } else if (membership.person_id && membership.person_id.id !== objectId) {
          return true;
        } else {
          return false;
        }
      } else if (opts.model_name === 'Organization') {
        if (membership.person_id) {
          return true;
        } else if (membership.organization_id && membership.organization_id.id !== objectId) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  });

  // Remove null values from arrays
  app.put('/:id(*)', function(req, res, next) {
    [
      'other_names',
      'contact_details',
      'memberships',
      'identifiers',
      'links'
    ].forEach(function(field) {
      if (!req.body[field]) {
        req.body[field] = undefined;
        return;
      }
      req.body[field] = req.body[field].filter(function(item) {
        if ( !_.isNull(item) ) {
          item = _.compact(item);
          return item.length > 0;
        }
        return false;
      });
    });
    next();
  });

  function save_as_multilingual(body, obj, lang, defaultLang) {
    if (!body) {
      return;
    }
    var new_body = {};
    _.keys(body).forEach(function(field) {
      var item = obj ? obj[field] : undefined;
      if ( !item && !body[field] ) {
        return;
      }
      if ( ['other_names', 'identifiers', 'links', 'contact_details', 'sources'].indexOf(field) != -1 ) {
        if ( _.isArray(body[field]) && body[field].length ) {
            var new_item = [];
            if ( _.isArray(item) && item.length ) {
              var new_el;
              body[field].forEach(function(el) {
                new_el = null;
                if ( el.id ) {
                  item.forEach(function(existing) {
                    if ( existing._id && existing._id == el.id ) {
                      new_el = save_as_multilingual(el, existing, lang, defaultLang);
                    }
                  });
                }
                if ( !new_el ) {
                   new_el = save_as_multilingual(el, null, lang, defaultLang);
                }
                // we don't want or need this
                delete new_el.id;
                new_item.push(new_el);
              });
            } else {
              body[field].forEach(function(el) {
                var new_el = save_as_multilingual(el, null, lang, defaultLang);
                new_item.push(new_el);
              });
            }
            item = new_item;
        } else {
          item = save_as_multilingual(body[field], item, lang, defaultLang);
        }
      } else if ( [ 'id', '_id', 'memberships', 'posts', 'images', 'identifiers', 'birth_date', 'death_date', 'start_date', 'end_date', 'founding_date', 'dissolution_date' ].indexOf(field) == -1 && field.indexOf('_') !== 0 ) {
        if ( _.isObject(item) ) {
          item[lang] = body[field];
        } else if ( lang != defaultLang ) {
          var translated = {};
          translated[defaultLang] = item || body[field];
          translated[lang] = body[field];
          item = translated;
        // if it's the default language and it's not already translated then no sense
        // in creating a translated object
        } else {
          item = body[field];
        }
      } else {
        item = body[field];
      }
      new_body[field] = item;
    });
    return new_body;
  }

  // process for multi-lingual things
  app.put('/:id(*)', function(req, res, next) {
    var langs = getLangs(req);

    req.body = save_as_multilingual(req.body, req.object, langs.lang, langs.defaultLang);
    next();
  });

  // Delete memberships
  app.put('/:id(*)', user.can('edit instance'), function(req, res, next) {
    var memberships = req.body.memberships;

    // we have to do this here otherwise it's impossible to delete
    // a single membership. The map reduces it to a list of ids, the
    // compact removed the undefined ids of any new memberships. The
    // second step is required otherwise the find and remove doesn't
    // work if there are new memberships
    var Membership = req.db.model('Membership');
    var membership_ids =
      _.chain(memberships)
       .map(function(membership) { return membership.id; })
       .compact()
       .value();

    var query = {};
    query[opts.model_name.toLowerCase() + '_id'] = req.param('id');
    Membership
      .find(query)
      .where('_id').nin(membership_ids)
      .exec(function(err, memberships) {
        if (err) {
          return next(err);
        }
        async.forEach(memberships, function(membership, done) {
          membership.remove(done);
        }, next);
      });
  });


  app.get('/', function (req,res,next) {
    var search = req.param('name');
    var langs = getLangs(req);
    if (search) {

      req.popit.model(opts.model_name).name_search(search, function(err, names) {
        if (err) return next(err);
        if ( names.length && names.length == 1 ) {
          return res.redirect(names[0].url);
        }
        res.locals.results = names;
        res.render('search.html');
      });

    } else {
      var key = 'name';
      if ( opts.model_name == 'Post' ) {
        key = 'label';
      }
      var query = req.popit.model(opts.model_name).find();
      query.exec(function(err, docs) {
        if (err) throw err;
        docs = docs.map(function(d) { return translationDecorator(d, req); });
        docs = docs.sort(function sortNames(doc1, doc2) {
          var name1 = doc1.get(key);
          var name2 = doc2.get(key);
          name1 = name1.toLowerCase();
          name2 = name2.toLowerCase();
          if ( name1 > name2 ) {
            return 1;
          }
          if ( name2 > name1 ) {
            return -1;
          }
          return 0;
        });
        res.locals[opts.template_objects_name] = docs;
        res.render(opts.template_dir + '/index.html');
      });

    }
  });    

  app.param('id', function loadDocumentById (req, res, next, id) {
    var q = req.popit.model( opts.model_name ).findOne( { _id: id } );
    if ( opts.model_name == 'Organization' ) {
        q.populate('parent_id');
    }
    if ( opts.model_name == 'Post' ) {
        q.populate('organization_id');
    }
    q.exec(function(err, doc) {
      if (err) winston.error( err );
      if (!doc) {
        next( new Error404() );
      } else {
        if ( req.method == 'GET' ) {
          doc = translationDecorator(doc, req);
        }
        res.locals[opts.template_object_name] = doc;
        req.object = doc;
        next();
      }
    });
  }, function findMemberships(req, res, next) {
    res
      .locals[opts.template_object_name]
      .find_memberships()
      .populate('organization_id')
      .populate('post_id')
      .populate('person_id')
      .exec(function(err, memberships) {
        if ( req.method == 'GET' ) {
          memberships = memberships.map(function(m) {
            if ( m.person_id ) {
              m.person_id = translationDecorator(m.person_id, req);
            }
            if ( m.organization_id ) {
              m.organization_id = translationDecorator(m.organization_id, req);
            }
            return translationDecorator(m, req);
          });
        }
        res.locals.memberships = memberships;
        next(err);
      });
  }, function findMembershipMember(req, res, next) {
    async.forEach(res.locals.memberships, function(membership, done) {
      var member = membership.get('member');
      if (!member) {
        return done();
      }
      var Collection = req.popit.model(member['@type']);
      Collection.findById(member.id, function(err, member) {
        if (err) {
          return done(err);
        }
        membership.memberObject = translationDecorator(member, req);
        done();
      });
    }, next);
  }, function findMembershipPostOrganization(req, res, next) {
    async.forEach(res.locals.memberships, function(membership, done) {
      var post = membership.get('post_id');
      if (!post) {
        return done();
      }
      post.populate('organization_id', done);
    }, next);
  });

  app.get(  '/:id(*)/images/upload', user.can('edit instance'), image.upload_image );
  app.post( '/:id(*)/images/upload', user.can('edit instance'), image.upload_image );
  app.get(  '/:id/image/:image_spec', image.get );
  app.get(  '/images/:image_spec/:id(*)', image.get );
  app.post( '/images/:image_spec/:id(*)/delete', user.can('edit instance'), image.delete );


  app.get('/:id(*)', function(req,res) {
    res.render( opts.template_dir + '/view.html' );
  });

  return app;
};
