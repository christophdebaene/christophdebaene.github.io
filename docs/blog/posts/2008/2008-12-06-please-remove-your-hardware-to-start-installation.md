---
title: Please remove your hardware to start installation!
date: 2008-12-06
tags: 
  - hardware
---

Today I tried out installing Windows Server 2008 on my [cube](http://www.christophdebaene.com/blog/2005/10/19/cube-server/) server. When I reached the dialog to choose on which partition I want to install to, I always received the following warning _"windows is unable to find a system volume that meets its criteria for installation"._ The partition had enough room space (40GB), formatted in NTFS, marked as primary and boot, etc.

After some research I ended up to the following [article (KB927520)](http://support.microsoft.com/kb/927520). I tried a lot in the BIOS and partition settings but nothing helped. On the [TechNet forum](http://forums.microsoft.com/TechNet/default.aspx) I saw the following [thread](http://forums.microsoft.com/technet/showpost.aspx?postid=712110&siteid=17&sb=0&d=1&at=7&ft=11&tf=0&pageid=0) with the same error and most of them solved the problem by physically unplugging all additional drives! On my cube I have an [Areca](http://www.areca.com.tw/) RAID controller and a separated drive for booting the system. Unplugging my raid controller was the solution, duh!
