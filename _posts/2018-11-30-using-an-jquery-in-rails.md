---
layout: post
title: "using an jquery in rails"
description: ""
category: Rails
tags: [Rails]
---

# reference

<https://www.engineyard.com/blog/using-jquery-with-rails-how-to>

# preparing

1. create new rails app
```shell
$ rails new APP_NAME
```

2. add gem
```ruby
gem 'jquery-rails'
```

3. bundle
```shell
$ bundle install
```

4. include jqury to application.js
```js
//= require jquery3
//= require jquery_ujs
//= require_tree .
```

# test

1. create tutorial resource
```shell
$ rails g resource tutorial title:string url:string
$ rake db:migrate
```

2. display table
```ruby
# in app/controllers/tutorials_controller.rb
def index
	@tutorials = Tutorial.all
end
```

3. display table

```erb
<!-- in app/views/tutorial/index.html.erb (create one) -->
<h1>Tutorials</h1>
<ul>
  <% @tutorials.each do |tutorial| %>
    <li><%= tutorial.title %></li>
  <% end %>
</ul>
```
