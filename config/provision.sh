#!/bin/bash

set -e

# To prevent "dpkg-preconfigure: unable to re-open stdin: No such file or directory" warnings
export DEBIAN_FRONTEND=noninteractive

# Abort provisioning if toolchain is already installed
command -v make chromium-browser npm mongo Xvfb chromedriver git >/dev/null 2>&1 &&
{ echo "Everything already installed."; exit 0; }

# Update package index before we start
apt-get update -y

# Instructions from: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
apt-get install -y python-software-properties
add-apt-repository -y ppa:chris-lea/node.js
apt-get update -y
apt-get install -y python g++ make nodejs

# Instructions from: http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/
apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' > /etc/apt/sources.list.d/mongodb.list
apt-get update -y
apt-get install -y mongodb-org

# Install elasticsearch
wget -O - http://packages.elasticsearch.org/GPG-KEY-elasticsearch | apt-key add -
echo 'deb http://packages.elasticsearch.org/elasticsearch/0.90/debian stable main' > /etc/apt/sources.list.d/elasticsearch.list
apt-get update -y
apt-get install -y openjdk-6-jre elasticsearch

# Install other packages
apt-get install -y ruby1.9.1 ruby1.9.1-dev chromium-browser xvfb git imagemagick graphicsmagick unzip postfix

# Download and install chromedriver
wget -q http://chromedriver.storage.googleapis.com/2.8/chromedriver_linux64.zip
unzip chromedriver_linux64.zip
rm chromedriver_linux64.zip
mv chromedriver /usr/local/bin
chmod 755 /usr/local/bin/chromedriver

# Install compass, watir-webdriver and pry
gem install watir-webdriver --version=0.6.7 --no-rdoc --no-ri
gem install pry --version=0.9.12.6 --no-rdoc --no-ri
gem install sass --version=3.2.14 --no-rdoc --no-ri
gem install compass --version=0.12.2 --no-rdoc --no-ri

# Set up Xvfb to run all the time on display :99
Xvfb :99 -ac &
cp /etc/rc.local /etc/rc.local.old
sed -i 's/^exit 0/Xvfb :99 -ac\n\nexit 0/' /etc/rc.local
echo "export DISPLAY=:99" >> /home/vagrant/.bashrc

echo "cd /vagrant" >> /home/vagrant/.bashrc
cd /vagrant

make
cp config/development.js-example config/development.js
