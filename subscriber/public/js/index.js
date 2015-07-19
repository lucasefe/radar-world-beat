/* global google:true, document: true, window: true, RadarClient: true */
var configuration = {
      host: 'localhost',
      port: 8000,
      secure: false,
      userId: 1,
      userType: 2,
      accountName: 'test'
    },
    mapOptions = {
      center: { lat: 37.7749300, lng: -122.4194200},
      zoom: 13
    },
    markers = [],
    map;

function forEachClient(data, callback) {
  Object.keys(data.value).forEach(function(userId) {
    Object.keys(data.value[userId].clients).forEach(function(clientId) {
      callback(clientId, data.value[userId].clients[clientId]);
    });
  });
}

function drawMarkerOnMap(map, data) {
  if (!data) { return; }

  var infowindow = new google.maps.InfoWindow({ content: 'Client: ' + data.name }),
      location = new google.maps.LatLng(data.lat, data.lng),
      marker = new google.maps.Marker({ position: location, map: map });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });

  markers.push(marker);

  return location;
}

function initializeMap() {
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

function startRadar() {
  RadarClient.configure(configuration).alloc('map', function() {
    RadarClient.presence('map').on(function(data){
      drawMarkerOnMap(map, data.value.clientData);
    }).sync({version: 2}, function(data) {
      forEachClient(data, function(clientId, data) {
        drawMarkerOnMap(map, data); 
      });
    });
  });
}

google.maps.event.addDomListener(window, 'load', initializeMap);
document.addEventListener('DOMContentLoaded', startRadar);

