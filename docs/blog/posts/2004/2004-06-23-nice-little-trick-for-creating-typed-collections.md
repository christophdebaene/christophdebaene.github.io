---
title: Nice little trick for creating typed collections
date: 2004-06-23
tags: 
  - net-sdk
---

I found somewhere in the newsgroups a nice trick for creating typed collections. In most of the cases typed collections only differ in the type they get and set.

To make things easier we can do the following. Create an integer collection class, like below:

``` csharp
using System; 
using System.Collections; 
using ItemType = System.Int32;

public class IntCollection : CollectionBase { 

  public void Add(ItemType val) 
  {
    this.List.Add(val); 
  }

  public void Remove(ItemType val) 
  { 
    this.List.Remove(val); 
  }

  public ItemType this[int index] 
  { 
      get { return (ItemType)this.List[index]; } 
      set { this.List[index] = value; } 
  } 
} 
```

Here we use an alias named `ItemType` that denote the type that the collection must work with. If we want a collection of the class `Employee`, we simply copy/paste the `IntCollection` class and change the class name to `EmployeeCollection` and set the `ItemType` to `Entities.Employee` for example. So we have something like:

``` csharp
using System; 
using System.Collections; 
using ItemType = Entities.Employee;

public class EmployeeCollection: CollectionBase 
{ 
  public void Add(ItemType val) 
  { 
    this.List.Add(val); 
  } 
  
  public void Remove(ItemType val) 
  { 
    this.List.Remove(val); 
  } 
  
  public ItemType this[int index] 
  { 
    get { return (ItemType)this.List[index]; } 
    set { this.List[index] = value; } 
  } 
}
```

Offcourse you can use search and replace, but I found this method more elegant :-)
