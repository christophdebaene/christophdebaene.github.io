---
title: Customize code generation in .NET RIA Services
date: 2009-03-31
tags: 
  - services
---

!!! quote

    Microsoft .NET RIA Services simplifies the traditional n-tier application pattern by bringing together the ASP.NET and Silverlight platforms. RIA Services provides a pattern to write application logic that runs on the mid-tier and controls access to data for queries, changes and custom operations. It also provides end-to-end support for common tasks such as data validation, authentication and roles by integrating with Silverlight components on the client and ASP.NET on the mid-tier.

To get started with .NET RIA Services you need Visual Studio 2008 SP1 and you need to install the following packages

- Microsoft Silverlight 3 Tools Beta 1 for Visual Studio 2008 SP1
- Microsoft .NET RIA Services March '09 Preview

On the download page of .NET RIA Services there is a great PDF document (riaservicesoverviewpreview.pdf) that gives you a step-by-step guide.

Every time you compile a solution with .NET RIA Services, an MSBuild task is executed that generates code in your Silverlight project from the domain services (DomainService class) that reside in your ASP.NET server. After some investigation through reflector, you can actually modify or extend the code generation using [CodeDom](http://msdn.microsoft.com/en-us/library/y2k85ax6.aspx)! For this you need to add an attribute called DomainIdentifier where you specify a type that inherits from CodeProcessor. Both classes reside in the `System.Web.Ria.Data namespace`.

```csharp
[EnableClientAccess()]
[DomainIdentifier("Comment", CodeProcessor = typeof(CommentCodeProcessor))]
public class CityService : DomainService
{
   //...
}
```

In this example, we simply add some documentation in the summary tag.

```csharp
public class CommentCodeProcessor : CodeProcessor
{
    public CommentCodeProcessor(CodeDomProvider codeDomProvider)
        : base(codeDomProvider)
    {
    }
 
    public override void ProcessGeneratedCode(
        DomainServiceDescription domainServiceDescription,
        System.CodeDom.CodeCompileUnit codeCompileUnit,
        IDictionary<Type, System.CodeDom.CodeTypeDeclaration> typeMapping)
    {
        Type domainServiceType = domainServiceDescription.DomainServiceType;
        CodeTypeDeclaration declaration = typeMapping[domainServiceType];
 
        declaration.Comments.Add(new CodeCommentStatement("<summary>", true));
 
        foreach (var entityType in domainServiceDescription.EntityTypes)
        {
            declaration.Comments.Add(
                new CodeCommentStatement(
                    string.Format("Entity Type: {0}", entityType.FullName), true));
        }
 
        foreach (var operationEntry in domainServiceDescription.DomainOperationEntries)
        {
            declaration.Comments.Add(
                new CodeCommentStatement(
                    string.Format("Operation Entry: {0}", operationEntry.MethodInfo.Name), true));
        }
 
        declaration.Comments.Add(new CodeCommentStatement("</summary>", true));
    }
}
```

Below you find a sample of the generated file using the `CommentCodeProcessor`

```csharp
/// <summary>
/// Entity Type: SilverlightApplication.Web.DataModels.City
/// Operation Entry: GetCities
/// Operation Entry: ReturnAllCities
/// </summary>
[DomainIdentifier("Comment")]
public sealed partial class CityContext : DomainContext
{
   //...
}
```