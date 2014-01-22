---
layout: default
title: Installing on Ubuntu
---

The following instructions have been used successfully on a default installation of the Server edition of Ubuntu 12.04 (Precise Pangolin), if you're using a different version your mileage may vary, but they should give you a good idea of where to start.

Almost all the packages required are available from apt-get repositories in the standard install, however there are a few extra steps needed. The following is a quick rundown of the commands you might need:

    # 1. Install extra repositories for Node.js and MongoDB

    # Instructions from: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
    sudo apt-get install python-software-properties
    sudo add-apt-repository ppa:chris-lea/node.js

    # Instructions from: http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/
    sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
    sudo echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" \
      > /etc/apt/sources.list.d/10gen.list

    # 2. Update apt-get so that it's aware of the new packages available
    sudo apt-get update

    # 3. Install all the packages you need to run PopIt 
    # (you may have some of these already)
    # Note you need version 1.9 of Ruby, which in Ubuntu packages is helpfully
    # labelled 1.9.1, version 1.8 won't work.
    sudo apt-get install nodejs mongodb-10gen build-essential ruby1.9.1 \
      ruby1.9.1-dev chromium-browser xvfb unzip git graphicsmagick openjdk-6-jre
    wget https://download.elasticsearch.org/elasticsearch/elasticsearch/elasticsearch-0.90.10.deb
    dpkg -i elasticsearch-0.90.10.deb

    # 4. Install gems needed to build the code
    sudo gem install compass 

    # (Optional)
    # If you wish to develop Popit, you'll need some extra packages in order
    # to run the tests

    # 5. Chromium browser and the chromedriver (including X11 if you've 
    # started with a server edition of Ubuntu, which will add ~150MB of X11
    # related dependencies
    sudo apt-get install chromium-browser unzip

    # chromedriver is only available as a binary download:
    wget http://chromedriver.googlecode.com/files/chromedriver_linux64_23.0.1240.0.zip
    unzip chromedriver_linux64_23.0.1240.0.zip
    rm chromedriver_linux64_23.0.1240.0.zip
    # You could put this anywhere you like, as long as it's in your $PATH
    sudo mv chromedriver /usr/local/bin

    # 6. Extra gems for running browser-based tests
    sudo gem install watir-webdriver pry

    # Finally, if you've been running all this on a headless server, you need
    # to start some kind of display to enable the browser based tests to run. 
    # (If you've got a gui already, you can skip this step).
    
    # The easiest way to do this is by using Xvfb:
    sudo apt-get install xvfb

    # You need to configure this to run, for which you can use something like:
    Xvfb :99 -ac &
    # Then you need to let programs know where to find the display:
    export DISPLAY=:99

    # You'll need to run these last two commands everytime you log in, or 
    # configure it to run automatically. 
    # One of the many ways to do that is to add the xvfb command to 
    # `/etc/rc.local` (above the last line that reads exit 0) and the export 
    # command to your `~/.bashrc` file.
