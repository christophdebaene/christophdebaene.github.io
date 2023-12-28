---
title: How to install MediaWiki in 11 Steps
date: 2006-01-26
---

[MediaWiki](http://www.mediawiki.org/wiki/MediaWiki) is a Wiki software licensed under [GPL](http://en.wikipedia.org/wiki/GNU_General_Public_License) and written in [PHP](http://www.php.net). [Wiki](http://en.wikipedia.org/wiki/Wiki) allows users to easily add and edit content in a collaborative way. [Wikipedia](http://en.wikipedia.org/wiki/Main_Page) for example is one of the most popular Wiki's based on MediaWiki.

Below you find the necessary steps for installing MediaWiki.

1. **Download** & **install** [PHP 5.1.2 Installer](http://www.php.net/get/php-5.1.2-installer.exe/from/a/mirror). The installer creates a folder named `c\:php`
2. **Download** [PHP 5.1.2 zip package](http://www.php.net/get/php-5.1.2-Win32.zip/from/a/mirror) and **extract** all files in the folder `c\:php`
3. **Edit** the `php.ini` file that resides in `C:\Windows`
    1. Change the extension directory: `extension_dir = "c:/php/ext/"`
    2. uncomment mysql extension: `extension = php_mysql.dll`
4. **Download** & **install** [MySQL 4.1.16 (Windows (X86))](http://dev.mysql.com/downloads/mysql/4.1.html).
5. **Create** a virtual directory under IIS called `phpmyadmin` (e.g. `c:/inetpub/wwwroot/phpmyadmin`)
    1. Add the entry `index.php` in the documents tab. ![iisdocuments](images/iisdocuments.jpg)
6. **Download** the latest [phpMyAdmin](http://www.phpmyadmin.net/home_page/index.php) and **extract** all files under the virtual directory of `phpmyadmin`.
7. **Edit** the file `config.default.php` that resides in the `phpmyadmin` folder.
    1. Change the root password of MySQL.
8. **Browse** to [http://localhost/phpmyadmin ![phpmyadmin](images/phpmyadmin.jpg)](http://localhost/phpmyadmin) 
9. **Create** a virtual directory under IIS called `mediawiki` (e.g. `c:/inetpub/wwwroot/mediawiki`)
    1. Add the entry `index.php` in the documents tab.
10. **Download** the latest [MediaWiki](http://www.mediawiki.org/wiki/Download) and **extract** all files under the virtual directory of `mediawiki`
11. **Browse** to [http://localhost/mediawiki](http://localhost/mediawiki) & **Configure**.
    1. Add the line: `$wgEnableUploads = true` in the `LocalSettings.php` to enable uploads ![mediawiki](images/mediawiki.jpg)

!!! Warning

    After installation you will notice that some pages give a warning, namely:
    `Undefined index: REQUEST_URI in C:InetpubwwwrootmediawikiincludesWebRequest` 
    This is a known issue and can be [fixed](http://bugzilla.wikimedia.org/show_bug.cgi?id=3000).
