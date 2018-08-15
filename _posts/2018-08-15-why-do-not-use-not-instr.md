---
layout: post
title: "why do not use Not Instr"
description: ""
category: 
tags: [Notes]
---

# test result

|           |Instr|T or F|Not Intr|T or F|
|-----------|-----|------|--------|------|
|"abcd", "a"|1    |T     |-2      |T     |
|"abcd", "b"|2    |T     |-3      |T     |
|"abcd", "c"|3    |T     |-4      |T     |
|"abcd", "d"|4    |T     |-5      |T     |
|"abcd", "e"|0    |F     |-1      |T     |

```vb
' "If Instr()" works as we wish
if instr("abcd", "a") then
	' enter this condition
else

end if
if instr("abcd", "e") then

else
	' enter this condition
end if

' "If Not Instr()" is horrible
if not instr("abcd", "a") then
	' enter this condition, omg~
else

end if
if not instr("abcd", "e") then
	' enter this condition
else

end if
```

# ps

* Not function work differently with Boolean type and Integer type

```vb
Dim m As Integer
m = 1
print (Not m) ' output: -2
m = True ' translate to -1
print (Not m) ' output: 0

Dim n As Boolean
n = 1 ' translate to True
print (Not n) ' output: False
n = True
print (Not n) ' output: False
```


