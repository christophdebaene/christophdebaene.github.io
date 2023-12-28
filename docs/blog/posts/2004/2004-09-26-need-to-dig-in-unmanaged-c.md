---
title: Need to dig in unmanaged C++
date: 2004-09-26
tags: 
  - net-sdk
---

I am currently working on a project where we have to interact several applications (COM, .NET, Linux, Java, etc.) together through a messaging system. One of the applications is a windows application that exposes an application object. In this way we can host it through .NET. The problem is that the application object doesn't expose any events; no exit, close or quit event. What I need to properly close the .NET host.

In contrast to the Win32 SendMessage you can use system hooks to listen to events from any application. But after googling I noticed that .NET doesn't support global hooks! The only way to accomplish, is to make an unmanaged C++ DLL that catches the system hooks, and the .NET DLL will receive them. An example of that can be found on CodeProject [Global System Hooks in .NET](http://www.codeproject.com/csharp/GlobalSystemHook.asp). Unfortanetly it only receives mouse and keyboard events, so I have to extend it to receive application events.
