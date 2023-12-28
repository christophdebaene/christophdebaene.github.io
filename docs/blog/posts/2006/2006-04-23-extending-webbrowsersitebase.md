---
title: Extending WebBrowserSiteBase?
date: 2006-04-23
---

One of the ways for extending the [WebBrowser](http://msdn2.microsoft.com/en-US/library/system.windows.forms.webbrowser(VS.80).aspx) 2.0 control is to inherit from WebBrowserSiteBase. According to the documentation, you have to override the method [CreateWebBrowserSiteBase](http://msdn2.microsoft.com/en-US/library/system.windows.forms.webbrowser.createwebbrowsersitebase(VS.80).aspx) and return your specific implementation of WebBrowserSiteBase.

Everything is there to plug-in your implementation of WebBrowserSiteBase, but the problem is that the constructor of WebBrowserSiteBase is marked as _internal_, and so there is no way to inherit from. I am pretty sure that it was possible with the beta release of .NET 2.0, but for some reason they marked it as internal in the RTM version. This means that implementing some interfaces that are described [here](http://msdn.microsoft.com/library/default.asp?url=/workshop/browser/hosting/wbcustomization.asp) are not possible.

I am planning to release a .NET 2005 version of my [IStaySharp.WebBrowser](http://www.istaysharp.net/index.php?title=IStaySharp.WebBrowser) project. More info coming soon.
