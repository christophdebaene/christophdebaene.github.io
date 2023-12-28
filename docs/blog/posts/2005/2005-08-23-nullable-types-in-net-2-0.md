---
title: Nullable types in .NET 2.0
date: 2005-08-23
tags: 
  - net-sdk
---

In .NET 1.1 you cannot assign the NULL value to a value type (e.g. _int_, _float_, etc.). There are some situations where this is needed, typically in database scenarios. In .NET 2.0 there is a new type called [nullable](http://msdn.microsoft.com/vcsharp/2005/overview/language/nullabletypes/). The _nullable_ type implements the [INullableValue](http://winfx.msdn.microsoft.com/library/default.asp?url=/library/en-us/cpref/html/T_System_INullableValue.asp) interface and looks like:

```csharp
public interface INullableValue 
{ 
  bool HasValue { get; } 
  object Value { get; } 
} 
```

The idea is that a nullable type combines a value (_Value_) of the underlying type with a boolean (_HasValue_) null indicator. The underlying type of a nullable type must be a value type.

```csharp
Nullable<int> x = 9;

Debug.Assert(x.HasValue); 
Debug.Assert(x == 9); 
Debug.Assert(x.Value == 9); 
Debug.Assert(x.GetValueOrDefault(5) == 9);

x = null; 

Debug.Assert(x.HasValue == false); 
Debug.Assert(x.GetValueOrDefault(5) == 5);
```

You can also use the **?** type modifier to denote a nullable type.

```csharp
int? y = 9; 

Debug.Assert(y.HasValue); 
Debug.Assert(typeof(int?) == typeof(Nullable<int>)); 
```

In .NET 2.0 there is a new operator, called the `null coalescing operator`, **??**. For example the statement `x ?? y` is `x` if `x` is not null, otherwise the result is `y`. Note that this operator also works with reference types.

```csharp
int? a = null; 
int? b = 6; 

Debug.Assert((a ?? b) == b); 

a = 9; 

Debug.Assert((a ?? b) == a); 

b = null; 

Debug.Assert((a ?? b) == a);
```
