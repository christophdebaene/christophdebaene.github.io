# Windows

## How to create a shortcut to edit environemnt variables on Windows?

https://lockevn.medium.com/shortcut-to-edit-system-environment-variables-on-windows-26571b166c79

1. Right click 'My Computer' and select 'Properties'.
2. Click 'Advanced System Settings' link.
3. Click 'Advanced' tab.
4. Click 'Environment Variables...' button.

Control Panel > System > Advanced System Settings > Environment Variables

`rundll32 sysdm.cpl,EditEnvironmentVariables`

 * **Target**: `%windir%\System32\rundll32.exe sysdm.cpl,EditEnvironmentVariables`
 * **Start in**: %windir%


The unit price of our product is {{ unit_price }} EUR.
Taking the standard discount into account,
the sale price of 50 units is {{ price(unit_price, 50) }} EUR.

{{ git.date }}



