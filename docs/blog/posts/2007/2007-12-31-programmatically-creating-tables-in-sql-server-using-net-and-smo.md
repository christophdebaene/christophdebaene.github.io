---
title: Programmatically creating tables in SQL Server using .NET and SMO
date: 2007-12-31
tags: 
  - sql-server
---

[SMO](http://msdn2.microsoft.com/en-us/library/ms162169.aspx) (SQL Server Management Objects) is a .NET based object library for programming all aspects of managing Microsoft SQL Server. Replication Management Objects (RMO) is another library that encapsulates SQL Server replication management.

SMO assemblies are shipped with SQL Server 2005 and can be used to connect with SQL Server 7, 2000 or 2005. The assemblies are located in the following folder `C:\Program Files\Microsoft SQL Server\90SDKAssemblies`.

- Microsoft.SqlServer.Smo.dll
- Microsoft.SqlServer.ConnectionInfo.dll
- Microsoft.SqlServer.SmoEnum.dll
- Microsoft.SqlServer.SqlEnum.dll

With SMO you can do all kind of management on a SQL Server, namely: tables, columns, indexes, stored procedures, service broker, backup and restore, managing users/roles and logins, scheduling, etc. [Here](http://msdn2.microsoft.com/en-us/library/ms162175.aspx) you can find some specific tasks that can be done with SMO.

Below you find an example how you can create a table with SMO:

```csharp
using System.Data.SqlClient;
using Microsoft.SqlServer.Management.Smo;
using Microsoft.SqlServer.Management.Common;
 
public class Sample
{
    public void Create(string connectionstring)
    { 
        SqlConnection connection = new SqlConnection(connectionstring);
        Server server = new Server(new ServerConnection(connection));
         
        Database database = server.Databases["MyDatabase"];
         
        // Create table, called Customer
        Table table = new Table(database, "Customer");
         
        // Add 'ID' column which is the primary key
        Column idColumn = new Column(table, "ID");
        idColumn.DataType = DataType.Int;
        idColumn.Identity = true;
        idColumn.IdentitySeed = 1;
        idColumn.IdentityIncrement = 1;
         
        // Create a primary key index
        Index index = new Index(table, string.Format("PK_{0}", table.Name));
        index.IndexKeyType = IndexKeyType.DriPrimaryKey;
        index.IndexedColumns.Add(new IndexedColumn(index, "ID"));
        table.Indexes.Add(index);                        
         
        // Add 'Name' column
        Column nameColumn = new Column(table, "Name");
        nameColumn.DataType = DataType.VarChar(50);
         
        // Add colums to table
        table.Columns.Add(idColumn);
        table.Columns.Add(nameColumn);
         
        table.Create();
    }
}
```
