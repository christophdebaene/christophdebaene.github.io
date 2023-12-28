---
title: Create your own web server
date: 2006-09-26
---

[Cassini](http://www.asp.net/Projects/Cassini/Download/) is a ASP.NET sample application that shows how to write a web server using .NET. This means that you can host ASP.NET using the ASP.NET hosting APIs ([System.Web.Hosting](http://msdn2.microsoft.com/en-us/library/system.web.hosting.aspx)). This is really an alternative to IIS. There is also a second project called [UltiDev Cassini Web Server](http://ultidev.com/products/Cassini/index.htm) which is based on the Cassini source with the following additional features:

- Comes ready for distribution with Visual Studio ASP.NET applications
- Runs as a windows service
- Hosts and runs multiple ASP.NET applications
- Provides management UI and simple API for configuring web applications
- Comes in two flavors: 2.0 version for ASP.NET 2.0 applications, and 1.1 for applications compiled for ASP.NET 1.1

If you have the need for an offline version of your ASP.NET application, where easy deployment is required (without IIS), then this is a very good solution.
