---
title: Reflection and Generics
date: 2007-10-14
tags: 
  - net-sdk
---

On my current project I had the need to iterate through the properties of an object with reflection and to check if one of the properties is a generic List type, e.g. `IList`, `IList`, etc. To check through reflection on a generic type, you need to use the [GetGenericTypeDefinition](http://msdn2.microsoft.com/en-us/library/system.type.getgenerictypedefinition.aspx) method.

```csharp
foreach (PropertyInfo propertyInfo in entity.GetType().GetProperties())
{
   if (propertyInfo.PropertyType.IsGenericType &&
       typeof(List<>).IsAssignableFrom
              (propertyInfo.PropertyType.GetGenericTypeDefinition()))
   {
      IEnumerable enumerable = propertyInfo.GetValue(entity, null) as IEnumerable;
      IEnumerator enumerator = enumerable.GetEnumerator();
 
      while (enumerator.MoveNext())
      {
         // do something
      }
   }
}
```