---
title: Parse versus TryParse in .NET 2.0
date: 2005-09-11
---

In .NET 2.0 you will notice that every data has among others an extra method called `TryParse`. `TryParse` and `Parse` are semantically the same but differ in the way they handle errors. `Parse` method will throw an exception if it cannot convert the string, whereas the `TryParse` method returns a boolean to denote whether the conversion has been successfull or not, and returns the converted value through an `out` parameter.

```csharp
int result = 0; 
bool success = true;

string badValue = "12a45"; 
string goodValue = "1245";

try { 
  result = int.Parse(badValue); 
} 
catch { 
  success = false; 
}

Debug.Assert(success == false); 
Debug.Assert(result == 0);

success = true;

try { 
  result = int.Parse(goodValue); 
} 
catch { 
  success = false; 
}

Debug.Assert(success == true); 
Debug.Assert(result == 1245);

// int.TryParse

success = int.TryParse(badValue, out result);

Debug.Assert(success == false); 
Debug.Assert(result == 0);

success = int.TryParse(goodValue, out result);

Debug.Assert(success == true); 
Debug.Assert(result == 1245);
```

The reason why the `TryMethod` is introduced, is because **exceptions are expensive**. On [http://www.codinghorror.com/blog/archives/000358.html](http://www.codinghorror.com/blog/archives/000358.html) you find a benchmark tool and you notice that the (default) `Parse` method is a lot slower.

**One tip:** For extensive use of string concatenation you use the [StringBuilder](http://msdn.microsoft.com/library/default.asp?url=/library/en-us/cpref/html/frlrfsystemtextstringbuilderclasstopic.asp) class, for converting data types you apply the `TryParse` method.
