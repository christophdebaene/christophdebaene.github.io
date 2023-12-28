---
title: WPF for data-driven applications?
date: 2009-01-07
tags: 
  - wpf
---

The last couple of days, I was converting my add-in visual studio called [Component Dropper](http://www.christophdebaene.com/blog/2008/03/04/component-dropper-v0-9-add-in-for-visual-studio/) to WPF. One thing I noticed, is that the text in my WPF application was blurry, certainly when the font is small. It is harder to read and very unpleasant to work with.

After some research, it appears to be a known problem. Check out the following threads, [How to turn off anti aliasing for small text?](http://social.msdn.microsoft.com/Forums/en-US/wpf/thread/1ad9a62a-d1a4-4ca2-a950-3b7bf5240de5/ "How to turn off anti aliasing for small text-") and [Blurry text in WPF – current status?](http://social.msdn.microsoft.com/Forums/en-US/wpf/thread/5289ee56-6d06-4f66-84f2-69865b6dc401/) and a very good [explanation](http://www.paulstovell.com/blog/wpf-why-is-my-text-so-blurry) about the problem.

It’s an issue that is already known for 2 years and there is still no solution for this particular problem. In my experience, enterprise applications are data-driven, which means there is a lot of text (= data) that need to be displayed typically in a grid (master-detail). WPF is really a great technology, but this is not a minor issue. I don’t think that your customers will be happy if they receive a new application that is hard to read.
