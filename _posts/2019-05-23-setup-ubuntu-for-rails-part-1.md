---
layout: post
title: "setup ubuntu for rails part 1"
description: ""
category: 
tags: [Ubuntu, SSH, RVM, Git]
---

# OS

* Ubuntu 16.04

# Enable SSH

1. install SSH service
```shell
$ sudo apt-get install ssh
$ sudo apt-get install openssh-server
```

2. (optional) ssh config
```shell
$ vim /etc/ssh/sshd_config
$ /etc/init.d/ssh restart
```

# install rvm

* follow <https://rvm.io/rvm/install>

0. update apt-get
```shell
$ sudo apt-get update
```

1. get GPG keys
```shell
$ gpg --keyserver hkp://pool.sks-keyservers.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
```

2. install RVM with stable ruby version
```shell
$ \curl -sSL https://get.rvm.io | bash -s stable --ruby
```

3. add rvm to PATH
```shell
$ source .rvm/scripts/rvm
```

4. check rvm and ruby is well installed
```shell
$ rvm -v
$ ruby -v
```

# install git

* follow <https://git-scm.com/book/en/v2/Getting-Started-Installing-Git>

1. install git
```shell
$ sudo apt-get install git
```

# install vim

1. install vim
```shell
$ sudo apt-get install vim
```
