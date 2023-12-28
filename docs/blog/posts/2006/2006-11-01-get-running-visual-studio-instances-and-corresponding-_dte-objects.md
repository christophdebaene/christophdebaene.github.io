---
title: Get running Visual Studio instances and corresponding _DTE objects
date: 2006-11-01
---

I am currently building software factories and I needed a way to have a list of running Visual Studio instances and the corresponding [EnvDTE.\_DTE](http://msdn2.microsoft.com/en-us/library/envdte._dte.aspx) object to manipulate the solution. Windows internally keeps a list of COM objects that are currently running, called the Running Object Table (ROT). VS .NET 2005 for example, register itself in the ROT as `!VisualStudio.DTE.8.0:pid` where `pid` is the process id of the corresponding VS 2005 instance.

In .NET 1.1 you would use the the following [UCOMIRunningObjectTable](http://UCOMIRunningObjectTable), [UCOMIBindCtx](http://msdn2.microsoft.com/en-us/library/system.runtime.interopservices.ucomibindctx.aspx) for enumerating the ROT. In .NET 2.0 these interfaces are obsolete and are replaced by [IRunningObjectTable](http://msdn2.microsoft.com/en-US/library/system.runtime.interopservices.ucomirunningobjecttable.aspx) and [BIND\_OPTS](http://msdn2.microsoft.com/en-us/library/system.runtime.interopservices.comtypes.bind_opts.aspx) respectively. Note that the same code can be used for getting other instances like MS Word, IE, etc.

```csharp
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Runtime.InteropServices.ComTypes;
using EnvDTE;
 
public static class DTEHelper
{
    const uint S_OK = 0;
 
    [DllImport("ole32.dll")]
    public static extern uint GetRunningObjectTable(uint reserved, out IRunningObjectTable ROT);
     
    [DllImport("ole32.dll")]
    public static extern uint CreateBindCtx(uint reserved, out IBindCtx ctx);
 
    static IDictionary<string, object> GetRunningObjectTable()
    {                        
        IDictionary<string, object> rotTable = new Dictionary<string, object>();
         
        IRunningObjectTable runningObjectTable;            
        IEnumMoniker monikerEnumerator;
        IMoniker[] monikers = new IMoniker[1];
 
        GetRunningObjectTable(0, out runningObjectTable);
        runningObjectTable.EnumRunning(out monikerEnumerator);
        monikerEnumerator.Reset();
 
        IntPtr numberFetched = IntPtr.Zero;
         
        while (monikerEnumerator.Next(1, monikers, numberFetched) == 0)
        {
            IBindCtx ctx;
            CreateBindCtx(0, out ctx);
 
            string runningObjectName;
            monikers[0].GetDisplayName(ctx, null, out runningObjectName);
            Marshal.ReleaseComObject(ctx);
 
            object runningObjectValue;
            runningObjectTable.GetObject(monikers[0], out runningObjectValue);
             
            if (!rotTable.ContainsKey(runningObjectName))
                rotTable.Add(runningObjectName, runningObjectValue);
        }
 
        return rotTable;
    }
 
    public static IDictionary<string, _DTE> GetRunningVSIDETable()
    {            
        IDictionary<string, object> runningObjects = GetRunningObjectTable();
        IDictionary<string, _DTE> runningDTEObjects = new Dictionary<string, _DTE>();            
 
        foreach (string objectName in runningObjects.Keys)
        {
            if (!objectName.StartsWith("!VisualStudio.DTE"))
                continue;
 
            _DTE ide = runningObjects[objectName] as _DTE;
            if (ide == null)
                continue;
             
            runningDTEObjects.Add(objectName, ide);
        }
 
        return runningDTEObjects;
    }        
}
```
