---
title: Integrating Validation Application Block of Enterprise Library with CSLA.NET
date: 2007-03-01
tags: 
  - components
---

[CSLA.NET](http://www.lhotka.net/Area.aspx?id=4#) framework from [Lhotka](http://www.lhotka.net/weblog/) contains a lot of mechanisms for adding validations and business rules. Through CSLA.NET you can easily provide your own custom rules. [Enterprise Library v3.0](http://www.codeplex.com/entlib) now also contains a [validation application block](http://blogs.msdn.com/tomholl/archive/2007/01/17/validation-application-block-in-the-january-2007-ctp.aspx) (VAB) that can be used through attributes and even from a configuration file.

The two validation mechanisms of validation are complementary. This can be done by adding a custom rule that uses the ValidationFactory of the VAB. This means we have something like:

```csharp
public class VABRules
{
    public class VABRuleArgs : RuleArgs
    {
        private string _ruleset;
 
        public string Ruleset
        {
            get { return _ruleset; }
        }
 
 
        public VABRuleArgs(string propertyName) : this(propertyName, null)
        {
        }
 
        public VABRuleArgs(string propertyName, string ruleset) : base(propertyName)
        {
            _ruleset = ruleset;
        }
    }
 
    public static bool VABValid<T>(object target, RuleArgs e)
    {
        Validator<T> validator = ValidationFactory.CreateValidator<T>(((VABRuleArgs)e).Ruleset);
 
        if (validator == null)
            return true;
 
        ValidationResults results = validator.Validate(target);
 
        if (results == null)
            return true;
 
        foreach (ValidationResult result in results)
        {
            if (result.Key == e.PropertyName)
            {
                e.Description = result.Message;
                return false;
            }
        }
 
        return true;
    }
}
```

Having the VAB rule we simply need to decorate our properties with the validation attributes of VAB and an override of the _AddBusinessRules_ method is needed to take into account the VAB rules. For example we can define a customer business object as follow:

```csharp
[Serializable()]
public class Customer : Csla.BusinessBase<Customer>
{
    private int _id = 0;
    private string _firstName = string.Empty;
    private string _email = string.Empty;
    private int _rewardPoints;
    private string _countryCode = string.Empty;
 
    [Browsable(false), System.ComponentModel.DataObjectField(true, true)]
    public int Id
    {
        get
        {
            CanReadProperty("Id", true);
            return _id;
        }
    }
 
    [NotNullValidator(MessageTemplate="First Name may not be empty")]
    [StringLengthValidator(1, 60, MessageTemplate = "First Name must be between 1 and 60 characters long")]
    public string FirstName
    {
        get
        {
            CanReadProperty("FirstName", true);
            return _firstName;
        }
        set
        {
            CanWriteProperty("FirstName", true);
            if (!_firstName.Equals(value))
            {
                _firstName = value;
                PropertyHasChanged("FirstName");
            }
        }
    }
 
    [RegexValidator(@"w+([-+.']w+)*@w+([-.]w+)*.w+([-.]w+)*")]
    public string Email
    {
        get
        {
            CanReadProperty("Email", true);
            return _email;
        }
        set
        {
            CanWriteProperty("Email", true);
            if (!_email.Equals(value))
            {
                _email = value;
                PropertyHasChanged("Email");
            }
        }
    }
 
    [Int32RangeValidator(0, 1000000, MessageTemplate = "Rewards points cannot exceed 1,000,000")]
    public int RewardPoints
    {
        get
        {
            CanReadProperty("RewardPoints", true);
            return _rewardPoints;
        }
        set
        {
            CanWriteProperty("RewardPoints", true);
            if (!_rewardPoints.Equals(value))
            {
                _rewardPoints = value;
                PropertyHasChanged("RewardPoints");
            }
        }
    }
 
    [NotNullValidator(MessageTemplate = "Country may not be empty")]
    public string CountryCode
    {
        get
        {
            CanReadProperty("CountryCode", true);
            return _countryCode;
        }
        set
        {
            CanWriteProperty("CountryCode", true);
            if (!_countryCode.Equals(value))
            {
                _countryCode = value;
                PropertyHasChanged("CountryCode");
            }
        }
    }
 
    protected override object GetIdValue()
    {
        return _id;
    }
 
    protected override void AddBusinessRules()
    {
        ValidationRules.AddRule(VABRules.VABValid<Customer>, new VABRules.VABRuleArgs("FirstName"));
        ValidationRules.AddRule(VABRules.VABValid<Customer>, new VABRules.VABRuleArgs("Email"));
        ValidationRules.AddRule(VABRules.VABValid<Customer>, new VABRules.VABRuleArgs("RewardPoints"));
        ValidationRules.AddRule(VABRules.VABValid<Customer>, new VABRules.VABRuleArgs("CountryCode"));
    }
}
```
