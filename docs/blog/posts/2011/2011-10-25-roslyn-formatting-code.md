---
title: Roslyn - Formatting Code
date: 2011-10-25
tags: 
  - code-generation
  - roslyn
---

[Roslyn CTP](http://msdn.microsoft.com/en-us/roslyn) is the implementation of a 'compiler-as-a-service' for C# and VB.Net. Generally compilers are black boxes, the Roslyn project changes that by opening up APIs that you can use for code related tasks in your tools and applications.

In this post we are investigating [source code formatting](http://en.wikipedia.org/wiki/Prettyprint). Inside my projects I use as much as possible code generation and whether it is coming from T4 templates or some other mechanism, there is usually the need to format your code in a consistent way.

Inside Roslyn we can use the _SyntaxTree_ class that resides in the `Roslyn.Compilers.CSharp` namespace to parse a text file (that contains C# of VB code). And after we can use the `Format` extension method that resides in the `CompilationUnitSyntax` class to reformat your code.

```csharp
var code = File.ReadAllText("Sample.cs");
var tree = SyntaxTree.ParseCompilationUnit(code);
var root = (CompilationUnitSyntax)tree.Root;
var formattedCode = root.Format().GetFullText();
```

Take for example the code fragment below which is totally unformatted.

```csharp title="sample.cs"
namespace Domain
{
using System;
using System
.Collections
.Generic;
using System.ComponentModel.DataAnnotations;
 
public class BankAccount
:Entity,
IValidatableObject
{
public BankAccountNumber BankAccountNumber {
get;
set; }
 
public string Iban
{
get
{
return string
.Format("ES{0} {1} {2} {0}{3}",
this.BankAccountNumber.CheckDigits,
this.BankAccountNumber
.NationalBankCode,
this.BankAccountNumber
.OfficeNumber,
this.BankAccountNumber
.AccountNumber);
}
set {
 
}
}
 
public decimal Balance { get;
private set; }
 
public virtual ICollection
BankAccountActivity
{
get
{
if (_bankAccountActivity
== null)
_bankAccountActivity =
new HashSet();
 
return _bankAccountActivity;
}
set
{
_bankAccountActivity =
new HashSet(value);
}
}
}
}
```

When passing the code fragment through the `SyntaxTree` and calling the `Format` extension method you get the following result which is formatted correctly. 

```csharp
namespace Domain
{
   using System;
   using System.Collections.Generic;
   using System.ComponentModel.DataAnnotations;
 
   public class BankAccount : Entity, IValidatableObject
   {
      public BankAccountNumber BankAccountNumber
      {   
         get;
         set;
      }
 
      public string Iban
      {
         get
         {
            return string.Format("ES{0} {1} {2} {0}{3}", this.BankAccountNumber.CheckDigits, this.BankAccountNumber.NationalBankCode, this.BankAccountNumber.OfficeNumber, this.BankAccountNumber.AccountNumber);
         }
         set
         {
         }
      }
 
      public decimal Balance
      {
         get;
         private set;
      }
 
      public virtual ICollection BankAccountActivity
      {
         get
         {
            if (_bankAccountActivity == null)
               _bankAccountActivity = new HashSet();
            return _bankAccountActivity;
         }
         set
         {
            _bankAccountActivity = new HashSet(value);
         }
     }   
   }
}
```

Note that when you are using for example lambda expressions or delegates that the formatter will add unnecessary newlines and whitespaces. Take for example the following code fragment after calling the `Format` method.

```csharp
public void SomeMethod()
{
   this.Click += (s, e) =>
   {
      MessageBox.Show(((MouseEventArgs)e).Location.ToString());
   }
   ;
   treeView.AfterExpand += new TreeViewEventHandler(delegate (object o, TreeViewEventArgs t)
   {
      t.Node.ImageIndex = (int)FolderIconEnum.open;
      t.Node.SelectedImageIndex = (int)FolderIconEnum.open;
   }
);
}
```

Thankfully we have everything in control through the APIs and we can rewrite the expression (like the _Format_ extension method is doing).

For that we need to create a class inheriting from _SyntaxRewriter_ that resides in the `Roslyn.Compilers.CSharp` namespace and implements the [Visitor pattern](http://en.wikipedia.org/wiki/Visitor_pattern).

```csharp
public class CodeBeautifier: SyntaxRewriter
{
   protected override SyntaxToken VisitToken(SyntaxToken token)
   {
      switch (token.Kind)
      {
         case SyntaxKind.SemicolonToken:
 
         if (token.GetPreviousToken().Kind == SyntaxKind.CloseBraceToken ||
            token.GetPreviousToken().Kind == SyntaxKind.CloseParenToken)
         {
            return token
            .WithLeadingTrivia()
            .WithTrailingTrivia(Syntax.ElasticCarriageReturnLineFeed);
         }
 
         break;
 
      case SyntaxKind.CloseBraceToken:
 
         if (token.GetNextToken().Kind == SyntaxKind.CloseParenToken ||
            token.GetNextToken().Kind == SyntaxKind.SemicolonToken)
         {
             return token
             .WithTrailingTrivia();
         }
 
      break;
 
      case SyntaxKind.CloseParenToken:
 
         if (token.GetPreviousToken().Kind == SyntaxKind.CloseBraceToken)
         {
            return token
            .WithLeadingTrivia();
         }
 
      break;
   }
 
    return token;
}
```

Note that I am visiting the syntax tokens, these are the terminals of the language grammar (representing the smallest syntactic fragments) and investigating the current kind of token with the next or previous kind of token. Syntax Trivia represents the parts such as whitespace, comments and preprocessor directives. Inside the `VisitToken` method I am replacing the syntax trivia parts.

To use the `CodeBeautifier` class you need to simply create an instance of it and using the `Visit` method to pass your node.

```csharp
var code = File.ReadAllText("Sample.cs");
var tree = SyntaxTree.ParseCompilationUnit(code);
var root = (CompilationUnitSyntax)tree.Root;
var formattedCode = new CodeBeautifier().Visit(root.Format()).GetFullText();
```

After the syntax rewriting you will see that the code now looks like below

```csharp
public void SomeMethod()
{
this.Click += (s, e) =>
{
MessageBox.Show(((MouseEventArgs)e).Location.ToString());
};
treeView.AfterExpand += new TreeViewEventHandler(delegate (object o, TreeViewEventArgs t)
{
t.Node.ImageIndex = (int)FolderIconEnum.open;
t.Node.SelectedImageIndex = (int)FolderIconEnum.open;
});
}
```
