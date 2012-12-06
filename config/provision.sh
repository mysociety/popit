#!/bin/sh

set -e # Exit script immediately on first error.
set -x # Print commands and their arguments as they are executed.

# Abort provisioning if toolchain is already installed.npm tet
command -v make chromium-browser npm mongo Xvfb chromedriver git >/dev/null 2>&1 &&
{ echo "Everything already installed."; exit 0; }

# If we get here, we've never provisioned before
echo "##############################"
echo "Setting up the environment neccessary for PopIt"
echo "##############################"

# Update package index before we start
apt-get update -yqq

# Add extra repos
echo "##############################"
echo "Adding neccessary repos for Node.js and MongoDB"
echo "##############################"
# Instructions from: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
apt-get install -yqq python-software-properties
add-apt-repository -y ppa:chris-lea/node.js
# Instructions from: http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/
apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" > /etc/apt/sources.list.d/10gen.list
apt-get update -yqq

# Install packages
echo "##############################"
echo "Installing Packages"
echo "##############################"
apt-get install -yqq nodejs npm mongodb-10gen build-essential ruby1.9.1 ruby1.9.1-dev chromium-browser xvfb unzip git

# Download and install chromedriver
echo "##############################"
echo "Installing chromedriver"
echo "##############################"
wget -q http://chromedriver.googlecode.com/files/chromedriver_linux64_23.0.1240.0.zip
unzip chromedriver_linux64_23.0.1240.0.zip
rm chromedriver_linux64_23.0.1240.0.zip
mv chromedriver /usr/local/bin

# Install compass, watir-webdriver and pry
echo "##############################"
echo "Installing compass, watir-webdriver and pry"
echo "##############################"
gem install compass watir-webdriver pry jekyll

# Set up Xvfb to run all the time on display :99
echo "##############################"
echo "Setting up Xvfb and making it run on every start"
echo "##############################"
Xvfb :99 -ac &
cp /etc/rc.local /etc/rc.local.old
sed -i 's/^exit 0/Xvfb :99 -ac\n\nexit 0/' /etc/rc.local
echo "export DISPLAY=:99" >> /home/vagrant/.bashrc
