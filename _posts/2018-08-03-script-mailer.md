---
layout: post
title: "script mailer"
description: ""
category: 
tags: [Notes]
---

# how to use

## basic send mail

```vb
Dim mail As New Mailer
mail.sendto = "tim chen/ieitw/iei"
mail.send
```

## send test mail

```vb
mail.isIntercepted = True
```

## edit body

```vb
' mail.body returns RichTextItem
mail.body.AppendText("Hello World!")
mail.body.AppendDocLink(doc, text)
```

## compose mail

```vb
mail.compose
```

# source

```vb
Class Mailer
	
	workspace As NotesUIWorkspace
	session As NotesSession
	current_user As NotesName
	current_mail_db As NotesDatabase
	mail_doc As NotesDocument
	mail_body As NotesRichTextItem
	is_intercepted As Boolean ' while is_intercepted = true(default is false), mail will be redirected to current user, which is good for debugging.
	
	Sub New
		Set workspace = New NotesUIWorkspace
		Set session = New NotesSession
		Set me.current_user = New NotesName(session.Username)
		
		Set me.current_mail_db = New NotesDatabase("", "")
		Call me.current_mail_db.Openmail()
		If me.current_mail_db Is Nothing Then Error 2000, "User's mail database is not found."
		
		Set me.mail_doc = me.current_mail_db.Createdocument()
		If me.mail_doc Is Nothing Then Error 2001, "Cannot create mail in mail database."
		
		me.mail_doc.form = "memo"
		Set me.mail_body = New NotesRichTextItem(me.mail_doc, "body")
	End Sub
	
	Sub compose
		Call workspace.Editdocument(True, me.mail_doc)
	End Sub
	
	Sub send
		If me.is_intercepted Then
			Call me.body.Appendtext(me.displayMembers)
			me.sendto = me.current_user.Abbreviated
			me.copyto = ""
			me.blindCopyTo = ""	
			me.subject = me.subject + " (intercepted!) "
		End If
		Call me.mail_doc.Send(False)
	End Sub
	
	Private Function displayMembers As String
		displayMembers = |
------------ mail intercepted by | & me.current_user.Abbreviated & | ---------------
SendTo: | & Join(me.sendto, ", ") & |
CopyTo: | & Join(me.copyto, ", ") & |
BlindCopyTo: | & Join(me.blindCopyTo, ", ") & |
---------------------------------------------------------------------------|
	End Function
	
	Property Get isIntercepted As Variant
		isIntercepted = me.is_intercepted
	End Property
	Property Set isIntercepted As Variant
		me.is_intercepted = isIntercepted 
	End Property
	
	Property Get principle As Variant
		principle = me.mail_doc.principle
	End Property
	Property Set principle As Variant
		me.mail_doc.principle = principle 
	End Property

	Property Get subject As String
		subject = me.mail_doc.subject(0)
	End Property
	Property Set subject As String
		me.mail_doc.subject = subject 
	End Property

	Property Get blindCopyTo As Variant
		blindCopyTo = me.mail_doc.blindCopyTo
	End Property
	Property Set blindCopyTo As Variant
		me.mail_doc.blindCopyTo = blindCopyTo 
	End Property

	Property Get copyto As Variant
		copyto = me.mail_doc.copyto
	End Property
	Property Set copyto As Variant
		me.mail_doc.copyto = copyto 
	End Property
	
	Property Get sendto As Variant
		sendto = me.mail_doc.sendto
	End Property
	Property Set sendto As Variant
		me.mail_doc.sendto = sendto 
	End Property
	
	Property Get body As NotesRichTextItem
		Set body = me.mail_body
	End Property
	Property Set body As NotesRichTextItem
		Set me.mail_body = body
	End Property
	
End Class
```
