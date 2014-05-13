---
layout: default
title: Developer quick start instructions
---

Some instructions on getting PopIt up and running quickly on a
development machine:

1.  Grab the PopIt [source](https://github.com/mysociety/popit)
2.  Follow the [install instructions](/docs/install) for your platform
3.  Customise the config files ([config instructions](/docs/install/configuration))

    `config/development.js` is probably a good place - there is an example file
    provided as a starting point:
        $ cp config/development.js-example config/development.js

4. Install dependant node modules
        $ make node-modules

5. Build CSS
    The CSS is built up from multiple files using the
    Sass(http://sass-lang.com/) tool. There is a Make rule to do this:

        $ make css

6. Run it
        $ node server.js


Your site should now be up and running. Check by going to
 http://www.127.0.0.1.xip.io:3000/ (or whatever your `<base_url>`
is set to).



### Creating a new instance

1. To set up a new Popit instance, go to
    http://www.127.0.0.1.xip.io:3000/instances/new
2. enter the invite code (`<create_instance_invite_code>` in your config).
3. To get the email confirmation link, go to
    http://www.127.0.0.1.xip.io:3000/_dev
    and click the "Last email sent" link.

After confirmation, you should be able to see your new empty instance at
http://<instance>.127.0.0.1.xip.io:3000

### Some basic mongodb for those new to it

It's handy to be able to poke about in the raw PopIt data to see what's there
and to get a feel for the structure of things.

The hosting database is called `<popit_prefix>__master`, and each instance
is given it's own database with the name `<popit_prefix>_<instance>`
(where `<popit_prefix>` is set in your config).


To connect to the hosting database and list all the instances:

    $ mongo popitdev__master
    > db.instances.find()

To connect to an instance database and list all the people:

    $ mongo <instance>_master
    > db.persons.find()


To list all the collections in a database:

    > show collections


The mongoDB site has a handy [getting started guide](http://docs.mongodb.org/manual/tutorial/getting-started/)
and [introduction](http://docs.mongodb.org/manual/core/crud-introduction/).

