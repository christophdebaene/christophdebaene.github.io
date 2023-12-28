---
title: 0xc0000225 error when installing Win2008R2x64 on VirtualBox
date: 2011-10-04
---

When trying to setup and install Windows Server 2008 R2 x64 on [VirtualBox](https://www.virtualbox.org/) you may encounter the following error

![VirtualBoxWin2008R2X64](images/virtualboxwin2008r2x64.jpg)

It turns out you need to enable the [IO APIC](http://en.wikipedia.org/wiki/Intel_APIC_Architecture) setting, like below

![VirtualBoxSettings](images/virtualboxsettings.jpg)
