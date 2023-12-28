---
title: Applied Patterns – Part 1
date: 2006-01-24
tags: 
  - patterns-practices
---

Nowadays, is every kind of enterprise application more complex because there is the need to have much richer UI experience, integration with other systems, security, etc. Therefore it's important to have a good architecture and design of your application, so that you can better **maintain** and **extend** your application.

In every enterprise application you have a dependency to data resources. These resources can be to a database, web service, registry, file system, etc. It's a good practice to encapsulate all these dependent resources into services, such that the consumer (caller of the service) doesn't need to know the implementation details and the origin of the data.

That pattern is used a lot and is called a [Service Gateway](http://patternshare.org/default.aspx/Home.PP.ServiceGateway) or [Service Agent](http://msdn.microsoft.com/library/default.asp?url=/library/en-us/dnea/html/eaappconservices.asp). There is a [discussion](http://loudcarrot.com/Blogs/dave/archive/2005/01/10/1141.aspx) on the difference between a _Service Gateway_ that can be seen as consumer of a service and a _Service Agent_ as a provider, but in the community both terms are used and mixed. The dependency between the consumer and the service is a contract which is typically a set of interfaces and business entities. In most cases, the service interface acts as a [facade](http://www.dofactory.com/Patterns/PatternFacade.aspx) pattern, it encapsulates all subsystems underneath.

![Des_ServiceInterface_Fig01](images/des_serviceinterface_fig01.gif)

A typical example of a service agent is:

```csharp
public interface ICustomerAgent 
{ 
  Customer GetCustomer(int customerId); 
  Order[] GetOrders(int customerId); 
} 
```

Note that the interface doesn't expose any details about the underlying system (e.g. database, xml, etc.) and communication protocol (e.g. web service, remoting, etc.).

Programming the UI of an application is typically the most difficult part and a challenge to achieve encapsulation and loose coupling. Thankfully there is for .NET 2.0 the [Composite UI](http://www.gotdotnet.com/codegallery/codegallery.aspx?id=22f72167-af95-44ce-a6ca-f2eafbf2653c) and the [Smart Client Baseline Architecture Toolkit](http://www.gotdotnet.com/codegallery/codegallery.aspx?id=941d2228-3bb5-42fd-8004-c08595821170) which guides you to an architecture for developing smart clients. Offcourse there is still the bible that every developer should read/know, it's the [GoF book](http://www.amazon.com/gp/product/0201633612/002-6374300-5093656?v=glance&n=283155) that describes a set of design patterns.

One of the drawbacks of a designer like in Visual Studio.NET, is that it is so easy to drag and drop (in dutch I call it 'drag en drol') components, change some attributes and going through wizards for making your application. For prototyping and demo's this is good enough, but for real enterprise applications it's not. If you want you can write an application that has only one class (= form), named _Form1.cs_ that includes all UI logic, business logic, data access, security, etc but that's not what we want.

Building the UI is basically populating UI controls with data that resides in business entities. This means that for example an array of customers that must be shown in a list, means that every customer entity must be translated to a [ListViewItem](http://msdn.microsoft.com/library/default.asp?url=/library/en-us/cpref/html/frlrfsystemwindowsformslistviewitemclasstopic.asp) (if we don't use databinding). In most of the cases this logic resides in the form/usercontrol itself, but in fact it can be seen as a separated responsability for mapping a customer entity to a _ListViewItem_ and vice versa (like in [SC-BAT](http://www.gotdotnet.com/codegallery/codegallery.aspx?id=941d2228-3bb5-42fd-8004-c08595821170)). This means that we can have something like:

```csharp
public static class CustomerMapper 
{ 
  public static ListViewItem ToListViewItem(Customer customer) { ... } 
  public static Customer FromListViewItem(ListViewItem listViewItem) { ... } 
} 
```

And in your form/usercontrol you write:

```csharp
foreach (Customer customer in customers) 
  customerListView.Items.Add(CustomerMapper.ToListViewItem(customer)); 
```

In every project there are some OO concepts and patterns I always try to achieve maintainability and extensibility. Making good OO designs is in my opinion a matter of experience, creativity and making abstractions. My conclusion...

!!! abstract

    The art of OO programming is to **define** the set of **responsabilities** (= objects), to **encapsulate** and to **interact** them in a **loosely coupled** way.
