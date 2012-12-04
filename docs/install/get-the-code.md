---
title: Getting the PopIt code
layout: default
---

Currently PopIt is not available over npm - perhaps it will be in future if there is sufficient demand.

To install from git do the following:

    # Get the code from GitHub
    git clone git://github.com/mysociety/popit.git
    cd popit
    
    # Optional - change to the 'production' branch (more stable). If you're 
    # hoping to contribute please stay on the 'master' branch.
    git checkout -b production origin/production
    
    # Install the dependencies and build the css
    make
    
    # Optional - run the test suite (requires additional software to be 
    # installed - see above)
    npm test
    
    # Start the app locally
    npm start
    
    # If you want to run the app from your /etc/init.d directory there is a 
    # sample script in './config' that you can use. Don't forget to create the
    # production config file too.
