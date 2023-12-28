---
title: Use the Graphics Processing Unit (GPU) inside your application
date: 2006-03-08
---

Modern [GPUs](http://en.wikipedia.org/wiki/Graphics_processing_unit) are increasing in programmability and these chips can do more than just graphical computations. They can now be used as a [coprocessor](http://en.wikipedia.org/wiki/Coprocessor), and they can be integrated for a set of tasks. [GPGPU](http://www.gpgpu.org/) (General-Purpose compuation on GPUs) is such an initiative that contains a catalog where the GPU can be used for general-purpose computation.

The big challenge, is to translate the everyday applications to two-dimensional graphic functions, like texture mapping. In other words: Pretend that everything is a game ([source](http://www.tgdaily.com/2005/06/30/graphics_processors_supercharge_everyday_apps/print.html)).

As an example in this [article](http://www.tgdaily.com/2005/06/30/graphics_processors_supercharge_everyday_apps/print.html) and [results](http://www.cs.unc.edu/~geom/GPUSORT/results.html), a **quicksort** algorithm of **18 million records** in **Visual C++** took **21 seconds**, while the **GPU** took **2 seconds**! What are the results for a [Quad SLI](http://www.pcper.com/article.php?aid=195) setup?

[Microsoft research](http://research.microsoft.com) is apparently working on a system that simplifies the programming of GPU to general-purpose tasks, it's called [Accelerator](http://research.microsoft.com/research/pubs/view.aspx?type=technical%20report&id=1040) (simplified programming of graphics processing units for general-purpose uses via data-parallelism).
