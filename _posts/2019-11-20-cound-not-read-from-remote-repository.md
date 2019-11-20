---
layout: post
title: "Git push/pull error: Could not read from remote repository"
description: ""
category: helper
tags: [Git Bash, SSH]
---

在 Git Bash 上使用 Git pull/push/clone 時發生

```shell
$ git push
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

若已有將 SSH key 加進 Github 帳號裡面，再執行

```shell
$ eval $(ssh-agent)
Agent pid 14536

$ ssh-add ~/.ssh/github.com
Identity added: /c/Users/timchen/.ssh/github.com (timchen@IT-TimChen-N1)
```

ssh-add 請指定對應的 private key