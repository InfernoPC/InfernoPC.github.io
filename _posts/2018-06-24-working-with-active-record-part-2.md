---
layout: post
title: "working with active record part 2"
description: ""
category: "Learning Notes"
tags: [RubyOnRails]
---

## Database Locking

### Optimistic Locking 樂觀

* detecing and resolving collisions if they occur
* infrequent collisions

#### implementation

* add *lock_version* column
```
class AddLockVersionToTimeSheets < ActiveRecord::Migration
	def change
		add_column :timesheets, :lock_version, :integer, default: 0
	end
end
```

* the first instance will win the update(save method returns true), the second will raises *ActiveRecord::StaleObjectError*

#### hangle the error
```
def update
	timesheet = Timesheet.find(params[:id])
	timesheet.update(params[:timesheet])
	# update success, redirect to somewhere
rescue
	flash[:error] = "Timesheet was modified while you were editing it." # show error msg to user
	redirect_to [:edit, timesheet] # redirect back to edit method
end
```

### Pessimistic Locking 悲觀

* implemented at database level
* add FOR UPDATE clause to SELECT statment
* other statment will be blocked
* lock is released after transaction is commited
* theoretically, lock would not be released until the connection is terminated or times out

### Considerations

* as web application, optimistic locking is better
* rails is single thread, using pessimistic locking cause rails waits and ignoring other request

## Where Clauses

### Basics

```
# using Hash
Product.where(sku: params[:sku]) # sku = params[:sku]
Product.where(sku: [9400, 9500, 9600]) # sku in (9400, 9500, 9600)
# using statement
Product.where('descrption like ? and color = ?', "%#{terms}%", color)
Product.where('sku in (?)', selected_skus)
# where.not
Article.where.not(title: 'Rails 3')
Article.where.not(title: ['Rails 3', 'Rails 5'])
```

### Bind Variables

* use hash key instead of question mark
* more readable
* use same bind variable at once

```
Produce.where("name = :name AND sku = :sku AND created_at > :date", name: "Space Toilet", sku: 80800, date: '2009-01-01')
Message.where("subject LIKE :foo OR body LIKE :foo", foo: '%woah%')
```

### Boolean Conditions

* Active Record handles the differences of boolean values in all databases(1/0, T/F, or Y/N)

```
Timesheet.where('submitted = ?', true)
```

### Nil Conditions

```
>> User.where('email = ?', nil) # not works
User Load (xx.x ms) SELECT * FROM users WHERE (email = NULL)
>> User.where(:email => nil) # works
User Load (xx.x ms) SELECT * FROM users WHERE (users.email IS NULL)
```

## Order Clauses

### basics

```
Timesheet.order('created_at desc')
Timesheet.order(:created_at) # default is ascending order
Timesheet.order(created_at: :desc) # new in Rails 4
```

### random ordering

```
# MySQL
Timesheet.order('RAND()')
# Postgres
Timesheet.order('RANDOM()')
# Microsoft SQL Server
Timesheet.order('NEWID()') # uses random uuids to sort
# Oracle
Timesheet.order('dbms_random.value').first
```

## Limit(number) and Offset(number)

* limit: limit on the number of rows to return from the query
* offset: must be chained to *limit*, specifies the number of rows to skip

```
Timesheet.limit(10).offset(10)
```

## Select clauses
## From tables
## exists?

```
User.exists?(1)
User.exists?(login: "mack")
User.exists?(id: [1, 3, 5])
User.where(login: "mack").exists?
```

### extending

* specifies one or many modules with methods that will extend the scope with additional methods

```
module Pagination
	def page(number)
		# statement
	end
end

scope = Model.all.extending(Pagination)
scopepage(params[:page])
```

### Group
### Having
### includes

???

### Joins

```
Buyer.select('buyers.id, count(carts.id), as cart_count').
	joins('left join carts on carts.buyer_is = buyers.id').
	group('buyers.id')
```

### none

* return a empty ActiveRecord::Relation without quering database

```
def visible
	case role
	when :reviewer
		Post.published
	when :bad_user
		Post.none
	end
end

posts = current_user.visible.where(name: params[:name])
```

### readonly

* change the returned instance to readonly
* you can change attributes, but cannot save

```
c = Comment.readonly.first
c.body = "Keep it clean!"
c.save # => ActiveRecord::ReadOnlyRecord: ActiveRecord::ReadOnlyRecord
```

### references

### reorder

* replace any defined order

```
Member.order('name DESC').reorder(:id)
# => SELECT "members".* FROM "members" ORDER BY "members"."id" ASC

Member.order('name DESC').reorder(:id).order(:name)
# order is appendded to query
# => SELECT "members".* FROM "members" ORDER BY "members"."id" ASC,  "members".name ASC
```

### reverse_order

```
Member.order(:name).reverse_order
# => SELECT "members".* FROM "members" ORDER BY "members".name DESC
```

### uniq / distinct

```
User.select(:login).uniq
# => SELECT DISTINCT login FROM "users"
```

### unscope

* remove an unwanted relation

```
Member.order('name DESC').unscope(:order)
# => SELECT "members".* FROM "members"
Member.where(name: "Tyrion", active: true).unscope(where: :name)
# => equal to Member.where(active: true)
```

* *unscope* accepts:
	* :from, :group, :having, :includes, :joins, :limit, :lock, :offset, :order, :readonly, :select, :where

### arel_table

For cases in which you want to generate custom SQL yourself through Arel, you may use the *arel_table* method to gain access to the table for the class.

