---
layout: post
title: "parse doc link"
description: ""
category: 
tags: [Notes]
---

# by Lotus Notes

```vb
Sub Click(Source As Button)
	Dim ws As New NotesUIWorkspace
	Dim uidoc As NotesUIDocument
	Dim doc As NotesDocument
	Dim rtitem As NotesRichTextItem
	Dim rtna As NotesRichTextNavigator
	Dim rtnav, rtrange, rtlink

	Set uidoc = ws.CurrentDocument
	Call uidoc.Save

	Set doc = uidoc.Document
	Set rtitem = doc.GetFirstItem("db_link")

	Set rtnav = rtitem.CreateNavigator
	If rtnav.FindFirstElement(RTELEM_TYPE_DOCLINK) Then
		Set rtrange = rtitem.CreateRange
		Call rtrange.SetBegin(rtnav)
		Set rtlink = rtnav.GetElement
		Dim target_db As New NotesDatabase("", "")
		If target_db.OpenByReplicaID(rtlink.ServerHint, rtlink.DBReplicaID) Then
			doc.db_title = target_db.Title
			doc.server = target_db.Server
			doc.dbpath = target_db.FilePath
			doc.db_status = "online"
			doc.exist_updated_time = Now

			Call uidoc.Save
			Exit Sub
		End If

	End If

	Msgbox "failed..."

End Sub
```
