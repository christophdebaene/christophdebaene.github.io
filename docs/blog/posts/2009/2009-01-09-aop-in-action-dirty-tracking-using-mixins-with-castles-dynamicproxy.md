---
title: AOP in Action - Dirty Tracking using Mixins with Castle’s DynamicProxy
date: 2009-01-09
tags: 
  - patterns-practices
---

In [Part 1](http://www.christophdebaene.com/blog/2008/11/02/aop-in-action-part-1-dirty-tracking-using-unity-interception/), we used the [Unity](http://www.codeplex.com/unity) block to intercept properties for dirty tracking. Our target class needed to implement the `IDirty` interface, and the setter properties (annotated with the Dirty attribute) assigned the Dirty flag (of `IDirty`) when the value has changed. Take for example the following classes:

```csharp
[AttributeUsage(AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
public class DirtyAttribute : System.Attribute
{
}
 
public interface IDirty
{
    bool IsDirty { get; set; }
}
 
public class Customer
{
    public virtual string FirstName { get; [Dirty] set; }
    public virtual string LastName { get; [Dirty] set; }
}
```

Note that in contrast to [Part 1](http://www.christophdebaene.com/blog/2008/11/02/aop-in-action-part-1-dirty-tracking-using-unity-interception/), the _Customer_ object doesn’t implement the `IDirty` interface. In this example we are going to use a [mixin](http://en.wikipedia.org/wiki/Mixins) for dirty tracking, a mixin is a class that provides a certain functionality to be inherited by a subclass, but is not meant to stand alone. That’s exactly what we want to achieve, that is to provide extra functionality, namely dirty tracking, to our _Customer_ object.

We simply have to implement the `IDirty` interface once and for all and call it for example `DirtyMixin`.

```csharp
[Serializable]
public class DirtyMixin : IDirty
{
   public bool IsDirty { get; set; }
}
```

As interception and mixin mechanism we use [Castle’s DynamicProxy](http://www.castleproject.org/dynamicproxy/index.html), the latest build can be found [here](http://builds.castleproject.org/cruise/index.castle). To intercept our (dirty) properties we need to implement an interface called [IInterceptor.](http://api.castleproject.org/html/T_Castle_Core_Interceptor_IInterceptor.htm) In the implementation we write the code that need to be executed (advice) at particular points (pointcut) in the program. Note that with [Unity](http://www.codeplex.com/unity) we have the notion of [IMatchingRule](http://msdn.microsoft.com/en-us/library/dd140076.aspx) for defining Pointcuts, whereas in DynamicProxy we have to do it manually.

```csharp
public class DirtyInterceptor : Castle.Core.Interceptor.IInterceptor
{
    public void Intercept(Castle.Core.Interceptor.IInvocation invocation)
    {
        if (PointCut(invocation.Proxy, invocation.Method))
        {
            Advise(invocation.Proxy, invocation.Method, invocation.GetArgumentValue(0));
        }
 
        invocation.Proceed();
    }
 
    bool PointCut(object target, MethodInfo methodInfo)
    {
        if (IsSetter(methodInfo) && target is IDirty)
        {
            object[] dirtyAttributes = methodInfo.GetCustomAttributes(typeof(DirtyAttribute), true);
            return (dirtyAttributes != null && dirtyAttributes.Length > 0);
        }
        else
        {
            return false;
        }
    }
 
    void Advise(object target, MemberInfo methodInfo, object value)
    {
        string propertyName = methodInfo.Name.Substring("set_".Length);
        PropertyInfo info = target.GetType().GetProperty(propertyName);
 
        if (info != null)
        {
            object oldValue = info.GetValue(target, null);
 
            if (!IsEqual(value, oldValue))
                ((IDirty)target).IsDirty = true;
        }
    }
 
    bool IsSetter(MethodInfo methodInfo)
    {
        return (methodInfo.Name.StartsWith("set_")) && (methodInfo.GetParameters().Length == 1);
    }
 
    bool IsEqual(object valueX, object valueY)
    {
        if (valueX == null && valueY != null)
            return false;
 
        if (valueX != null && valueY == null)
            return false;
 
        if (valueX == null && valueY == null)
            return true;
 
        return valueX.Equals(valueY);
    }
}
```

To generate our proxy we use the `ProxyGenerator` class that reside in the `Castle.DynamicProxy2` assembly. Adding a mixin is done through the `ProxyGenerationOptions` which is passed to the `CreateClassProxy` method.

```csharp
var generator = new ProxyGenerator();
 
ProxyGenerationOptions options = new ProxyGenerationOptions();
options.AddMixinInstance(new DirtyMixin());
 
Customer customer = generator.CreateClassProxy(typeof(Customer), options, new DirtyInterceptor()) as Customer;
 
var firstname = customer.FirstName;
Debug.Assert(!((IDirty)customer).IsDirty);
customer.FirstName = "Piet";
Debug.Assert(((IDirty)customer).IsDirty);
```

The customer object that we receive from the generator is a proxy through subclassing and you will see that it now implements the `IDirty` interface.

![MixinReflector_2](images/mixinreflector_2.jpg)

You can use the `PersistentProxyBuilder` to save the generated assembly. It renders an assembly called `CastleDynProxy2.dll`. Below you find an example how you can use `PersistentProxyBuilder`.

```csharp
var generator = new ProxyGenerator(new PersistentProxyBuilder());
 
ProxyGenerationOptions options = new ProxyGenerationOptions();
options.AddMixinInstance(new DirtyMixin());
 
Customer customer = generator.CreateClassProxy(typeof(Customer), options, new DirtyInterceptor()) as Customer;
 
string proxyAssemblyPath = ((PersistentProxyBuilder)generator.ProxyBuilder).SaveAssembly();
 
var firstname = customer.FirstName;
Debug.Assert(!((IDirty)customer).IsDirty);
customer.FirstName = "Piet";
Debug.Assert(((IDirty)customer).IsDirty);
```

You can go a bit further and use an extension method that enables you to ask for a certain service. Internally it will simply try to cast to the given interface.

```csharp
public static class ObjectExtensions
{
    public static T GetService<T>(this object instance) where T : class
    {
        return instance as T;
    }
}
```

Given the `GetService` extension method, we use our customer as follow

```csharp
IDirty dirty = customer.GetService<IDirty>();
if (dirty != null)
{
    var firstname = customer.FirstName;
    Debug.Assert(!dirty.IsDirty);
    customer.FirstName = "Piet";
    Debug.Assert(dirty.IsDirty);
}
```

The source code of this article can be downloaded [here](http://christophdebaene.com/blog/wp-content/uploads/2009/01/AOP-in-Action-Part-2.zip)
