---
layout: post
title: "formula contains ismember isnotmember"
description: ""
category: 
tags: [Notes]
---

# formula test

|params     |@Contains|@IsMember|@IsNotMember|!@IsMember = @IsNotMember| 
|-----------|---------|---------|------------|-------------------------|
|a ; a      |1        |1        |0           |1                        |
|a ; b      |0        |0        |1           |1                        |
|a:b ; a    |1        |0        |0           |0                        |
|a:b ; c    |0        |0        |1           |1                        |
|a ; a:b    |1        |1        |0           |1                        |
|a ; b:c    |0        |0        |1           |1                        |
|a:a ; a    |1        |1        |0           |1                        |
|a ; a:a    |1        |1        |0           |1                        |
|a:b ; a:b  |1        |1        |0           |1                        |
|a:b ; b:c  |1        |0        |0           |0                        |
|a:b ; c:d  |0        |0        |1           |1                        |

