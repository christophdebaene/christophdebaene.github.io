---
title: Declarative versus Imperative programming
date: 2004-07-08
tags: 
  - patterns-practices
---

Marc Clifton added a nice [introduction](http://www.myxaml.com/wiki/ow.asp?DeclarativeVsImperativeProgramming) to declarative versus imperative programming.

**Imperative programming** ([source](http://en.wikipedia.org/wiki/Imperative_programming)) Describes computation in terms of a program state and statements that change the program state. **Declarative programming** ([source](http://en.wikipedia.org/wiki/Declarative_programming)) Gives the computer a list of instructions to execute in a particular order, declarative programming describes to the computer a set of conditions and lets the computer figure out how to satisfy them

Like Marc Clifton describes in the article, we are already using declarative techniques like resource files, config files, etc. Many libraries like [FABRIQ](http://www.gotdotnet.com/community/workspaces/workspace.aspx?ID=B4FCF02F-3E71-4A15-A305-F0511240EEC1), [User Interface Process Application Block for .NET](http://www.gotdotnet.com/Community/Workspaces/Workspace.aspx?id=0af2b0ef-b049-401a-a2f2-f55a070c1572), [log4net](http://logging.apache.org/log4net/), etc. uses a XML file to describe a sort of workflow in a declarative way.

Therefore I try to use it where possible on every project. Certainly when it comes to making forms. I just hate the generated code inside the InitializeComponent of a form/control, it is more elegant, readable and maintainable by describing it in a declarative way. For example a menubar would look like this: 

``` xml
 <MENUBARITEM Text="Edit"> 
 <MENUITEMS> 
  <MENUBUTTONITEM Text="Cut" /> 
  <MENUBUTTONITEM Text="Copy" /> 
  <MENUBUTTONITEM Text="Paste" /> 
  ... 
```

instead of a bunch of statements that are needed for declaration, initialisation, setting properties and to composite the controls together. In this way it is also very hard to see the relationships between the objects!
