---
title: Unit testing with NUnit and Visual Studio 2005 (MSUnit)
date: 2005-11-15
tags: 
  - testing
  - visual-studio
---

On my current project we are developing a windows forms application in [Visual Studio 2005](http://msdn.microsoft.com/vstudio/). We are still using [CruiseControl.NET](http://confluence.public.thoughtworks.org/display/CCNET/Welcome+to+CruiseControl.NET) for continuous integration and unit testing, because setting up a team foundation server would give an overhead right now.

For unit testing we like to have the nice debug and built-in features of MSUnit and the unit tests automatically tested by CruiseControl.NET through [NUnit](http://nunit.sf.net/). The good thing about the two libraries, is that they work through attributes and the common `Assert` methods are the same.

The template we use for our unit tests, looks like: 

```csharp
#if NUnit 
  using NUnit.Framework; 
#else 
  using Microsoft.VisualStudio.QualityTools.UnitTesting.Framework; 
#endif

namespace MyUnitTests { 
    
  [NUnit.Framework.TestFixture] 
  [Microsoft.VisualStudio.QualityTools.UnitTesting.Framework.TestClass] 
  public class MyTestClass 
  {       
    [NUnit.Framework.Test] 
    [Microsoft.VisualStudio.QualityTools.UnitTesting.Framework.TestMethod] 
    public void MyTestMethod() 
    { 

    } 
  } 
} 
```

We migrated our project to the new [Composite UI](http://www.gotdotnet.com/codegallery/codegallery.aspx?id=22f72167-af95-44ce-a6ca-f2eafbf2653c). Yes, today a new release of the cab has been released. In the unit tests of CAB I noticed they did the same trick, but with aliases: 

```csharp
#if !NUNIT 
  using Microsoft.VisualStudio.TestTools.UnitTesting; 
#else 
  using NUnit.Framework; 
  using TestClass = NUnit.Framework.TestFixtureAttribute; 
  using TestMethod = NUnit.Framework.TestAttribute; 
  using TestInitialize = NUnit.Framework.SetUpAttribute; 
  using TestCleanup = NUnit.Framework.TearDownAttribute; 
#endif

namespace MyUnitTests 
{ 
  [TestClass] 
  public class MyTestClass 
  { 
    [TestMethod] 
    public void MyTestMethod() 
    { 

    } 
  } 
}
```
