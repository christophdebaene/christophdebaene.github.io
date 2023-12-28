---
title: CruiseControl.NET
date: 2004-06-07
---

[CruiseControl.NET](http://confluence.public.thoughtworks.org/display/CCNET/Welcome%2Bto%2BCruiseControl.NET) is a continuous integration tool we have set up for our current project. It automatically builds when there is a change in source control (VSS, CVS, ClearCase, etc), and it reports it in a nice web layout with all the build, nunit, fxcop results.

There is also a nice tray application that can be installed on the developers pc's which indicates the status of the builds, for example it becomes:

- **green**: build is successfull
- **yellow**: server is currently building
- **red**: build is failed
- **gray**: server is unavailable

It's always a moment of truth when checking in code and hoping that the tray application remains green :-)

We use [NAnt](https://nant.sourceforge.net/) as build tool and [NUnit](http://www.nunit.org/) for unit testing. The only thing to pay attention for is that for example deleted files in VSS remains in the working directory and therefore still be included by NAnt. Therefore we setup a small integration server where VSS, Microsoft.NET SDK 1.1 and CruiseControl.NET is installed. The build script that is called by CruiseControl.NET does basically the following tasks:

- delete all source files
- get latest version of sources
- get latest version of buildscripts
- build the sources
- test the binaries

(buildscripts, NAnt and NUnit are stored in VSS)

NAnt can do operations on VSS if you download [NAntContrib](https://nantcontrib.sourceforge.net/), there you have a set of additional tasks like 'vssget', 'vsslabel', etc. Note that it is a real advantage of storing your buildscripts in VSS so that CruiseControl.NET always uses the latest buildscripts.
