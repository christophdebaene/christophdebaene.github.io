---
title: Running MSTest without Visual Studio – Gallio to the rescue
date: 2008-10-16
tags: 
  - testing
  - visual-studio
---

In some cases it can be useful to quickly run your Microsoft unit tests on a machine where Visual Studio is not installed. For example on an end-user machine and/or during acceptance testing. Microsoft unit tests have a great integration with Visual Studio and Team Foundation Server, but unfortunately the unit tests cannot be run as a standalone application.

I saw there was an open-source adapter for NUnit, called [Microsoft Team System NUnit Adapter](http://www.exactmagic.com/blog/2008/02/09/microsoft-team-system-nunit-adapter/) from [Exact Magic Software](http://www.exactmagic.com) that can run Microsoft unit tests inside NAnt. For my unit tests I had some problems with the [ExpectedException](http://msdn.microsoft.com/en-us/library/microsoft.visualstudio.testtools.unittesting.expectedexceptionattribute(VS.80).aspx) attribute. Then I noticed there is a project called [Gallio](http://www.gallio.org/) and it worked like a charm and it can do a lot more! I noticed that today a new version has been released, namely [Gallio v3.0.4](http://www.gallio.org/Downloads.aspx).

Gallio is a extensible , open and neutral test automation platform. It provides tools and services needed to run and manipulate tests written using a wide range of other frameworks. Gallio can run tests from

- [MbUnit](http://www.mbunit.com/)
- [MSTest](http://msdn.microsoft.com/en-us/library/ms182486.aspx)
- [NBehave](http://nbehave.org/)
- [NUnit](http://www.nunit.org/index.php)
- [xUnit.NET](http://www.codeplex.com/xunit)

and it can integrate with the following tools

- [CCNet](http://confluence.public.thoughtworks.org/display/CCNET/Welcome+to+CruiseControl.NET)
- [MSBuild](http://msdn2.microsoft.com/en-us/library/0k6kkbsd.aspx)
- [NAnt](http://nant.sourceforge.net/)
- [NCover](http://www.ncover.com/)
- [Pex](http://research.microsoft.com/Pex/)
- [Powershell](http://www.microsoft.com/windowsserver2003/technologies/management/powershell/default.mspx)
- [Resharper](http://www.jetbrains.com/resharper/index.html)
- [TestDriven.NET](http://www.testdriven.net/)
- [TypeMock](http://www.typemock.com/)
- [Visual Studio Team System](http://msdn.microsoft.com/en-us/vsts2008/products/default.aspx)

To run the the tests there is a command-line runner, called ‘Echo’ and a graphical user-interface, called ‘Icarus’.

![Gallio](images/gallio.png)
