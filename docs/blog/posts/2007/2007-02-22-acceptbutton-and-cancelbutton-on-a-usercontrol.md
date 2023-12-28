---
title: AcceptButton and CancelButton on a UserControl
date: 2007-02-22
tags: 
  - forms
---

In many enterprise applications there is the need that, regardless on which control you have the focus, that you can hit the ++enter++ and/or ++esc++ key to perform a default action. This behaviour is also common to web applications. On the [Form](http://msdn2.microsoft.com/en-us/library/system.windows.forms.form.cancelbutton.aspx) control you find properties like [AcceptButton](http://msdn2.microsoft.com/en-us/library/system.windows.forms.form.acceptbutton.aspx) and [CancelButton](http://msdn2.microsoft.com/en-us/library/system.windows.forms.form.cancelbutton.aspx), whereas the [UserControl](http://msdn2.microsoft.com/en-us/library/system.windows.forms.usercontrol.aspx) doesn't have these properties. The code below contains an `AcceptButton` and `CancelButton` that allows you to define a default action when the ++enter++ or ++esc++ key is pressed respectively. 

```csharp
public class UserControlEx : System.Windows.Forms.UserControl
{    
    private Button _acceptButton;
    private Button _cancelButton;
 
    public event EventHandler<EventArgs> AcceptEvent;
    public event EventHandler<EventArgs> CancelEvent;
 
    [Browsable(true)]
    public Button AcceptButton
    {
        get { return _acceptButton; }
        set { _acceptButton = value; }
    }
 
    [Browsable(true)]
    public Button CancelButton
    {
        get { return _cancelButton; }
        set { _cancelButton = value; }
    }
 
    protected override bool ProcessCmdKey(ref Message msg, Keys keyData)
    {
        if (msg.WParam.ToInt32() == (int)Keys.Enter)
        {
            OnAcceptEvent(EventArgs.Empty);
 
            if (_acceptButton != null)
                _acceptButton.PerformClick();
        }
 
        if (msg.WParam.ToInt32() == (int)Keys.Escape)
        {
            OnCancelEvent(EventArgs.Empty);
 
            if (_cancelButton != null)
                _cancelButton.PerformClick();
        }
 
        return base.ProcessCmdKey(ref msg, keyData);
    }
 
    protected virtual void OnAcceptEvent(EventArgs args)
    {
        if (AcceptEvent != null)
            AcceptEvent(this, args);
    }
 
    protected virtual void OnCancelEvent(EventArgs args)
    {
        if (CancelEvent != null)
            CancelEvent(this, args);
    }
}
```

