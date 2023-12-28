---
title: BindingListView - The DataView equivalent for custom collections
date: 2006-04-24
---

[BindingListView](http://www.gotdotnet.com/workspaces/workspace.aspx?id=ccbb6b50-6c55-4291-b191-f5c5f80ba122) is a project hosted on [GotDotNet](http://www.gotdotnet.com/) that gives you search, sorting and filtering capabilities to a plain [BindingList](http://msdn2.microsoft.com/en-US/library/ms132679(VS.80).aspx). For example if you have the following _Person_ entity:

```csharp
public class Person 
{ 
    string firstName = string.Empty; 
    int age = 0;

    public string FirstName 
    { 
        get { return firstName; } 
        set { firstName = value; } 
    }

    public int Age 
    { 
        get { return age; } 
        set { age = value; } 
    }

    public Person(string firstName, int age) 
    { 
        this.firstName = firstName; 
        this.age = age; } 
    }
}
```

And you want to have a collection of persons bind to a datagrid, you can simply write the following:

```csharp
BindingList<Person> persons = new BindingList<Person>(); 
persons.Add(new Person("Bill", 45)); 
persons.Add(new Person("Gert", 33)); 
persons.Add(new Person("Johan", 12)); 
persons.Add(new Person("An", 27));

personsGrid.DataSource = persons;
```

What if you need to do some filtering, or simply sorting on the datagrid? Therefore you would need to create a custom collection class that implements a bunch of interfaces for having sorting, filtering and searching capabilities.

The BindingListView class has all these functionalities built-in. You simply have to pass a list, and bind the BindingListView to the datagrid. The same way you would do with a [DataSet](http://msdn2.microsoft.com/en-us/library/system.data.dataset(VS.80).aspx) and [DataView](http://msdn2.microsoft.com/en-us/library/system.data.dataview(VS.80).aspx). This means:

```csharp
BindingListView<Person> personsView = new BindingListView<Person>(persons); 
personsGrid.DataSource = personsView;
```

Sorting on a `BindingListView` is done through the `Sort` property, the same as on a DataView. For example:

```csharp
personsView.Sort = "FirstName";
```

Filtering is done through the `Filter` property and uses anonymous delegates. So for example to filter all persons that are less than 30, you can write:

```csharp
personsView.Filter = BindingListView<Person>.CreateItemFilter(
    new Predicate<Person>(delegate(Person person) 
        {
            return (person.Age < 30); 
        } 
    ));
```

You can also merge multiple sources to one view (functionality that the DataView doesn't support) through the `AggregatedBindingListView`.
