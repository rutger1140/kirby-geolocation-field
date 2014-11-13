/**
 * Geolocation field for Kirby 2
 *
 * @author: Rutger Laurman - Lekkerduidelijk.nl
 * @version: 0.2
 */

var debug = false,
    map, geocoder, markers = [],

// Global debug logger
log = function(s){
  if(debug) {
    console.log(s);
  }
},

// Geolocation module
Geolocation = (function($){

  var s;

  function init() {
    log("Geolocation.init()");
    s = {

      mapcanvas:     $(".gmap"),
      locationField: $("#form-field-location"),

      // Fallback coordinates - center of Netherlands
      defaultLat:    52.312500,
      defaultLng:    5.548611,

      // Default map settings
      mapDefaults: {
        panControl:         false,
        zoomControl:        true,
        zoomControlOptions: true,
        scaleControl:       false,
        mapTypeControl:     false,
        streetViewControl:  false,
        scrollwheel:        false,
        zoom:               8
      }
    };

    // If mapcanvas is present, read the field and load the map
    if(s.mapcanvas.length) {
      readField();
      loadGmap();
    }
  }

  // Field IO
  // ==========================================================================

  function readField() {
    log("Geolocation.readField()");

    // Get field and split on comma
    var field = s.locationField.val(),
        parts = field.split(",");

    s.currentLat = parts[0] || s.defaultLat;
    s.currentLng = parts[1] || s.defaultLng;
  }

  function writeField(lat,lng) {
    log("Geolocation.writeField()")

    // Concatenate string
    var string = lat + "," + lng;
    s.locationField.val(string);
  }

  // Google Maps
  // ==========================================================================

  function loadGmap() {
    log("Geolocation.loadGmap()");

    // See if Google Maps is already loaded
    if(typeof map === "undefined") {

      // Load Google Maps
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' +
            'callback=Geolocation.build';
      document.body.appendChild(script);
    } else {

      // Build map
      buildGmap();
    }

  }
  function buildGmap() {
    log("Geolocation.buildGmap()");

    // Create location object and geocoder
    var markerLocation = new google.maps.LatLng(s.currentLat,s.currentLng);
    geocoder = new google.maps.Geocoder();

    // If this is not the default location, zoom in
    if(s.currentLat != s.defaultLat && s.currentLng != s.defaultLng)
      s.mapDefaults.zoom = 15;

    // Build the map
    var mapOptions = $.extend({}, s.mapDefaults, {
      center: new google.maps.LatLng(s.currentLat,s.currentLng),
      minZoom: 6,
    });
    map = new google.maps.Map(s.mapcanvas[0], mapOptions);

    // Add marker to map
    addMarker(markerLocation);

    // Initialize search function
    initSearch();

  }

  // Markers
  // ==========================================================================

  function addMarker(location) {
    log("Geolocation.addMarker()");

    // Add the draggable marker
    var marker = new google.maps.Marker({
      position: location,
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP
    });

    // Add marker to global array
    markers.push(marker);

    // Listen to end of dragging event and save marker
    google.maps.event.addListener(marker, 'dragend', dragEndEvent);
  }

  function removeMarkers() {
    log("Geolocation.removeMarkers()");

    // Loop through all markers and remove map reference
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }

    // Clear array
    markers = [];
  }

  function dragEndEvent() {
    log("Geolocation.dragEndEvent()");

    // Get marker position and store it
    var location = this.getPosition();
    storeLocation(location, false);
  }

  // Move map and store location
  // ==========================================================================

  function storeLocation(location, zoom){
    log("Geolocation.storeLocation()");

    // Pan and zoom
    map.panTo(location);
    if(zoom) map.setZoom(15);

    // Get coordinates
    var lat = location.lat();
    var lng = location.lng();

    // Write coordinates to field
    writeField(lat,lng);
  }

  // Search with Geocoding
  // ==========================================================================

  function initSearch() {
    log("Geolocation.initSearch()");

    // Search field for geocoder
    var $field  = $("#geo-search-field"),
        $submit = $("#geo-search-submit");

    // @TODO: Combine these events into a more DRY approach

    // Handle event for enter keypress
    $field.keypress(function(e) {
      if (e.which == 13) {
        e.preventDefault();
        var address = $field.val();
        if(address == "") {
          $field.focus();
          return;
        } else {
          doSearch(address);
        }
      }
    });

    // Handle click event on search button
    $submit.on("click",function(e){
      e.preventDefault();
      var address = $field.val();
      if(address == "") {
        $field.focus();
        return;
      } else {
        doSearch(address);
      }
    });
  }

  function doSearch(address) {
    log("Geolocation.doSearch()");

    // Get address with geocoder
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {

        var location = results[0].geometry.location;

        // Remove other markers from map
        removeMarkers();

        // Add marker for found location
        addMarker(location);

        // Save found location
        storeLocation(location, true);

      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  // Public methods
  // ==========================================================================

  return {
    init: init,
    build: buildGmap
  }

})(jQuery);

// Load method triggered by Kirby
// https://github.com/getkirby/panel/issues/228#issuecomment-58379016
(function($) {
  $.fn.location = function() {
    Geolocation.init();
  }
})(jQuery);
