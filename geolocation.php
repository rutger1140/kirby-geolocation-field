<?php
/**
 * Geolocation panel field for Kirby 2
 *
 * @author: Rutger Laurman - lekkerduidelijk.nl
 * @version: 0.2
 *
 */

class GeolocationField extends InputField {

  public function __construct() {
    $this->type         = 'text';
    $this->icon         = 'map-marker';
    $this->label        = l::get('fields.location.label', 'Location');
    $this->placeholder  = l::get('fields.location.placeholder', 'Coordinates');
    $this->readonly     = true;
  }

  static public $assets = array(
    'js' => array(
      'geolocation.js'
    ),
    'css' => array(
      'geolocation.css'
    )
  );

  public function input() {
    $input = parent::input();
    $input->data('field','location');
    return $input;
  }

  public function icon() {
    $i = new Brick('i');
    $i->addClass('icon fa fa-' . $this->icon);
    $icon = new Brick('div');
    $icon->addClass('field-icon');
    $icon->append($i);
    return $icon;
  }

  public function content() {
    $searchfield = new Brick('div');
    $searchfield->addClass('field-content');
    $searchfield->append($this->mapsearch());

    $mapfield = new Brick('div');
    $mapfield->addClass('field-content');
    $mapfield->append($this->map());

    $inputfield = new Brick('div');
    $inputfield->addClass('field-content');
    $inputfield->append($this->input());
    $inputfield->append($this->icon());

    $content = $searchfield . $mapfield . $inputfield;

    return $content;
  }

  public function mapsearch() {
    $mapsearch = new Brick('div');
    $mapsearch->addClass('mapsearch');

    // Search field
    $input = new Brick("input");
    $input->attr("id", "geo-search-field");
    $input->attr("placeholder","Search for a location");
    $input->addClass("input mapsearch-field");

    // Search button
    $button = new Brick("input");
    $button->attr("id", "geo-search-submit");
    $button->attr("type", "button");
    $button->attr("value", "Search");
    $button->addClass("btn btn-rounded mapsearch-button");

    $mapsearch->append($input);
    $mapsearch->append($button);

    return $mapsearch;
  }

  public function map() {
    $element = new Brick('div');
    $element->addClass('gmap');
    return $element;
  }
}
