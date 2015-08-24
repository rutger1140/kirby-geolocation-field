# Geolocation for Kirby 2

This is a custom field for [Kirby](http://getkirby.com) that adds a Google Map with draggable marker.
Marker position is saved to input field.
GeoCoder is used to search for address entries.

## Installation

[Download the files](https://github.com/lekkerduidelijk/kirby-geolocation-field/archive/master.zip) and put them in a folder named <code>geolocation</code>, inside the <code>/site/fields</code> folder. If the fields folder doesn't exist, create it.

## How to use it

In your [blueprint](http://getkirby.com/docs/panel/blueprints) add the following field:
```
fields:
  location:
    label: Location
    type: geolocation
```


In your [template](http://getkirby.com/docs/templates) you can use the field like:
```php
<?php echo $page->location(); ?>
```

## Troubleshooting

**1. The map doesn't show in the panel**

* Make sure to use 'location' as fieldname in your blueprint or change the selector in geolocation.js accordingly.
([See issue #2](https://github.com/lekkerduidelijk/kirby-geolocation-field/issues/2))

* Make sure to refresh the panel after chancing your blueprint. 
([See issue #3](https://github.com/lekkerduidelijk/kirby-geolocation-field/issues/3))

**2. The latitude and longtitude show as one string in my template**

Due to limitations in the Kirby core you need to split the string yourself in the template. 
([See issue #1](https://github.com/lekkerduidelijk/kirby-geolocation-field/issues/1#issuecomment-64706089))


## Example
![Example of Geolocation](https://raw.githubusercontent.com/lekkerduidelijk/kirby-geolocation-field/master/geolocation-field.gif)
