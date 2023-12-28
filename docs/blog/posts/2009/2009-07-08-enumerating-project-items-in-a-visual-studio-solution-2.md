---
title: Enumerating project items in a Visual Studio solution
date: 2009-07-08
tags: 
  - visual-studio
---

Often you have the need to iterate through a collection and most of the time the iteration logic is weaved with the action that need to be done. This is because we are used to program in an [imperative](http://en.wikipedia.org/wiki/Imperative_programming) approach. In some scenarios it's better to use a [functional](http://msdn.microsoft.com/en-us/library/bb669144.aspx) approach and let other functions decide which action need to be applied. This way we can for example reuse our iteration logic.

Below is an iterator that starts from a solution or project and iterates through all project items inside the solution. 

```csharp
public class ProjectItemIterator : IEnumerable<EnvDTE.ProjectItem>
{
    IEnumerable<EnvDTE.Project> projects;
     
    public ProjectItemIterator(EnvDTE.Solution solution)
    {
        if (solution == null)
            throw new ArgumentNullException("solution");
 
        projects = solution.Projects.Cast<EnvDTE.Project>();
    }
     
    public ProjectItemIterator(IEnumerable<EnvDTE.Project> projects)
    {
        if (projects == null)
            throw new ArgumentNullException("projects");
 
        this.projects = projects;
    }
 
    public IEnumerator<EnvDTE.ProjectItem> GetEnumerator()
    {
        foreach (EnvDTE.Project currentProject in projects)
            foreach (var currentProjectItem in Enumerate(currentProject.ProjectItems))
                yield return currentProjectItem;
    }
 
    IEnumerable<EnvDTE.ProjectItem> Enumerate(EnvDTE.ProjectItems projectItems)
    {
        foreach (EnvDTE.ProjectItem item in projectItems)
        {
            yield return item;
 
            if (item.SubProject != null)
            {
                foreach (EnvDTE.ProjectItem childItem in Enumerate(item.SubProject.ProjectItems))
                    yield return childItem;
            }
            else
            {
                foreach (EnvDTE.ProjectItem childItem in Enumerate(item.ProjectItems))
                    yield return childItem;
            }
        }
    }
 
    System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }
}
```
