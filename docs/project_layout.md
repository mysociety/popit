# Project Layout

Because the PopIt project uses two servers which share some common code the
layout is slightly different to the default Node/Express layout.

## Folder structure

The top level of the `popit` directory contains the following files and folders:

    package.json    # project specification for both apps
    ./config         # Configuration for both apps
    ./docs           # General documentation, like this file
    ./fixtures       # precanned data - for tests etc
    ./hosting-app    # the hosting app
    ./instance-app   # the instance app
    ./lib            # code common to both apps
    ./node_modules   # NPM install folder
    ./public         # CSS, JS etc, common to both apps
    ./tests          # tests

More details on the less obvious entries:

## Shared public assets

All the CSS, images and JavaScript is in one place as there is such an overlap
between the two sites. The CSS is actually generated from SASS, which is in
`./public/sass` by running `compass compile` in the `./public` dir.

## node_modules and package.json

These apply to both apps. It didn't seem desirable to separate them as the apps
are so similar and it would be a chore to maintain them separately.

## App folders

Each app has it's own folder with the usual sub folders:

    ./xxxxxxx-app
    ./xxxxxxx-app/routes
    ./xxxxxxx-app/views

Note that many of the `require` statements will refer to files one level above
the app folder, so there may be more `../` than normal :)

### Views

In each app folder there is a `views` folder that contains the templates. There
is also a folders in `views` called `info`. Any template put in there will be
served when requested at a url like `/info/foobar` - which would serve the
`info/foobar.jade` template. This is useful for privacy policies etc.
