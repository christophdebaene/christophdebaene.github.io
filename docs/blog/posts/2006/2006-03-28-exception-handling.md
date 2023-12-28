---
title: Exception Handling
date: 2006-03-28
---

When reviewing code, you see a lot of 'bad' use of exception handling. As [Pieter Gheysens](http://feeds.feedburner.com/DotNetDev?m=59) mentioned, you see a lot of code that looks like:

```csharp
try 
{ 
    // code statements 
} 
catch(Exception exc) 
{ 
    throw exc; 
} 
```

No extra logic defined inside the catch-block, like logging, and when it is meant to re-throw an exception, the `throw` statement must be used, instead of `throw ex`. The statement `throw ex` will erase the original stacktrace. Best practice for exception handling is

```csharp
try 
{ 
    // code that could throw an exception 
} 
catch(Exception exc) 
{ 
    // log exception throw; 
}
```

In case of a traditional layered architecture, UI, Business Logic (BL) & Data Access Logic (DAL), you will catch a DAL exception inside the BL layer, and translate it to a 'meaningfull' business exception. Each layer has a specific purpose and domain, and so are the exceptions!

It's also a good idea to subscribe to the `Application.ThreadException` (in case of a form application) and do the logging in there. Here [log4net](http://logging.apache.org/log4net/) is used as logging tool.

```csharp
ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

Application.ThreadException += new System.Threading.ThreadExceptionEventHandler(Application\_ThreadException);

static void Application_ThreadException(object sender, System.Threading.ThreadExceptionEventArgs e) 
{ 
    log.Error("Application error", e.Exception); 
    // show custom error dialog or throw 
}
```
