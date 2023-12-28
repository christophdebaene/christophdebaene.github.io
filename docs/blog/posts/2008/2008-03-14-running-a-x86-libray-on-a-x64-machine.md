---
title: Running a x86 libray on a x64 machine
date: 2008-03-14
---

In my current sample project when the runtime tried to access the MyMeta library (see following [post](http://christoph.debaene.net/weblog/PermaLink,guid,fd29652d-0beb-4bca-bfab-f1ae85a98099.aspx)) I always get the following [FatalExecutingEngineError](http://msdn2.microsoft.com/en-us/library/ms228990.aspx) exception:

![FatalExecutionEngineError_2](images/fatalexecutionengineerror_2.jpg)

It turns out that the problem is that the MyMeta library is compiled under a x86 platform whereas the application is running on a x64 platform. In the properties settings of your visual studio project you have to set the platform target to x86! It was set to 'Any CPU', but now everything works fine.

![BuildSettingsPlatform_2](images/buildsettingsplatform_2.jpg)
