---
title: Come to www.istaysharp.net
date: 2006-04-13
---

Finally I have updated my site, called [IStaySharp](http://www.istaysharp.net/) to [MediaWiki](http://www.mediawiki.org/wiki/MediaWiki). MediaWiki is one of the best wiki based engines available and it's written in PHP and MySQL. Thankfully my hosting, [webhost4life](http://www.webhost4life.com/), has PHP & MySQL support.

The intention of IStaySharp is to document and archive my code snippets, articles, components, projects, etc. that I am working on, and to share my experiences that I encounter during my .NET development. Visitors to the site can use the _discussion_ page to give feedback, remarks, suggestions, etc. to the associated page.

I didn't encounter much problems when installing MediaWiki on webhost4life, except the e-mailing didn't work directly. The problem was that MediaWiki uses the format: `myname <myname@domain.com>(mailto:myname@domain.com>)` in the `to` field of the [mail](http://be2.php.net/manual/nl/ref.mail.php) function, and with the current settings and setup of webhost4life this resulted in an invalid address. Therefore I had to change the method `toString()` of the `MailAddress` class inside `UserMailer.php` to

``` php
function toString() 
{ 
    return $this->address; 
} 
```

instead of

```php
function toString() 
{ 
    if( $this->name != '' ) 
    { 
        return wfQuotedPrintable( $this->name ) . " <" . $this->address . ">"; 
    } 
    else 
    { 
        return $this->address; 
    } 
} 
```

IStaySharp uses also the [extension](http://www.christophdebaene.com/blog/2006/02/12/syntax-highlighting-for-mediawiki/) that I wrote for having syntax highlighting. Some other nice extensions are coming!
