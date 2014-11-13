# Geolocation for Kirby 2

This is a custom field for [Kirby](http://getkirby.com) that adds a Google Map with draggable marker.
Marker position is saved to input field.
GeoCoder is used to search for address entries.

## Installation

Put the <code>geolocation</code> folder in <code>/site/fields</code>

## How to use it

In your blueprint add the following field:
```
fields:
  location:
    label: Location
    type: geolocation
```

## Example
