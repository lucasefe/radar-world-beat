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
      center: { 
        lat: 37.7749300, 
        lng: -122.4194200
      },
      zoom: 13
    },
    clients = {},
    map;

function forEachClient(data, callback) {
  var value = data.value;

  Object.keys(value).forEach(function(userId) {
    var clients = value[userId].clients;

    Object.keys(clients).forEach(function(clientId) {
      var clientData = clients[clientId];

      callback(clientId, clientData);
    });
  });
}

function addClientToMap(map, clientId, clientData) {
  var infoWindow, location, marker;

  if (!clientId || !clientData) { return; }

  infoWindow = new google.maps.InfoWindow({
    content: 'Client: ' + clientData.name
  });

  location = new google.maps.LatLng(clientData.lat, clientData.lng);

  marker = new google.maps.Marker({
    position: location,
    map: map 
  });

  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.open(map,marker);
  });

  console.info('Client ' + clientId + ' is going online. ', clientData.port); 

  clients[clientId] = {
    marker: marker,
    data: clientData
  };
}

function removeMarkerToMap(clientId) {
  if (clients[clientId]) {
    console.warn('Client ' + clientId + ' is going offline. ', clients[clientId].data.port); 
    clients[clientId].marker.setMap(null);
  }
}

function initializeMap() {
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

function startSubscribing() {
  RadarClient.configure(configuration).alloc('map', function() {
    RadarClient.presence('map').on(function(data){
      if (data.op === 'client_online') {
        addClientToMap(map, data.value.clientId, data.value.clientData);
      } else if (data.op === 'client_offline') {
        removeMarkerToMap(data.value.clientId);
      }
    }).sync({version: 2}, function(data) {
      forEachClient(data, function(clientId, clientData) {
        addClientToMap(map, clientId, clientData); 
      });
    });
  });
}

google.maps.event.addDomListener(window, 'load', initializeMap);

document.addEventListener('DOMContentLoaded', startSubscribing);

