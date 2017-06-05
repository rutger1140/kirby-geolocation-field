# Geolocation for Kirby 2

This is a custom field for [Kirby](http://getkirby.com) that adds a Google Map with draggable marker.
Marker position is saved to input field.
GeoCoder is used to search for address entries.

## Installation

[Download the files](https://github.com/lekkerduidelijk/kirby-geolocation-field/archive/master.zip) and put them in a folder named <code>geolocation</code>, inside the <code>/site/fields</code> folder. If the fields folder doesn't exist, create it.

To install the field as a submodule, you can use the following command:
```
git submodule add https://github.com/lekkerduidelijk/kirby-geolocation-field.git site/fields/geolocation
```

## How to use it

In your [blueprint](http://getkirby.com/docs/panel/blueprints) add the following field:
```yaml
fields:
  location:
    label: Location
    type: geolocation
```

In your config file, you need to set your [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key) with the `geolocation-key` config variable. Google recently changed it's policy regarding Google Map implementations and it won't work without it. ([See issue #9](https://github.com/lekkerduidelijk/kirby-geolocation-field/issues/9))
```php
// Obtain key from https://developers.google.com/maps/documentation/javascript/get-api-key
c::set('geolocation-key', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

```

In your [template](http://getkirby.com/docs/templates) you can use the field like:
```php
<?php echo $page->location(); ?>
```

## Troubleshooting

**1. The map doesn't show in the panel**

* Make sure to use 'location' as fieldname in your blueprint or change the selector in geolocation.js accordingly.
([See issue #2](https://github.com/lekkerduidelijk/kirby-geolocation-field/issues/2))

* Make sure to refresh the panel after changing your blueprint. 
([See issue #3](https://github.com/lekkerduidelijk/kirby-geolocation-field/issues/3))

**2. The latitude and longtitude show as one string in my template**

Due to limitations in the Kirby core you need to split the string yourself in the template. 
([See issue #1](https://github.com/lekkerduidelijk/kirby-geolocation-field/issues/1#issuecomment-64706089))

**3. Your plugin doesn't work with plugin _x_ and _y_**

The plugin should work with the most recent version of Kirby. If you've found a bug with the plugin please [create a new issue](https://github.com/lekkerduidelijk/kirby-geolocation-field/issues/new). 
I can't guarantee the plugin works with other Kirby plugins. If you run into issues try to reach out to the other plugin creator as well. Maybe we can work something out.

**4. Can you add feature _x_?**

In short: no. The plugin is provided as is. Please feel free to fork or create a pull request with your changes.

## Example
![Example of Geolocation](https://raw.githubusercontent.com/lekkerduidelijk/kirby-geolocation-field/master/geolocation-field.gif)
