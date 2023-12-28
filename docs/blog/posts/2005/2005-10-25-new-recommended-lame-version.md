---
title: New recommended LAME version
date: 2005-10-25
---

[LAME](http://lame.sourceforge.net/) is a very popular LGPL MP3 encoder. For a long time LAME version 3.90.X was recommended, now version [3.97b](http://www.hydrogenaudio.org/forums/index.php?showtopic=37574) has been released. This version uses the `-V` setting, with a value from 0 (highest) till 9 (lowest) quality in [VBR](http://en.wikipedia.org/wiki/VBR). More details about these settings can be found [here](http://www.hydrogenaudio.org/forums/index.php?showtopic=28124).

Instead of lossy compressions like MP3, there are also losless codecs like [FLAC](http://flac.sourceforge.net/) (**F**ree **L**osless **A**udio **C**oded). No quality is lost, but the file size is much bigger. Here are some results in applying the above settings on a regular audio cd:

{{ read_table('./lame.csv', sep = ';') }}

You can assume that with the settings used here you cannot distinguish the mp3 from the original cd. A very good resource about audio, codecs and tests is [Hydrogenaudio](http://www.hydrogenaudio.org). This [graph](http://wiki.hydrogenaudio.org/index.php?title=Image:Lame-chart-2.png) gives a nice relationship between the file size and audio quality for the LAME encoder. Between `V0` and `CBR320` setting, you see the file size increases by 50%, whereas the quality does not increase as much as that.