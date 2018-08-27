---
layout: post
title: "refresh design testing"
description: ""
category: 
tags: [Notes]
---

# setup

* two local databases A and B 
	* A is a new database
	* B is a master template(name: TB) with some design in it

# test 1

* actions
	1. check A "Inherit design from master template" with name "TB"
	2. "refresh design" action on A
* results
	* design in A but not in B ==> removed
	* design in A with "Prohibit design refresh or replace to modify" ==> no change
	* design in B but not in A ==> copy design from B to A
	* design in A and B ==> replace design in A by B

# test 2

* actions
	1. create empty script in A with the name exists in B
	2. create empty form in A with the name exists in B
	22. inherit both script and form from template name "TB"
	3. "refresh design" action on A
* results 
	* script
		* script name in A but not in B ==> no change but with warn log
		* script name in A and in B ==> replace script in A by B
	* form
		* only form name in A and in B ==> replace form in A by the same form name in B(adding alias if form in B has alias)
		* form alias in A and in B ==> replace form in A by the same form alias in B(form name is updated if is different with the form in B)
