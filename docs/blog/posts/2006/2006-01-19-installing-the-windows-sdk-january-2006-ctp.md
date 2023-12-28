---
title: Installing the Windows SDK January 2006 CTP
date: 2006-01-19
---

The [Windows SDK - Janary 2006 CTP](http://www.microsoft.com/downloads/details.aspx?FamilyId=64750EEF-D4A7-4CC8-92F2-9A201268A231&displaylang=en) is available for download and can be used for developing WinFX applications (WWF, WPF & WCF). [This](http://msdn.microsoft.com/windowsvista/getthebeta/default.aspx) page give you the several components that are needed for developing WinFX applications, these are:

- [WinFX RTC](http://www.microsoft.com/downloads/details.aspx?FamilyId=61DD9CA7-1668-42E4-BD37-03716DD83E53&displaylang=en)
- Visual Studio 2005 or [Visual Studio 2005 Express](http://msdn.microsoft.com/vstudio/express/default.aspx)
- [Windows SDK](http://www.microsoft.com/downloads/details.aspx?FamilyId=64750EEF-D4A7-4CC8-92F2-9A201268A231&displaylang=en)
- \[OPTIONAL\] [Visual Studio 2005 Extensions for WinFX](http://www.microsoft.com/downloads/details.aspx?FamilyId=5A0AE4CD-DC79-4B12-8A05-B6195F89FFA2&displaylang=en)
- \[OPTIONAL\] [Visual Studio 2005 Extensions for Windows Workflow Foundation](http://www.microsoft.com/downloads/details.aspx?FamilyId=A2151993-991D-4F58-A707-5883FF4C1DC2&displaylang=en)

When I tried to install the SDK, I received the message that the user has cancelled the installation. In the config file I had the following statements:

```
0:03:18 vrijdag 20 januari 2006: [SDKSetup:Error] Config_Products_Configure: Configuration of Product Microsoft .NET Compact Framework 2.0 (failed): User cancelled installation. 
0:03:18 vrijdag 20 januari 2006: [SDKSetup:Info] Config_Products_Configure: End configuration of product: Microsoft .NET Compact Framework 2.
0 0:03:18 vrijdag 20 januari 2006: [SDKSetup:Info] Config_Products_Install: End installation of product: Microsoft .NET Compact Framework 2.0 
0:03:18 vrijdag 20 januari 2006: [SDKSetup:Error] Config_Products_Install: Windows SDK Setup (failed): Installation of the "Microsoft .NET Compact Framework 2.0" product has reported the following error: User cancelled installation.
```

The solution was to simply remove the `Microsoft .NET Compact Framework 2.0` from the `Add/Remove Programs` in the control panel. After that the installation was successfull.
