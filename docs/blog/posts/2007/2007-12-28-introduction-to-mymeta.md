---
title: Introduction to MyMeta
date: 2007-12-28
tags: 
  - components
---

MyMeta is an open-source API that allows you to get meta-data from your database. MyMeta is part of [MyGeneration](http://www.mygenerationsoftware.com), a free code generator hosted on [Sourceforge](http://sourceforge.net). The MyMeta API can be downloaded separately [here](http://sourceforge.net/project/showfiles.php?group_id=198893) (filename is called `mymeta_installer.exe`).

MyMeta supports the following databases. Note that the API is extensible and that you can provide your own plug-ins

* Advantage
* Delimited Text
* Firebird
* IBM DB2
* IBM iSeries (AS400)
* Interbase
* Microsoft Access
* Microsoft SQL CE
* Microsoft SQL Server
* MySQL
* MySQL2
* Oracle
* Pervasive
* PostgreSQL
* PostgreSQL 8+
* SQLite
* VistaDB
* Xsd3b (xml,xsd,uml,er)
   
Below you find a code snippet that will iterate, for a SQLite database, all tables, columns and indexes.

```csharp
string connectionstring = @"data source=SQLiteDatabase.DB";
 
MyMeta.dbRoot myMeta = new MyMeta.dbRoot();
myMeta.Connect(MyMeta.dbDriver.SQLite, connectionstring);
 
IDatabase db = myMeta.DefaultDatabase;
 
foreach (MyMeta.ITable table in db.Tables)
{
    Console.WriteLine("{0} ({1})", table.Name, table.Columns.Count);
    Console.WriteLine("tCOLUMNS");
 
    foreach (MyMeta.IColumn column in table.Columns)
    {
        Console.WriteLine("tt{0} ({1}), Nullable:{2}",
                 column.Name, column.DataTypeName, column.IsNullable);
    }
 
    Console.WriteLine("tINDEXES");
 
    foreach (MyMeta.IIndex index in table.Indexes)
    {
        Console.WriteLine("tt{0}, Unique:{1}", index.Name, index.Unique);
    }
}
```

MyMeta can map database types to specific ADO.NET data types and language types (C#, VB.NET, etc.). MyMeta has a set of XML files (included in the setup) that contains these mappings. Namely the `Languages.xml` and `DbTargets.xml`. Below you find a snippet of the two XML files:

```xml title="Languages.xml"
<Languages>
    ...
    <Language From="SQL" To="C#">
        <Type From="bigint" To="long" />
        <Type From="binary" To="object" />
        <Type From="bit" To="bool" />
        <Type From="char" To="string" />
        <Type From="datetime" To="DateTime" />
        <Type From="decimal" To="decimal" />
        <Type From="float" To="double" />
        <Type From="image" To="byte[]" />
        <Type From="int" To="int" />
        <Type From="money" To="decimal" />
        <Type From="nchar" To="string" />
        <Type From="ntext" To="string" />
        <Type From="numeric" To="decimal" />
        <Type From="nvarchar" To="string" />
        <Type From="real" To="float" />
        <Type From="smalldatetime" To="DateTime" />
        <Type From="smallint" To="short" />
        <Type From="smallmoney" To="decimal" />
        <Type From="text" To="string" />
        <Type From="timestamp" To="byte[]" />
        <Type From="tinyint" To="byte" />
        <Type From="uniqueidentifier" To="Guid" />
        <Type From="varbinary" To="byte[]" />
        <Type From="varchar" To="string" />
        <Type From="xml" To="string" />
        <Type From="sql_variant" To="object" />
    </Language>
    ...
    <Language From="SQLITE" To="C# (SQLite v3.x)">
        <Type From="CHAR" To="string" />
        <Type From="DATETIME" To="DateTime" />
        <Type From="DATE" To="DateTime" />
        <Type From="TIMESTAMP" To="DateTime" />
        <Type From="TIME" To="TimeSpan" />
        <Type From="DECIMAL" To="decimal" />
        <Type From="VARCHAR" To="string" />
        <Type From="NVARCHAR" To="string" />
        <Type From="TEXT" To="string" />
        <Type From="INTEGER" To="long" />
        <Type From="INT" To="long" />
        <Type From="FLOAT" To="float" />
        <Type From="BOOLEAN" To="bool" />
        <Type From="CLOB" To="string" />
        <Type From="BLOB" To="byte[]" />
        <Type From="NUMERIC" To="decimal" />
        <Type From="VARYINGCHARACTER" To="string" />
        <Type From="NATIONALVARYINGCHARACTER" To="string" />
    </Language>
    ...
</Languages>
```

```xml title="DBTargets.xml"
<DbTargets>
    ...
    <DbTarget From="SQL" To="SqlClient">
        <Type From="bigint" To="SqlDbType.BigInt" />
        <Type From="binary" To="SqlDbType.Binary" />
        <Type From="bit" To="SqlDbType.Bit" />
        <Type From="char" To="SqlDbType.Char" />
        <Type From="datetime" To="SqlDbType.DateTime" />
        <Type From="decimal" To="SqlDbType.Decimal" />
        <Type From="float" To="SqlDbType.Float" />
        <Type From="image" To="SqlDbType.Image" />
        <Type From="int" To="SqlDbType.Int" />
        <Type From="money" To="SqlDbType.Money" />
        <Type From="nchar" To="SqlDbType.NChar" />
        <Type From="ntext" To="SqlDbType.NText" />
        <Type From="numeric" To="SqlDbType.Decimal" />
        <Type From="nvarchar" To="SqlDbType.NVarChar" />
        <Type From="real" To="SqlDbType.Real" />
        <Type From="smalldatetime" To="SqlDbType.SmallDateTime" />
        <Type From="smallint" To="SqlDbType.SmallInt" />
        <Type From="smallmoney" To="SqlDbType.SmallMoney" />
        <Type From="text" To="SqlDbType.Text" />
        <Type From="timestamp" To="SqlDbType.Timestamp" />
        <Type From="tinyint" To="SqlDbType.TinyInt" />
        <Type From="uniqueidentifier" To="SqlDbType.UniqueIdentifier" />
        <Type From="varbinary" To="SqlDbType.VarBinary" />
        <Type From="varchar" To="SqlDbType.VarChar" />
        <Type From="xml" To="SqlDbType.Xml" />
        <Type From="sql_variant" To="SqlDbType.Variant" />
    </DbTarget>
    ...
    <DbTarget From="SQLITE" To="SQLite.NET v3.x">
        <Type From="CHAR" To="DbType.String" />
        <Type From="DATETIME" To="DbType.DateTime" />
        <Type From="DATE" To="DbType.DateTime" />
        <Type From="TIMESTAMP" To="DbType.DateTime" />
        <Type From="TIME" To="DbType.Time" />
        <Type From="DECIMAL" To="DbType.Decimal" />
        <Type From="VARCHAR" To="DbType.String" />
        <Type From="NVARCHAR" To="DbType.String" />
        <Type From="TEXT" To="DbType.String" />
        <Type From="INTEGER" To="DbType.Int64" />
        <Type From="INT" To="DbType.Int32" />
        <Type From="FLOAT" To="DbType.Single" />
        <Type From="BOOLEAN" To="DbType.Boolean" />
        <Type From="CLOB" To="DbType.String" />
        <Type From="BLOB" To="DbType.Binary" />
        <Type From="NUMERIC" To="DbType.Decimal" />
        <Type From="VARYINGCHARACTER" To="DbType.String" />
        <Type From="NATIONALVARYINGCHARACTER" To="DbType.String" />
    </DbTarget>
    ...
</DbTargets>
```

The xml files can be loaded by setting the `LanguageMappingFilename` and `DbTargetMappingFilename`. Setting the right target can be done by the properties `Language` and `DbTarget`.

```csharp
string connectionstring = @"data source=SQLiteDatabase.DB";
 
MyMeta.dbRoot myMeta = new MyMeta.dbRoot();
myMeta.Connect(MyMeta.dbDriver.SQLite, connectionstring);
 
myMeta.LanguageMappingFileName = @"C:Program FilesMyGenerationsSettingsLanguages.xml";
myMeta.DbTargetMappingFileName = @"C:Program FilesMyGenerationsSettingsDbTargets.xml";
 
myMeta.Language = "C# (SQLite v3.x)";
myMeta.DbTarget = "SQLite.NET v3.x";
 
IDatabase db = myMeta.DefaultDatabase;
 
foreach (MyMeta.ITable table in db.Tables)
{
    Console.WriteLine("{0} ({1})", table.Name, table.Columns.Count);
    Console.WriteLine("tCOLUMNS");
 
    foreach (MyMeta.IColumn column in table.Columns)
    {
        Console.WriteLine("tt{0} ({1}), DBTargetType:{2}, LanguageType:{3}",
            column.Name, column.DataTypeName, column.DbTargetType, column.LanguageType);
    }
}
```

The mapped types can be found in the properties `DbTargetType` and `LanguageType` on the `IColumn` interface.
