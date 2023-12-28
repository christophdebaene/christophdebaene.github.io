---
title: Limitation of XMLSerializer
date: 2004-04-06
tags: 
  - net-sdk
---

In a distributed application I created a project (facade) where all business logic reside. I wrote a `ConfigSettings` class where all configuration settings reside, like for example the connectionstring. These settings are fetched from an XML file through the `XMLSerializer` from .NET. To enforce layer abstraction I changed the protection level of the `ConfigSettings` class to `internal`.

But when I try to deserialize the xml I get an `InvalidOperationException` I was a little bit surprised that apparently the `XMLSerializer` can only (de)serialize **public** classes_!!! After changing the protection level to `public` everything works fine, but there goes my abstraction (of course you can write your own implementation)
