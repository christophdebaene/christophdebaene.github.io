---
title: Geographical data and ASP.NET AJAX
date: 2007-01-25
tags: 
  - ajax
  - asp-net
---

In some enterprise applications you need to show geographical data such as countries and postcodes. Most of the time you need it for a registration page, where the user need to fill in the country and postcode/area.

[Geonames](http://www.geonames.org/) is a free geographical database that contains over 8 million geographical names and it can be accessed through a number of [webservices](http://www.geonames.org/export/#ws). For example the url [http://ws.geonames.org/countryInfo?](http://ws.geonames.org/countryInfo? "http://ws.geonames.org/countryInfo?") gives an xml with all countries, whereas the following request [http://ws.geonames.org/postalCodeSearch?placename=be](http://ws.geonames.org/postalCodeSearch?placename=be "http://ws.geonames.org/postalCodeSearch?placename=be") gives us all postcodes for a particular country (e.g. Belgium).

Most likely you need two dropdown lists, one for countries and one for postcodes, where the postcode dropdown is dependent from the country dropdown list. This is a very good example to introduce AJAX by using the [CascadingDropdown](http://ajax.asp.net/ajaxtoolkit/CascadingDropDown/CascadingDropDown.aspx) that is included in [ASP.NET AJAX](http://ajax.asp.net/default.aspx).

To implement this functionality we need to implement two methods on a webservice, namely _GetCountries_ and _GetPostalCodesByCountry_. The GetCountries simply returns all countries sorted by name and looks like this:

```csharp
[WebMethod]
public CascadingDropDownNameValue[] GetCountries()
{
    List<CascadingDropDownNameValue> list = new List<CascadingDropDownNameValue>();
     
    CountryItemCollection countries = IStaySharp.Geonames.GeonamesService.GetAllCountries();
                             
    for (int i = 0; i < countries.Countries.Length; i++)
    {
        list.Add(new CascadingDropDownNameValue(
            countries.Countries[i].CountryName,
            countries.Countries[i].CountryCode));
    }
 
    list.Sort(CompareCascadingDropDownNameValueByName);
    return list.ToArray();
}
```

Note that the list need to be converted to an array of CascadingDropDownNameValue objects. Note that we also sort the list by implementing a delegate named `CompareCascadingDropDownNameValueByName`.

```csharp
private static int CompareCascadingDropDownNameValueByName(CascadingDropDownNameValue x, CascadingDropDownNameValue y)
{
    if (x == null && y == null)
        return 0;
    else if (x == null && y != null)
        return -1;
    else if (x != null && y == null)
        return 1;
    else
        return x.name.CompareTo(y.name);
}
```

The other webservice method, called `GetPostalCodesByCountry`, need to retrieve all postcodes for a particular country. The signature of the method is very strict. The parameter names must be named `knownCategoryValues` and `category`, otherwise it will fail!

```csharp
[WebMethod]
public CascadingDropDownNameValue[] GetPostalCodesByCountry(string knownCategoryValues, string category)
{
    List<CascadingDropDownNameValue> list = new List<CascadingDropDownNameValue>();
 
    StringDictionary kv = CascadingDropDown.ParseKnownCategoryValuesString(knownCategoryValues);
 
    if (kv.ContainsKey("Country"))
    {
        string countryName = kv["Country"];
 
        PostalCodeItemCollection postalCodes = IStaySharp.Geonames.GeonamesService.GetPostalCodes(countryName);
 
        for (int i = 0; i < postalCodes.PostalCodes.Length; i++)
        {
            list.Add(new CascadingDropDownNameValue(
                string.Format("{0} ({1})", postalCodes.PostalCodes[i].PostalCode, postalCodes.PostalCodes[i].Name),
                postalCodes.PostalCodes[i].PostalCode));
        }
    }
 
    list.Sort(CompareCascadingDropDownNameValueByName);
    return list.ToArray();
}
```

In order to complete the webservice, the attribute ScriptService (line 3) need to be included so that a client javascript proxy can be generated. You can test this by calling your webservice like this [http://localhost:9999/GeonamesService.asmx/js](http://localhost:9999/GeonamesService.asmx/js "http://localhost:49573/GeonamesService.asmx/js").

```csharp
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.Web.Script.Services.ScriptService()]
public class GeonamesService : System.Web.Services.WebService
{
   ...
}
```

Finally we only need to add two CascadingDropDown controls on our aspx page with the following settings:

```xml
<asp:ScriptManager ID="scriptManager" runat="server" />
         
<asp:DropDownList ID="countriesDropDown" runat="server"/>
<ajaxToolkit:CascadingDropDown
    ID="countriesCascadingDropDown"        
    TargetControlID="countriesDropDown"
    Category="Country" 
    PromptText="Please select a country" 
    LoadingText="[Loading countries...]" 
    ServicePath="/GeonamesService.asmx"
    ServiceMethod="GetCountries"
    runat="server"/> 
 
<br/><br/>
 
<asp:DropDownList ID="postalCodesDropDown" runat="server"/>
<ajaxToolkit:CascadingDropDown
    ID="postalCodesCascadingDropDown"
    TargetControlID="postalCodesDropDown"
    Category="PostalCode" 
    PromptText="Please select postalcode" 
    LoadingText="[Loading postalcodes...]" 
    ServicePath="GeonamesService.asmx"
    ServiceMethod="GetPostalCodesByCountry"
    ParentControlID="countriesDropDown"
    runat="server"/>
```

The source code can be downloaded here: [IStaySharp.AJAXSample](http://christophdebaene.com/blog/wp-content/uploads/2007/01/IStaySharp.AJAXSample.zip)
