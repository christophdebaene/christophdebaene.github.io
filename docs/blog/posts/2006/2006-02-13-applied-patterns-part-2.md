---
title: Applied Patterns – Part 2
date: 2006-02-13
tags: 
  - patterns-practices
---

Building an application and/or library usually starts with an OO design. Typically from that design you will define interfaces and implement base classes, which can be used as a starting point for building your application.

Defining the signature of a base class is very important. More specific, the visibility (public, protected & private) and purpose (virtual or not) of the methods are very important. Take for example an order-entry form based application that contains several screens for adding and updating data. Every screen will need to implement a kind of save method for persisting the changes. The very basic structure of your design can be:

```csharp
public interface IDataView 
{ 
  void Save() 
}

public class DataViewBase: IDataView 
{ 
  public virtual void Save() 
  {     
  } 
} 
```

Here the intention is that for example every screen of your application need to inherit from `DataViewBase` and implement the `Save` method. The problem with this design, is that the interface is marked as virtual (see [Virtuality](http://www.gotw.ca/publications/mill18.htm)) and is responsible for two jobs, namely that it is part of an interface and for specifying the implementation.

A better way is to apply the [Template Method](http://www.dofactory.com/Patterns/PatternTemplate.aspx) design pattern, also called the  'Hollywood principle', that is, 'Don't call us, we'll call you'. (This pattern is also used a lot throughout the .NET SDK library.)

```csharp
public class DataViewBase: IDataView 
{ 
  public void Save() 
  { 
    DoSave(); 
  }

  protected virtual void DoSave() 
  { 
  } 
}
```

This way you have complete control of the interface and you can easily add some logging before and after the save for example, extra checks, etc. If for example you need to implement whether a form-screen is dirty or not, you can easily plug it in as follow:

```csharp
public class DataViewBase: IDataView 
{ 
  public void Save() 
  { 
      // do some checks 
      // do some logging

      if (IsDirty()) 
        DoSave(); 
  }

  protected virtual void DoSave() 
  {     
  }

  protected virtual bool IsDirty() 
  { 
    return true; } 
  }
```

If for example you need to extend the application such that when the screen is dirty you get a dialog box asking if you want to save or not. You can simply change the Save method without affecting the derived classes

```csharp
public class DataViewBase: IDataView 
{ 
  public void Save() 
  { 
    // do some checks 
    // do some logging

    if (IsDirty()) 
      if (MessageBox.Show("Do you want to save?", "Information", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes) 
      DoSave(); 
  }

  protected virtual void DoSave() 
  {     
  }

  protected virtual bool IsDirty() 
  { 
    return true; 
  } 
} 
```

Due to the fact that the interface and the custom implementation is separated, we can easily extend and have control of the interface. In the other case we would have a lot of code duplication and in most cases we would violate the [Liskov Substitution principle](http://www.objectmentor.com/resources/articles/lsp.pdf).
