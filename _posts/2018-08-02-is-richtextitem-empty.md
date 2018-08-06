---
layout: post
title: "is richtextitem empty"
description: ""
category: 
tags: [Notes]
---

# by Lotus Formula

```
is_rtitem_empty := @Do(
	@Command([EditGotoField] ; YOUR_RICHTEXTITEM_FIELD);
	@Command([EditSelectAll]);
	@IsError(@Command([EditDeselectAll]))
);
```

# by Lotus Script

```vb
Function IsEmptyRTItem(uidoc As NotesUIDocument, field_name As String) As Boolean

	Call uidoc.Expandallsections()

	Call uidoc.Gotofield(field_name)
	Call uidoc.Selectall()

	On Error 4407 GoTo EMPTY_RTITEM_
	' the next line will generate a 4407 error, if field_name is empty
	Call uidoc.Deselectall()
	IsEmptyRTItem = False
	Exit Function

EMPTY_RTITEM_:
	IsEmptyRTItem = True
	Exit Function

End Function
```
