---
layout: post
title: "setup ubuntu for rails part 3"
description: ""
category: 
tags: []
---

# build a new rails project

1. create new project
```shell
$ rails new blog
```

2. try `rails s` but received error
```
Could not find a JavaScript runtime. See https://github.com/rails/execjs for a list of available runtimes. (ExecJS::RuntimeUnavailable)
```

3. install Node.js to resolve it
```shell
$ sudo apt-get install nodejs
```

4. try `rails s` and works fine


