---
layout: post
title: "Working with Active Record"
description: ""
category: "Learning Notes"
tags: [RubyOnRails]
---
{% include JB/setup %}


## Basic

* Class Name = Database Table name
* default primary key is "id"


```
class Client < ActiveRecord::Base
end
```



## Relationship

```
class Client < ActiveRecord::Base
	has_many :billing_codes
	has_many :billable_weeks
	has_many :timesheets, through: :billable_weeks
end
```

## Setting Names Manually


```
class Client < ActiveRecord::Base
	self.table_name = "CLIENT"
	self.primary_key = "CLIENT_ID"
end
```

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


