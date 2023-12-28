---
title: RemotingHelper in .NET 2.0 (using generics)
date: 2005-08-21
tags: 
  - net-sdk
  - services
---

[RemotingHelper](http://www.thinktecture.com/Resources/RemotingFAQ/USEINTERFACESWITHCONFIGFILES.html) is a little helper class by [Ingo Rammer](http://www.thinktecture.com/staff/ingo/default.html) that enables you to use interfaces to access remote objects instead of the implementation. In .NET 2.0 there are a lot of new features, and one of them are generics. Especially with the RemotingHelper we deal with types and with the `GetObject` method we can use generics to parameterize the method by type.

In .NET 1.1 we need to write something like

```csharp
ICustomerService customerService = RemotingHelper.GetObject(typeof(ICustomerService)) as ICustomerService;
```

when using generics in .NET 2.0 we can simply write

```csharp
ICustomerService customerService = RemotingHelper.GetObject<ICustomerService>();
```

No need to cast and no `typeof` operator! Below you find a version of the `RemotingHelper` using generics

```csharp
using System; 
using System.Collections.Generic; 
using System.Runtime.Remoting;

public class RemotingHelper { 
  
  private static bool isInit; 
  private static IDictionary<Type, WellKnownClientTypeEntry> wellKnownTypes;

  public static T GetObject<T>() 
  { 
    if (!isInit) 
      InitTypeCache();

    WellKnownClientTypeEntry entry = wellKnownTypes\[typeof(T)\];

    if (entry == null) 
    { 
      throw new RemotingException("Type not found!"); 
    }

    return (T)Activator.GetObject(entry.ObjectType, entry.ObjectUrl); 
  }

  public static void InitTypeCache() 
  { 
    isInit = true; 
    wellKnownTypes = new Dictionary<Type, WellKnownClientTypeEntry>();

    foreach (WellKnownClientTypeEntry entry in RemotingConfiguration.GetRegisteredWellKnownClientTypes()) 
    { 
      if (entry.ObjectType == null) 
      { 
        throw new RemotingException("A configured type could not be found. Please check spelling"); 
      }

      wellKnownTypes.Add(entry.ObjectType, entry); 
    } 
  } 
} 
```
