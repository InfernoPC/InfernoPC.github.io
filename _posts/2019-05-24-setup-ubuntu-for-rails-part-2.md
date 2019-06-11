---
layout: post
title: "setup ubuntu for rails part 2"
description: ""
category: 
tags: [Git, Vim, Ctrlp.vim, SSH keygen]
---

# configure git

1. add user informations
```shell
$ git config --global user.name "Tim Chen"
$ git config --global user.email "inferno6562@gmail.com"
```

2. add some useful configs
```shell
$ git config --global core.editor "vim"
$ git config --global alias.graph "log --graph --decorate --oneline"
$ git config --global push.default simple
```

3. display branch name on shell (re-login is required)
```shell
$ vim ~/.bash_profile
```
```shell
parse_git_branch() {
	git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ (\1)/'
}
export PS1="\u@\h \[\033[32m\]\w\[\033[33m\]\$(parse_git_branch)\[\033[00m\] $ "
```

# config vimrc

1. edit vimrc
```shell
$ vim ~/.vimrc
```

2. add configs
```vim
" custom settings
set nu
set tabstop=2
set shiftwidth=2
set mouse=a
set incsearch
filetype indent on
set bg=dark
color darkblue
hi LineNr cterm=bold ctermfg=DarkGrey ctermbg=NONE
hi CursorLineNr cterm=bold ctermfg=Green ctermbg=NONE
inoremap ( ()<Esc>i
inoremap " ""<Esc>i
inoremap ' ''<Esc>i
inoremap [ []<Esc>i
inoremap { {}<Esc>i
```

# get ctrlp.vim

* follows <http://ctrlpvim.github.io/ctrlp.vim/#installation>

1. clone ctrlp.vim
```shell
$ cd ~/.vim
$ git clone https://github.com/ctrlpvim/ctrlp.vim.git bundle/ctrlp.vim
```

2. add to `~/.vimrc`
```vim
set runtimepath^=~/.vim/bundle/ctrlp.vim
```

3. run on vim's command line
```vim
:helptags ~/.vim/bundle/ctrlp.vim/doc
```

4. restart vim and check `:help ctrlp.txt`

# generate SSH keys for github/gitlab

1. generate SSH keys
```shell
$ ssh-keygen
$ cat ~/.ssh/id_rsa.pub
```

2. copy output and paste to github and gitlab

# install rails 5 and 6

1. install rails at current gemset
```shell
$ gem install rails
```

2. create a new gemset
```shell
$ rvm gemset create rails600
```

3. switch to rails600
```shell
$ rvm use @rails600
```

4. list all rails version and install latest one(current latest version is 6.0.0.rc1)
```shell
$ gem list rails --remote --pre --all | grep -i "^rails "
$ gem install rails -v 6.0.0.rc1
```

