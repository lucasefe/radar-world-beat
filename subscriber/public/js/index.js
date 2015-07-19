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
    markers = {},
    map;

function forEachClient(data, callback) {
  Object.keys(data.value).forEach(function(userId) {
    Object.keys(data.value[userId].clients).forEach(function(clientId) {
      callback(clientId, data.value[userId].clients[clientId]);
    });
  });
}

function addClientToMap(map, clientId, data) {
  var infowindow, location, marker;

  if (!data) { return; }

  infowindow = new google.maps.InfoWindow({ content: 'Client: ' + data.name });
  location = new google.maps.LatLng(data.lat, data.lng);
  marker = new google.maps.Marker({ position: location, map: map });

  console.info('Client ' + clientId + ' is going online'); 
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });

  markers[clientId] = marker;

  return location;
}

function removeMarkerToMap(clientId) {
  if (markers[clientId]) {
    console.warn('Client ' + clientId + ' is going offline'); 
    markers[clientId].setMap(null);
  }
}

function initializeMap() {
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

function startRadar() {
  RadarClient.configure(configuration).alloc('map', function() {
    RadarClient.presence('map').on(function(data){
      if (data.op === 'client_online') {
        addClientToMap(map, data.value.clientId, data.value.clientData);
      } else if (data.op === 'client_offline') {
        removeMarkerToMap(data.value.clientId, data.value.clientData);
      }
    }).sync({version: 2}, function(data) {
      forEachClient(data, function(clientId, clientData) {
        addClientToMap(map, clientId, clientData); 
      });
    });
  });
}

google.maps.event.addDomListener(window, 'load', initializeMap);
document.addEventListener('DOMContentLoaded', startRadar);

