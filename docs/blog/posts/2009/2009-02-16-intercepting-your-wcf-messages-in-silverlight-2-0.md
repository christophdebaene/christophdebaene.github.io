---
title: Intercepting your WCF messages in Silverlight 2.0
date: 2009-02-16
tags: 
  - silverlight
---

In many applications you want to intercept WCF messages for doing stuff like, logging, tracing, passing a user context, language identifier, etc. Typically this can be done through the [IClientMessageInspector](http://msdn.microsoft.com/en-us/library/system.servicemodel.dispatcher.iclientmessageinspector.aspx) that resides in the [System.ServiceModel.Dispatcher](http://msdn.microsoft.com/en-us/library/system.servicemodel.dispatcher.aspx). Unfortunately this interface doesn’t exist in Silverlight 2.0.

Thankfully WCF is very extensible, and there is a sample [Silverlight Web Services Samples](http://code.msdn.microsoft.com/silverlightws) on [MSDN Code Gallery](http://code.msdn.microsoft.com/) that shows how you can still use the [IClientMessageInspector](http://msdn.microsoft.com/en-us/library/system.servicemodel.dispatcher.iclientmessageinspector.aspx) by implementing a custom binding. You simple use the `BasicHttpMessageInspectorBinding` that receives in the constructor an instance of type [IClientMessageInspector](http://msdn.microsoft.com/en-us/library/system.servicemodel.dispatcher.iclientmessageinspector.aspx). For example:

```csharp
BasicHttpMessageInspectorBinding binding = new BasicHttpMessageInspectorBinding(new TraceInspector());
```

Note that the sample only allows you to pass one inspector, if you need to pass several inspectors you can use the [decorator](http://en.wikipedia.org/wiki/Decorator_pattern) pattern to pass multiple.

```csharp
public class ClientMessageInspectorDecorator : IClientMessageInspector
{
    IClientMessageInspector[] inspectors;
 
    public ClientMessageInspectorDecorator(params IClientMessageInspector[] inspectors)
    {
        this.inspectors = inspectors;
    }
 
    public object BeforeSendRequest(ref Message request, IClientChannel channel)
    {
        foreach (var item in inspectors)
        {
            item.BeforeSendRequest(ref request, channel);
        }
 
        return null;
    }
 
    public void AfterReceiveReply(ref Message reply, object correlationState)
    {
        foreach (var item in inspectors)
        {
            item.AfterReceiveReply(ref reply, correlationState);
        }
    }
}
```
