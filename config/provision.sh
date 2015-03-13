#!/bin/bash

set -e

# Instructions from: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
wget -qO - https://deb.nodesource.com/setup | sudo bash -

# Instructions from: http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list

# Instructions from: http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/setup-repositories.html
wget -qO - https://packages.elasticsearch.org/GPG-KEY-elasticsearch | sudo apt-key add -
echo 'deb http://packages.elasticsearch.org/elasticsearch/0.90/debian stable main' | sudo tee /etc/apt/sources.list.d/elasticsearch.list

# Install packages
sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \
  nodejs build-essential \
  mongodb-org \
  openjdk-6-jre elasticsearch \
  git imagemagick graphicsmagick postfix redis-server bundler

grep -qG 'cd /vagrant' "$HOME/.bashrc" || echo "cd /vagrant" >> "$HOME/.bashrc"
cd /vagrant

bundle install
make

if [[ ! -f config/development.js ]]; then
  cp config/development.js-example config/development.js
fi
