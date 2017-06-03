<?php
/**
 * Geolocation panel field for Kirby 2
 *
 * @author: Rutger Laurman - lekkerduidelijk.nl
 * @version: 0.3
 *
 */

class GeolocationField extends InputField {

  public function __construct() {
    $this->type         = "text";
    $this->icon         = "map-marker";
    $this->label        = l::get("fields.geolocation.label", "Geolocation");
    $this->readonly     = false;
  }

  static public $assets = array(
    "js" => array(
      "geolocation.js"
    ),
    "css" => array(
      "geolocation.css"
    )
  );

  public function input() {
    $input = parent::input();
    $input->addClass("geolocation-input");
    $input->data("field", "geolocation");
    return $input;
  }

  public function icon() {
    $i = new Brick("i");
    $i->addClass("icon fa fa-" . $this->icon);
    $icon = new Brick("div");
    $icon->addClass("field-icon");
    $icon->append($i);
    return $icon;
  }

  public function content() {
    $searchfield = new Brick("div");
    $searchfield->addClass("field-content");
    $searchfield->append($this->mapsearch());

    $mapfield = new Brick("div");
    $mapfield->addClass("field-content");
    $mapfield->append($this->elementWithClass("div", "geolocation-map"));

    $inputfield = new Brick("div");
    $inputfield->addClass("field-content");
    $inputfield->append($this->input());

    $latInputfield = new Brick("div");
    $latInputfield->addClass("field-content geolocation-field-lat");
    $latInputfield->append($this->inputElement("geolocation-input-lat input", "Latitude"));
    $latInputfield->append($this->icon());

    $lngInputfield = new Brick("div");
    $lngInputfield->addClass("field-content geolocation-field-lng");
    $lngInputfield->append($this->inputElement("geolocation-input-lng input", "Longitude"));
    $lngInputfield->append($this->icon());

    $content = $searchfield . $mapfield . $inputfield . $latInputfield . $lngInputfield;

    return $content;
  }

  public function mapsearch() {
    $mapsearch = new Brick("div");
    $mapsearch->addClass("geolocation-search");

    // Search field
    $input = new Brick("input");
    $input->attr("placeholder","Search for an address (optional)");
    $input->addClass("geolocation-search-field input");

    // Search button
    $button = new Brick("input");
    $button->attr("type", "button");
    $button->attr("value", "Search");
    $button->addClass("geolocation-search-button btn btn-rounded");

    $mapsearch->append($input);
    $mapsearch->append($button);

    return $mapsearch;
  }

  public function inputElement($class, $placeholder) {
    $element = $this->elementWithClass("input", $class);
    if ($placeholder) {
      $element->attr("placeholder", $placeholder);
    }
    return $element;
  }

  public function elementWithClass($element, $class) {
    $element = new Brick($element);
    $element->addClass($class);
    $element->data('key', c::get('geolocation-key', ''));
    return $element;
  }
}
