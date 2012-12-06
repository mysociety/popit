---
layout: default
title: Installing using Vagrant
---

Vagrant provides any easy method to setup virtual development environments, for further information see [their website](http://www.vagrantup.com).

The basic process is to create a "base" vm, and then "provision" it with the software packages and setup needed. There are several ways to do this, including Chef and Puppet, but these instructions simply provide a shell script to keep things simple and avoid the need to understand further complicated systems. The supplied scripts will create you a Vagrant vm based on the server edition of Ubuntu 12.04 LTS that contains everything you need to work on PopIt.

1. [Install VirtualBox](http://www.virtualbox.org/wiki/Downloads) and [Vagrant](http://downloads.vagrantup.com/), create a folder somewhere that you'll be doing your work from and clone [popit](https://github.com/mysociety/popit) into it.

2. From your newly cloned `popit` directory, move `popit/config/Vagrantfile` and `popit/config/provision.sh` out, so that they're in the same directory as `popit`.

3. Run `vagrant up` in the same directory you just moved `Vagrantfile` into.

4. Wait... (probably 10 minutes or so depending on your internet connection speed). Vagrant will run `provision.sh`, which follows roughly the same install procedure as that given for a [manual install onto Ubuntu](/docs/install/ubuntu/).

5. When the install process has finished, you should be able to `vagrant ssh` into your new development environment. You'll find the code for PopIt in `/vagrant/popit`, where you can run `make` and follow the [getting the code instructions](/docs/install/get-the-code).

6. Enjoy! You can now edit your code from your editor of choice on your host computer, and view the changes live at `http://localhost:3000`, with all the server config and versioning nicely contained in a virtual environment.