---
title: AOP in Action - Dirty Tracking using Unity Interception
date: 2008-11-02
tags: 
  - patterns-practices
---

In most enterprise applications, you end up by having a lot of cross-cutting concerns throughout your application. Most of the time, you have, for example, infrastructure code for doing logging, dirty tracking, lazy loading, caching, etc. Often infrastructure code is scattered over a number of modules making it harder to maintain and understand. [Aspect-oriented programming (AOP)](http://en.wikipedia.org/wiki/Aspect-oriented_programming) solves this problem by allowing the programmer to express [cross-cutting concerns](http://en.wikipedia.org/wiki/Cross-cutting_concern) in stand-alone modules called aspects.

When you apply [domain-driven design](http://en.wikipedia.org/wiki/Domain-driven_design), you often have the need for dirty tracking, check on a business entity whether the entity has changed (is dirty) or not. There are a lot of different implementations for dirty tracking, but in this article we are doing it by using an interface called `IDirty` that contains a property called `IsDirty` and the setter properties of your entity object calls the `IsDirty` if the value has changed.

```csharp
public interface IDirty
{
   bool IsDirty { get; set; }
}
 
public class Customer : IDirty
{
   private string _firstName;
   private string _lastName;
 
   public bool IsDirty { get; set; }
 
   public string FirstName
   {
      get { return _firstName; }
      set
      {
         if (value != _firstName)
            IsDirty = true;
         _firstName = value;
      }
   }
 
   public string LastName
   {
      get { return _lastName; }
      set
      {
         if (value != _lastName)
        IsDirty = true;
 
            _lastName = value;
      }
   }
}
```

As you can see from the example, if you have a lot of properties, you end up by having a lot of infrastructure code and repeated code in each setter. What we want to achieve, is to [annotate](http://martinfowler.com/dslwip/Annotation.html) the setter property through an attribute called `DirtyAttribute` and that the dirty logic is centralized in one module.

```csharp
[AttributeUsage(AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
public class DirtyAttribute : System.Attribute
{
}
 
public interface IDirty
{
   bool IsDirty { get; set; }
}
 
public class Customer : IDirty
{
   public bool IsDirty { get; set; }
 
   public virtual string FirstName { get; [Dirty] set; }
   public virtual string LastName { get; [Dirty] set; }
}
```

Note that these are the only dependencies needed inside your domain model project. Now we need to make clear to [Unity](http://www.codeplex.com/unity) that we need to intercept the `DirtyAttribute` and execute some logic. With unity we denote a policy, a policy contains a set of matching rules and a set of call handlers. A matching rule will denote on which point the handler must be executed and the handler is the logic. In AOP this is called respectively a pointcut and an advice, the combination of the two is called an aspect. First, we are going to create our `DirtyHandler` by implementing the `ICallHandler` that resides in the `Microsoft.Unity.Interception` assembly.

```csharp
public class DirtyHandler : ICallHandler
{
   public int Order { get; set; }
 
   public IMethodReturn Invoke(IMethodInvocation input, GetNextHandlerDelegate getNext)
   {
      Advise(input.Target, input.MethodBase, input.Arguments[0]);
      return getNext()(input, getNext);
   }
 
   private void Advise(object target, MemberInfo methodInfo, object value)
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
 
   private bool IsEqual(object valueX, object valueY)
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

Note that in the `DirtyHandler` we did not specify when the dirty logic is executed, this is done by a set of matching rules that implement the `IMatchingRule` interface. In our case we have three criterias, first that it can only be applied to a setter property, secondly that the setter property must be annotated with the `DirtyAttribute` and finally that the class must implement the `IDirty` interface. In Unity we have predefined rules that we can use, in our case we can use the `PropertyMatchingRule` and the `CustomAttributeMatchingRule`. To detect that a particular instance implements a given type, I created the `InstanceOfMatchingRule`.

```csharp
public class InstanceOfMatchingRule : IMatchingRule
{
   private readonly Type _type;
 
   public InstanceOfMatchingRule(Type type)
   {
      _type = type;
   }
 
   public bool Matches(System.Reflection.MethodBase member)
   {
      return _type.IsAssignableFrom(member.DeclaringType);
   }
}
```

Now we are ready to configure our container for interception. Note that the interception mechanism inside Unity is implemented as an extension to the Unity block. Below we configure a policy named "DirtyPolicy" that executes the handler named "DirtyHandler" if it matches all three matching rules (`PropertyMatchingRule`, `CustomAttributeMatchingRule` and `InstanceOfMatchingRule`). In this example, we denote that the type `Customer` is configured with the `VirtualMethodInterceptor`. Note that this type of interception only works if your methods/properties are marked as virtual, which is the case for our `Customer` type (see `Customer.cs`).

```csharp
// Start Configuration
IUnityContainer container = new UnityContainer()
   .AddNewExtension<Interception>()
   .RegisterInstance<ICallHandler>("DirtyHandler", new DirtyHandler());
 
container.Configure<Interception>()
   .SetInterceptorFor<Customer>(new VirtualMethodInterceptor())
   .AddPolicy("DirtyPolicy")
      .AddMatchingRule(new PropertyMatchingRule("*", PropertyMatchingOption.Set))
      .AddMatchingRule(new CustomAttributeMatchingRule(typeof(DirtyAttribute), true))
      .AddMatchingRule(new InstanceOfMatchingRule(typeof(IDirty)))
      .AddCallHandler("DirtyHandler");
// End Configuration
 
var customer = container.Resolve<Customer>();
 
var firstname = customer.FirstName;
Debug.Assert(!customer.IsDirty);
customer.FirstName = "Piet";
Debug.Assert(customer.IsDirty);
```

The configuration part can also be done through a configuration file. Unfortunately, there is no schema available, this means that there is no validation and intellisense inside your Visual Studio! Especially to describe the matching rules through xml, I had to introduce some extra converters that implement the [TypeConverter](http://msdn.microsoft.com/en-us/library/system.componentmodel.typeconverter.aspx) class. This enables you to convert to any kind of object started from a string. I introduced the `PropertyMatchingOptionConverter` and `GetTypeConverter`.

```csharp
public class PropertyMatchingOptionConverter : System.ComponentModel.TypeConverter
{
   public override object ConvertFrom(System.ComponentModel.ITypeDescriptorContext context, System.Globalization.CultureInfo culture, object value)
   {
      return (PropertyMatchingOption)Enum.Parse(typeof(PropertyMatchingOption), value.ToString());
   }
}
 
public class GetTypeConverter : System.ComponentModel.TypeConverter
{
   public override object ConvertFrom(System.ComponentModel.ITypeDescriptorContext context, System.Globalization.CultureInfo culture, object value)
   {
      return Type.GetType(value.ToString());
   }
}
```

Below you find how you use Unity with a configuration file and you find also the resulting xml file that does exactly the same as the above-mentioned version.

```csharp
IUnityContainer container = new UnityContainer();
UnityConfigurationSection section = (UnityConfigurationSection)ConfigurationManager.GetSection("unity");
section.Containers["Default"].Configure(container);
 
var customer = container.Resolve<Customer>();
```

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
  <configSections>
<section name="unity" type="....UnityConfigurationSection, ..."/>
  </configSections>
  <unity>
    <typeAliases>
 
      <typeAlias alias="bool"     type="System.Boolean, mscorlib" />
      <typeAlias alias="string"   type="System.String, mscorlib" />
      <typeAlias alias="int"      type="System.Int32, mscorlib" />
      <typeAlias alias="Type"     type="System.Type, mscorlib" />
 
      <typeAlias alias="GetTypeConverter" type="..."/>
      <typeAlias alias="PropertyMatchingOptionConverter" type="..."/>
      <typeAlias alias="InstanceOfMatchingRule" type="..."/>
      <typeAlias alias="DirtyHandler" type="..."/>
      <typeAlias alias="VirtualMethodInterceptor" type="..."/>
      <typeAlias alias="CustomAttributeMatchingRule" type="..."/>
      <typeAlias alias="PropertyMatchingRule" type="..."/>
      <typeAlias alias="PropertyMatchingOption" type="..."/>
      <typeAlias alias="DirtyAttribute" type="..."/>
      <typeAlias alias="IDirty" type="..."/>
      <typeAlias alias="Customer" type="..."/>
 
    </typeAliases>
    <containers>
      <container name="Default">
        <extensions>
          <add type="....Interception, ..."/>
        </extensions>
        <extensionConfig>
          <add name="interception" type="....InterceptionConfigurationElement, ...">
            <policies>
              <policy name="DirtyPolicy">
                <matchingRules>
                  <matchingRule name="SetPropertyRule" type="PropertyMatchingRule">
                    <injection>
                      <constructor>
                        <param name="propertyName" parameterType="string">
                          <value value="*"/>
                        </param>
                        <param name="option" parameterType="PropertyMatchingOption">
                          <value value="Set" type="PropertyMatchingOption" typeConverter="PropertyMatchingOptionConverter"/>
                        </param>
                      </constructor>
                    </injection>
                  </matchingRule>
                  <matchingRule name="DirtyAttributeRule" type="CustomAttributeMatchingRule">
                    <injection>
                      <constructor>
                        <param name="attributeType" parameterType="Type">
                          <value value="...DirtyAttribute, ..." type="Type" typeConverter="GetTypeConverter"/>
                        </param>
                        <param name="inherited" parameterType="bool">
                          <value value="true" type="bool"/>
                        </param>
                      </constructor>
                    </injection>
                  </matchingRule>
                  <matchingRule name="InstanceOfIDirtyRule" type="InstanceOfMatchingRule">
                    <injection>
                      <constructor>
                        <param name="type" parameterType="Type">
                          <value value="...IDirty, ..." type="Type" typeConverter="GetTypeConverter"/>
                        </param>
                      </constructor>
                    </injection>
                  </matchingRule>
                </matchingRules>
                <callHandlers>
                  <callHandler name="DirtyHandler" type="DirtyHandler"/>
                </callHandlers>
              </policy>
            </policies>
            <interceptors>
              <interceptor type="VirtualMethodInterceptor">
                <key type="Customer"/>
              </interceptor>
            </interceptors>
          </add>
        </extensionConfig>
      </container>
    </containers>
  </unity>
</configuration>
```

The source code of this article can be downloaded [here](http://christophdebaene.com/blog/wp-content/uploads/2008/11/AOP-in-Action-Part-1.zip)
