---
title: DeckWorkspace extension (CAB) – Prevent drawing controls until all controls are initialized
date: 2006-02-22
tags: 
  - components
---

[CAB](http://www.gotdotnet.com/codegallery/codegallery.aspx?id=22f72167-af95-44ce-a6ca-f2eafbf2653c) is an application block for building smart clients in .NET 2.0 and contains proven practices for building complex UI forms with so called SmartParts and Workspaces. The DeckWorkspace enables you to show and hide controls and SmartParts in an overlapped manner with no visible frame.

If you switch between controls, you will notice that the controls are painted while there are initializing. During the loading you will see that there is some overlapping and it doesn't give you a professional user experience.

![formloading](images/formloading.jpg)

Therefore I extended the DeckWorkspace, so that the the controls are only redrawed when they are initialized. This can be done through the [WM\_SETREDRAW](http://msdn.microsoft.com/library/default.asp?url=/library/en-us/gdi/pantdraw_3jxz.asp) message. Note that this technique can also be used for other workspaces.

```csharp
public class DeckWorkspaceEx: DeckWorkspace 
{ 
    int freezePainting = 0; 
    const int WM_SETREDRAW = 0xB;

    [DllImport("User32")] 
    static extern bool SendMessage(IntPtr hWnd, int msg, int wParam, int lParam);

    protected void FreezePaintingOn() 
    { 
        if (IsHandleCreated && this.Visible) 
        { 
            if (0 == freezePainting++) 
            { 
              SendMessage(Handle, WM_SETREDRAW, 0, 0); 
            } 
        } 
    }

    protected void FreezePaintingOff() 
    { 
        if (freezePainting != 0) 
        { 
            if (0 == --freezePainting) 
            { 
              SendMessage(Handle, WM_SETREDRAW, 1, 0); 
              Invalidate(true); 
            } 
        } 
    }

    protected override void OnActivate(Control smartPart) 
    { 
        FreezePaintingOn(); 
        
        try 
        { 
            base.OnActivate(smartPart); 
        } 
        finally 
        { 
            FreezePaintingOff(); 
        } 
    }

    protected override void OnClose(Control smartPart) 
    { 
        FreezePaintingOn(); 
        
        try 
        { 
            base.OnClose(smartPart); 
        } 
        finally 
        { 
            FreezePaintingOff(); 
        } 
    }

    protected override void OnHide(Control smartPart) 
    { 
        FreezePaintingOn(); 
        
        try 
        { 
            base.OnHide(smartPart); 
        } 
        finally 
        { 
            FreezePaintingOff(); 
        } 
    }

    protected override void OnShow(Control smartPart, SmartPartInfo smartPartInfo) 
    { 
        FreezePaintingOn(); 
        
        try 
        { 
            base.OnShow(smartPart, smartPartInfo); 
        } 
        finally 
        { 
            FreezePaintingOff(); 
        } 
    } 
}
```
