---
title: Visual Studio DSL/GAT – How to load a DSL model
date: 2006-10-25
tags: 
  - visual-studio
---

On [IStaySharp.NET](http://www.istaysharp.net/) I created an [article](http://www.istaysharp.net/index.php?title=Visual_Studio_DSL/GAT) that shows you, how you can load a [DSL](http://msdn.microsoft.com/vstudio/DSLTools/) file. This is necessary if you need to access your model from GAT, a Visual Studio AddIn, custom library, etc. The last couple of weeks I am digging into DSL and GAT for creating a set of software factories at [Real Software](http://www.realsoftware.be) that will be used as a baseline for building applications.

Learning two (DSL & GAT) simultaneously and combining them was not so trivial and there is some learning curve. For GAT there are some interesting resources:

- [GuidanceAutomation.net](http://www.guidanceautomation.net)
- [GAT MSDN Forum](http://forums.microsoft.com/MSDN/ShowForum.aspx?ForumID=78&SiteID=1)
- [Guidance Automation Series](http://jelle.druyts.net/CategoryView.aspx?category=Blog%7cProgramming%7c.NET%7cGuidanceAutomation) by [Jelle Druyts](http://jelle.druyts.net)
- GAT Code that is used by the P&P team
    - [Smart Client Software Factory](http://www.gotdotnet.com/codegallery/codegallery.aspx?id=941d2228-3bb5-42fd-8004-c08595821170)
    - [Service Factory](http://www.gotdotnet.com/codegallery/codegallery.aspx?id=6fde9247-53a8-4879-853d-500cd2d97a83)

The [MSDN forums](http://forums.microsoft.com/MSDN/default.aspx?siteid=1) is a good resource when you have some issues and/or questions. DSL has also a specific [forum](http://forums.microsoft.com/MSDN/ShowForum.aspx?ForumID=61&SiteID=1). The capabilities of DSL are really impressive. Now you have finally the tools to write for example your own dataset designer with code generation!!!
