---
layout: post
title: "import simple texture into existing jekyll app"
description: ""
category: jekyll-theme
tags: [jekyll, theme]
---

# prerequisite

1. install jekyll and bundler
```
gem install jekyll bundler
```

2. an jekyll app
```
jekyll new YOUR_JEKYLL_APP
```

3. enter the diretory
```
cd YOUR_JEKYLL_APP
```

# steps

1. download [simple-texture repo](https://github.com/yizeng/jekyll-theme-simple-texture/archive/master.zip)

2. remove existing `404.html`, `about.md`, and `index.md`
```
rm 404.html about.md index.md
```

3. remove existing `Gemfile.lock`
```
rm Gemfile.lock
```

4. copy everything in `start-kit` folder downloaded from simple-texture repo in the root directory of jekyll app

5. copy everything in `_layout` folder in the `_layout` of jekyll app

6. copy everything in `_include` folder into the `_include` of jekyll app

7. run `bundle install`

8. run `bundle exec jekyll serve` to start app

9. start <http://localhost:4000>
