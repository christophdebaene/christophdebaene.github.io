---
title: Building the source code of ASP.NET (Web API)
date: 2012-04-06
tags: 
  - asp-net
  - asp-net-web-api
---

There is a lot of activity in the [source](http://aspnetwebstack.codeplex.com/SourceControl/list/changesets) code of [ASP.NET](http://aspnetwebstack.codeplex.com/) on [CodePlex](http://www.codeplex.com/). Because of some [bug](http://aspnetwebstack.codeplex.com/workitem/10) that has been fixed, I wanted to try out the latest build.

Simply download the latest source code from CodePlex (I used changed set [88372a0b4ab9](http://aspnetwebstack.codeplex.com/SourceControl/changeset/changes/88372a0b4ab9)). Like it is mentioned on CodePlex you have to obtain the [NuGet Packages](http://aspnetwebstack.codeplex.com/wikipage?title=NuGet%20Packages) first and after that you can build. 

```bash
build RestorePackages
build
```

To test some things out I created a simple console application (inside the same solution) and added the following references with the following code

- System.Net.Http
- System.Web.Http
- System.Web.Http.SelfHost

```csharp
static void Main(string[] args)
{
   var baseAddress = "http://localhost:7777/";
   var config = new HttpSelfHostConfiguration(baseAddress);
   config.Routes.MapHttpRoute(
      name: "DefaultApi",
      routeTemplate: "api/{controller}/{id}",
      defaults: new
      {
         id = RouteParameter.Optional
      });
 
   var server = new HttpSelfHostServer(config);
   server.OpenAsync().Wait();
   Console.WriteLine("The server is running...");
}
```

When you have installed [ASP.NET MVC4 Beta](http://www.asp.net/mvc/mvc4) you will get the following error

> Could not load type 'System.Web.Http.RouteParameter' from assembly 'System.Web.Http, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35'.

Because the signed assembly has the same version it will always load the one that reside in the [GAC](http://en.wikipedia.org/wiki/Global_Assembly_Cache). There are breaking changes in the new version and it clearly doesn't load the latest 'System.Web.Http' assembly within the solution! This can be seen and monitored by using [Fuslogvw](http://msdn.microsoft.com/en-us/library/e74a18c4(v=vs.100).aspx).

To resolve this problem we can use [DEVPATH](http://msdn.microsoft.com/en-us/library/cskzh7h6.aspx). It's an environment variable that you can set to a folder (typically you're output folder). The runtime will use the DEVPATH folder for probing before looking into the GAC! After setting the DEVPATH environment variable (I had to restart my Visual Studio to take effect) you have to add the following in the config file and after that everything worked fine. 

```xml
<?xml version="1.0"?>
<configuration>
  <runtime>
    <developmentMode developerInstallation="true"/>
  </runtime>
</configuration>
```
