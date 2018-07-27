---
layout: post
title: "Working with Active Record"
description: ""
category: "Learning Notes"
tags: [RubyOnRails]
---

## Basic

* Class Name 對應 Database Table name
* 預設的 primary key 是 "id"
* 繼承 ActiveRecord::Base

```
class Client < ActiveRecord::Base
end
```

## Relationship

* model之間的關聯之一 :has_many

```
class Client < ActiveRecord::Base
	has_many :billing_codes
	has_many :billable_weeks
	has_many :timesheets, through: :billable_weeks
end
```

## Setting Names Manually

* 自訂對應的 SQL table name 及 primary key

```
class Client < ActiveRecord::Base
	self.table_name = "CLIENT"
	self.primary_key = "CLIENT_ID"
end
```

* 從application層級，修改所有model的對應table名稱
for legacy naming schemes
in config/application.rb:

```
# turn off table pluralization
config.active_record.pluralize_table_names = false

# default primary key is set to "tableid"
config.active_record.primary_key_prefix_type = :table_name

# default primary key is set to "table_id"
config.active_record.primary_key_prefix_type = :table_name_with_underscore

# ???
config.active_record.table_name_prefix = ???

# ???
config.active_record.table_name_suffix = ???
```

## default attribute value

* 自訂預設值

```
# default value of category is 'n/a' instead of nil
class TimesheetEntry < ActiveRecord::Base
	def category
		read_attribute(:category) || 'n/a'
	end
end
```

## ActiveRecord::Store

??? not understand

## CRUD

### create

```
>> c = Client.new
=> #<Client id: nil, name: nil, code: nil>
>> c.new_record?
=> true
>> c.persisted?
=> false
```
```
>> c = Client.new do |client|
?> client.name = "PC"
>> client.code = "AP"
>> end
=> #<Client id: 1, name: "PC", code: "AP">
```
```
>> c = Client.create(name: "PC", code: "AP")
=> #<Client id: 1, name: "PC", code: "AP">
```

### read

reading objects
```
Project.find(1)
Client.all
Product.last
Product.find([1, 2])
```

reading and writing attributes
```
# dot notation
client.name
client.code
# hash notation
client[:name]
client['name']
```
override the accessor
```
class Client < ActiveRecord::Base
	def name
		read_attribute(:name).reverse
		# self.name.reverse => cause recursive call! don't use it!
	end
end
first_name.name
```
```
class Project < ActiveRecord::Base
	# description can not be changed to blank string.
	def description=(new_value)
		write_attribute(:description, new_value) unless new_value.blank?
	end
end
```

attributes method
```
# show all attributes
# only value of read_attribute
# no custom attribute reader
first_client.attributes
```

custom SQL queries
```
Client.find_by_sql("select * from clients")
```

query cache
```
User.cache do
	User.first
	User.first
	User.first
end
```

### update

```
class ProjectController < ApplicationController
	def update
		project = Project.find(params[:id])
		if project.update(params[:project])
			redirect_to project
		else
			render 'edit'
		end
	end
end
```
```
# 1st parameter: update value or update sql query
# 2nd parameter: where clause
Project.update_all({manager: 'PC'}, technology: 'Rails'}
Project.update_all("cost = cost * 3", "lower(technology) LIKE '%microsoft%'")
```
touching records (update timestamp attribute)
```
>> user = User.first
>> user.touch # sets updated_at to now
>> user.touch(:viewed_at) # set viewed_at and updated_at to now
```
If a :touch option is provided to a belongs_to relation, it will touch the parent record when the child is touched.
```
>> user.touch # also calls user.client.touch
```

readonly attributes
```
class Customer < ActiveRecord::Base
	attr_readonly :social_security_number
end
```
```
>> Customer.readonly_attributes
```

### delete, destroying

The delete method executes a SQL statement to remove the object's data from the database.
```
bad_timesheet.delete
```

The destroy method will both remove the object from the database and prevent you from modifying it again
```
bad_timesheet.destroy
```
