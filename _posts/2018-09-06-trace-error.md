---
layout: post
title: "trace error"
description: ""
category: 
tags: [Notes]
---

# demo

## code

```vb
Option Public
Option Declare

Use "$trace" 
Sub Initialize
	
	On Error GoTo HANDLE_
	
	Call a
	
HANDLE_:
	msgbox Join(getTracedError, Chr(10))
	Exit Sub
End Sub

Sub a
	
	On Error GoTo HANDLE_
	
	Call c
	Call b
	
HANDLE_:
	traceError
End Sub

Sub b
	
	On Error GoTo HANDLE_
	
	' raise error here
	Error 1234, "test error here~"
	Exit Sub
HANDLE_:
	traceError
End Sub


Sub c

	On Error GoTo HANDLE_

	' nothing happends here
	
	Exit Sub
HANDLE_:
	traceError
End Sub
```

## output

```
(sub/function) INITIALIZE) Error 1234: test error here~ in line 5
	from sub/function A in line: 5
	from sub/function B in line: 6
```

# $trace

## code
```vb
Option Public
Option Declare

%Include "lsconst.lss"

Private traced_array As Variant

Function getTracedError As Variant
	Dim error_msg As String
	If IsEmpty(traced_array) Then traced_array = Split("")
	error_msg = "(sub/function " & GetThreadInfo(LSI_THREAD_CALLPROC) & ") Error " & Err & ": " & Error & " in line " & Erl
	traced_array = FullTrim(ArrayAppend(Split(error_msg, ""), traced_array))
	getTracedError = traced_array
End Function

Sub traceError
	Dim error_msg As String
	If IsEmpty(traced_array) Then traced_array = Split("")
	error_msg = Chr(9) & "from sub/function " & GetThreadInfo(LSI_THREAD_CALLPROC) & " in line: " & Erl 
	traced_array = FullTrim(ArrayAppend(Split(error_msg, ""), traced_array))
	Error Err, Error$
End Sub
```
