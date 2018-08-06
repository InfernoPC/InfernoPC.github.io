---
layout: post
title: "attemp to edit document"
description: ""
category: 
tags: [Notes]
---

# for Lotus Formula

# for Lotus Notes

```vb
Function attemptToEditDoc(uidoc As NotesUIDocument) As Boolean
	uidoc.EditMode = True
	' that uidoc.EditMode stays in False means current user cannot edit this document
	attemptToEditDoc = uidoc.EditMode
End Function
```
