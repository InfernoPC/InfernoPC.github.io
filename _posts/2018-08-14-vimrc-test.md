---
layout: post
title: "vimrc test"
description: ""
category: 
tags: [Vim]
---


# .vimrc

* git-bash on windows
	* `$ vim $HOME/.vimrc`
* content:

```vim
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
