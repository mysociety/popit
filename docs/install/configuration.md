---
layout: default
title: Configuration
---

## PopIt config

All the config is in the `config` folder. These are loaded by the [config](http://lorenwest.github.com/node-config/latest/index.html) module. There are sample production and development configs that you'll want to copy and edit.

## DNS config

You'll need to setup a wildcard DNS if you want to let instances be created. If your main site is `your-hosting-site-domain.com` you'll need to wildcard `*.your-hosting-site-domain.com`, or create DNS entries for `your-instance.your-hosting-site-domain.com`.

For development and in the tests we use `127.0.0.1.xip.io` which points to `127.0.0.1`, including any subdomains. See [xip.io](http://xip.io/) for details.

## MongoDB suggestion

PopIt uses a MongoDB database per instance, one for the master instance and a sessions database. To make this less disk intensive set the following in the MongoDB config file:

    noprealloc = true
    smallfiles = true

Probably not a good idea on a production system though.

