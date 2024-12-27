function custom() {

  var userLang = navigator.language || navigator.userLanguage;
  console.log ("User language is: " + userLang);

  if (userLang != 'pt-BR') {
    strings_dict = strings_dict_en;
    countries = countries_en;
  }

  document.title = user_info["name"].concat(" | ").concat(strings_dict['MAP_TITLE']);

  countries_list = []

  for (var country_code in countries_dict) {
    countries_list.push([country_code,
      countries_dict[country_code][0],
      countries_dict[country_code][1],
      countries_dict[country_code][2]])
  }

  addFavicon();
  addFooter();

  // construct menu on full window map
  var input_streets = document.createElement('INPUT');
  input_streets.setAttribute('id', 'streets-v11');
  input_streets.setAttribute('type', 'radio');
  input_streets.setAttribute('name', 'rtoggle');
  input_streets.setAttribute('value', 'streets');
  input_streets.setAttribute('checked', 'checked');
  var label_streets = document.createElement('LABEL');
  label_streets.setAttribute('for', 'streets-v11');
  label_streets.innerText = strings_dict['MAP_LAYER_1'];
  var input_outdoors = document.createElement('INPUT');
  input_outdoors.setAttribute('id', 'outdoors-v11');
  input_outdoors.setAttribute('type', 'radio');
  input_outdoors.setAttribute('name', 'rtoggle');
  input_outdoors.setAttribute('value', 'outdoors');
  var label_outdoors = document.createElement('LABEL');
  label_outdoors.setAttribute('for', 'outdoors-v11');
  label_outdoors.innerText = strings_dict['MAP_LAYER_2'];
  var input_satellite = document.createElement('INPUT');
  input_satellite.setAttribute('id', 'satellite-v9');
  input_satellite.setAttribute('type', 'radio');
  input_satellite.setAttribute('name', 'rtoggle');
  input_satellite.setAttribute('value', 'satellite');
  var label_satellite = document.createElement('LABEL');
  label_satellite.setAttribute('for', 'satellite-v9');
  label_satellite.innerText = strings_dict['MAP_LAYER_3'];
  layerList.appendChild(input_streets);
  layerList.appendChild(label_streets);
  layerList.appendChild(input_outdoors);
  layerList.appendChild(label_outdoors);
  layerList.appendChild(input_satellite);
  layerList.appendChild(label_satellite);

  for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
  }

  var div_sw_photos = document.createElement("DIV");
  div_sw_photos.setAttribute("class", "selected-photos");
  div_sw_photos.innerText = strings_dict['MAP_PHOTOS'];

  var div_sw_exhibits = document.createElement("DIV");
  div_sw_exhibits.setAttribute("class", "unselected-exhibits");
  div_sw_exhibits.addEventListener('click', function () { openExhibits() })
  div_sw_exhibits.innerText = strings_dict['MAP_EXHIBITS'];

  var div_map_switcher = document.createElement("DIV");
  div_map_switcher.setAttribute("class", "map-switcher");
  div_map_switcher.appendChild(div_sw_photos);
  div_map_switcher.appendChild(div_sw_exhibits);
  document.body.appendChild(div_map_switcher);

  var div_panel = document.createElement("DIV");
  div_panel.setAttribute("id", "panel");
  div_panel.setAttribute("class", "countries-panel");

  countries_list.sort(function(a,b) {
    var delta = (a[3]-b[3]);
    if (delta == 0) {
      return (a[2]-b[2]);
    }
    return delta;
   });

  addIcon('WW', div_panel);
  // addIcon('EU', div_panel);

  var separator = document.createElement('HR');
  separator.setAttribute('class', 'separator');
  div_panel.appendChild(separator);

  for (var i = countries_list.length-1; i >= 0; i--) {
    var country_code = countries_list[i][0];
      addIcon(country_code, div_panel);
  }

  document.body.appendChild(div_panel);

  document.getElementById('WW').addEventListener('click', function() { fitRegion('WW') });
  // document.getElementById('EU').addEventListener('click', function() { fitRegion('EU') });

  countries_list.forEach(addListener);

  // Functions

  function addFavicon() {
    var favicon = document.createElement("LINK");
    favicon.setAttribute("rel", "shortcut icon");
    favicon.setAttribute("type", "image/x-icon");
    favicon.setAttribute("href", "../icons/favicon.ico");
    document.head.append(favicon);
  }

  function addIcon(country_code, panel) {
    var country_name = countries[country_code];
    console.log(country_name);
    var elem = document.createElement("IMG");
    elem.setAttribute("id", country_code);
    elem.setAttribute("class", "icon");
    elem.setAttribute("src", getIconSrc(countries_en[country_code]));
    elem.setAttribute("title", country_name);
    elem.setAttribute("alt", country_name);
    var div_icon = document.createElement("DIV");
    div_icon.setAttribute("class", "flag-icon");
    div_icon.appendChild(elem);
    panel.appendChild(div_icon);
  }

  function getIconSrc(name) {
    return "icons/".concat(name.replace(" ", "-").toLowerCase()).concat(".svg");
  }

  function addListener(country) {
    var country_code = country[0];
    document.getElementById(country_code).addEventListener('click', function() { fitRegion(country_code) });
  }

  function fitRegion(region) {

    var fitMarkers = true;
    var bboxes = [];
    var padding = 50;

    if (fitMarkers && region != 'WW') {
        bboxes = getCountryMarkersBbox(region);
        padding += 100;
    } else {
        bboxes = countries_bbox[region][1];
    }

    var west = bboxes[0];
    var south = bboxes[1];
    var east = bboxes[2];
    var north = bboxes[3];

    map.fitBounds([
        [west, south],
        [east, north]],
        {padding: padding}
    );

  };

  function getCountryMarkersBbox(country_code) {

    var west = 180;
    var south = 90;
    var east = -180;
    var north = -90;

    var country_markers = locations_dict[country_code];
    var country_bbox = [];

    for (var i = 0; i < country_markers.length; i++) {

      if (country_markers[i][0][0] < west) {
        west = country_markers[i][0][0];
      }
      if (country_markers[i][0][0] > east) {
        east = country_markers[i][0][0];
      }
      if (country_markers[i][0][1] < south) {
        south = country_markers[i][0][1];
      }
      if (country_markers[i][0][1] > north) {
        north = country_markers[i][0][1];
      }

      country_bbox = [west, south, east, north];

    }

    return country_bbox;

  }

  function openExhibits() {
    window.location.replace("https://haraldoalbergaria.page/map/exhibits/")
  }

  function addFooter() {
    var footer = document.createElement("DIV");
    footer.setAttribute("class", "footer");
    footer.innerHTML = "Icons made by <a href=\"https://www.flaticon.com/authors/turkkub\" title=\"turkkub\" target=\"_blank\">turkkub</a> (World) and <a href=\"https://www.flaticon.com/authors/freepik\" title=\"Freepik\">Freepik</a> (Countries) from <a href=\"https://www.flaticon.com/\" title=\"Flaticon\" target=\"_blank\">www.flaticon.com</a>";
    document.body.append(footer);
  }

}
