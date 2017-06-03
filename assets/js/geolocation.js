/**
 * Geolocation field for Kirby 2
 *
 * @author: Rutger Laurman - Lekkerduidelijk.nl
 * @version: 0.3
 */
(function() {
  function Geolocation(container) {
    this.container = container;
    this.mapElement = container.querySelector('.geolocation-map');
    this.inputElement = container.querySelector('.geolocation-input');
    this.latInputElement = container.querySelector('.geolocation-input-lat');
    this.lngInputElement = container.querySelector('.geolocation-input-lng');
    this.latInputElement.addEventListener('change', this.updateFromLatLngInputs.bind(this));
    this.lngInputElement.addEventListener('change', this.updateFromLatLngInputs.bind(this));
    this.updateFromInput();
    this.map = new google.maps.Map(this.mapElement, {
      panControl: false,
      zoomControl: true,
      zoomControlOptions: true,
      scaleControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      scrollwheel: false,
      zoom: this.latLng ? 15 : 2,
      minZoom: 1,
      center: this.latLng || this.defaultLatLng
    });
    this.updateMarker();
    this.updateLatLngInputs();
    this.initializeSearchField();
  }

  Geolocation.prototype = {
    defaultLatLng: {
      lat: 52.312500,
      lng: 5.548611
    },

    updateMarker: function() {
      var latLng = this.latLng || this.defaultLatLng;
      if (!this._marker) {
        this._marker = new google.maps.Marker({
          map: this.map,
          draggable: true,
          animation: google.maps.Animation.DROP
        });
        // Listen to end of dragging event and save marker
        var that = this;
        google.maps.event.addListener(this._marker, 'dragend', function() {
          // this keyword === marker:
          var position = this.getPosition();
          that.latLng = {
            lat: position.lat(),
            lng: position.lng()
          };
        });
      }
      var markerLocation = new google.maps.LatLng(latLng.lat, latLng.lng);
      this._marker.setPosition(markerLocation);
      if (this.map)
        this.map.panTo(latLng);
    },

    updateLatLngInputs: function() {
      var values = this.inputElement.value.split(',');
      this.latInputElement.value = values[0] || '';
      this.lngInputElement.value = values[1] || '';
    },

    set latLng(latLng) {
      this.inputElement.value = latLng.lat + ',' + latLng.lng;
      this._latLng = latLng;
      this.updateMarker();
      this.updateLatLngInputs();
    },

    get latLng() {
      return this._latLng;
    },

    updateFromInput: function() {
      var fieldValue = this.inputElement.value;
      var hasLatLon = /^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/.test(fieldValue);
      var parts = fieldValue.split(',');
      var latLng = this._latLng = hasLatLon ? {
          lat: Number(parts[0]),
          lng: Number(parts[1])
        }
        : null;
    },

    updateFromLatLngInputs: function() {
      this.inputElement.value = this.latInputElement.value + ',' + this.lngInputElement.value;
      this.updateFromInput();
    },

    geolocateAddress: function(address, callback) {
      Geolocation._geocoder = Geolocation._geocoder || new google.maps.Geocoder();
      Geolocation._geocoder.geocode({address: address}, onReceivedLocation);
      function onReceivedLocation(results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
          return callback('Geocode was not successful for the following reason: ' + status);
        }
        return callback(null, results[0].geometry.location);
      }
    },

    initializeSearchField: function() {
      var searchField  = this.container.querySelector('.geolocation-search-field');
      var searchButton = this.container.querySelector('.geolocation-search-button');
      var that = this;

      // Handle event for enter keypress
      searchField.addEventListener('keypress', function(event) {
        var enterPressed = event.which == 13 || event.keyCode == 13;
        if (enterPressed) {
          event.preventDefault();
          performSearch();
        }
      });

      // Handle click event on search button
      searchButton.addEventListener('click', function(event) {
        event.preventDefault();
        performSearch();
      });

      function performSearch() {
        var address = searchField.value;
        if (address === '') {
          return searchField.focus();
        }
        that.geolocateAddress(address, function(error, latLng) {
          if (error)
            return window.alert(error);
          that.latLng = {
            lat: latLng.lat(),
            lng: latLng.lng()
          };
          that.map.setZoom(15);
        });
      }
    }
  };

  var loadGoogleMaps = (function() {
    var callbacks = [];
    var loading = false;

    function loadMaps() {

      // Obtain key from https://developers.google.com/maps/documentation/javascript/get-api-key
      var apiKey = document.querySelector('.geolocation-map').getAttribute('data-key');

      if(apiKey === "" || apiKey === null) {
        alert("[!] Please set a Google Maps API key in your config file.");
      }
      
      window._onGoogleMapsLoaded = function() {
        delete window._onGoogleMapsLoaded;
        callbacks.forEach(function(callback) {
          callback();
        });
        callbacks.length = 0;
      };
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://maps.googleapis.com/maps/api/js?' +
            'key=' + apiKey +
            '&callback=window._onGoogleMapsLoaded';
      document.body.appendChild(script);
    }

    return function(callback) {
      if (typeof google === 'object' && google.maps) {
        return callback();
      }
      callbacks.push(callback);
      if (!loading) {
        $(loadMaps);
        loading = true;
      }
    };
  })();

  jQuery.fn.geolocation = function() {
    // this == the input field. The container div is
    // two levels up:
    var container = this[0].parentNode.parentNode;
    loadGoogleMaps(function() {
      new Geolocation(container);
    });
  };
})();
