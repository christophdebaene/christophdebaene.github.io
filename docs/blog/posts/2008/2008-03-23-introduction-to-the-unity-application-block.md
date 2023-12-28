---
title: Introduction to the Unity Application Block
date: 2008-03-23
tags: 
  - unity
---

The unity application block is a dependency injection container with support for constructor, property and method call injection. It simplifies the [Inversion of Control (IoC)](http://en.wikipedia.org/wiki/Inversion_of_control) pattern and the [Dependency Injection (DI)](http://en.wikipedia.org/wiki/Dependency_injection) pattern. The Unity application block can be found on [CodePlex](http://www.codeplex.com/unity).

The unity application block has two important methods for registering types and mappings into the container, namely `RegisterType` and `RegisterInstance`.

{{ read_csv('./unity.csv') }}

Below you find an example where we map the `ILogger` interface to `ConsoleLogger` (implements `ILogger`).

```csharp
UnityContainer container = new UnityContainer();
container.RegisterType<ILogger, ConsoleLogger>();
ILogger logger = container.Resolve<ILogger>();
```

Assume you have the following class that contains a dependency to `ILogger` as a parameter on the constructor.

```csharp
public class MyClass
{
   ILogger _logger;
 
   public MyClass(ILogger logger)
   {
      _logger = logger;
   }
}
```

If we use the `Resolve` method of `UnityContainer` it will automatically inject the `ILogger` (`ConsoleLogger`) object. This is called constructor injection.

```csharp
UnityContainer container = new UnityContainer();
container.RegisterType<ILogger, ConsoleLogger>();
MyClass myClass = container.Resolve<MyClass>();
```

You can also map multiple types for the same interface. In that case you can use a key as a parameter.

```csharp
UnityContainer container = new UnityContainer();
container.RegisterType<ILogger, ConsoleLogger>("console");
container.RegisterType<ILogger, EventLogger>("event");
```

If you now try to resolve `MyClass` you will get an exception, because it cannot resolve which type (`ConsoleLogger` or `EventLogger`) to use. Therefore you can use the `Dependency` attribute where you can denote a key. For example:

```csharp
public class MyClass
{
   ILogger _logger;
 
   public MyClass([Dependency("console")] ILogger logger)
   {
      _logger = logger;
   }
}
```

Below you find an example of property injection:

```csharp
public class AnotherClass
{
   ILogger _consoleLogger;
   ILogger _eventLogger;
 
   [Dependency("console")]
   public ILogger ConsoleLogger
   {
      get { return _consoleLogger; }
      set { _consoleLogger = value; }
   }
 
   [Dependency("event")]
   public ILogger EventLogger
   {
      get { return _eventLogger; }
      set { _eventLogger = value; }
   }
}
```

Note that you can also map and register your types through a configuration file.

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
  <configSections>
<section name="unity" type="Microsoft.Practices.Unity.Configuration.UnityConfigurationSection, Microsoft.Practices.Unity.Configuration" />
  </configSections>
  <unity>
    <containers>
      <container>
        <types>
          <type name="console" type="IStaySharp.UnitySample.ILogger, IStaySharp.UnitySample" mapTo="IStaySharp.UnitySample.ConsoleLogger, IStaySharp.UnitySample" />
          <type name="event" type="IStaySharp.UnitySample.ILogger, IStaySharp.UnitySample" mapTo="IStaySharp.UnitySample.EventLogger, IStaySharp.UnitySample" />
        </types>
      </container>
  </containers>
  </unity>
</configuration>
```

The following code shows you how to use a configuration file with `UnityContainer`.

```csharp
UnityContainer container = new UnityContainer();
UnityConfigurationSection section = (UnityConfigurationSection)ConfigurationManager.GetSection("unity");
section.Containers.Default.GetConfigCommand().Configure(container);
 
ILogger logger = container.Resolve<ILogger>("console");
```