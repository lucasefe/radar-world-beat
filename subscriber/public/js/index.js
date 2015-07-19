/* global google:true, document: true, window: true, RadarClient: true */

function initializeMap() {
  var mapOptions = {
    center: { lat: 0, lng: 0},
    zoom: 3
  };

  new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initializeMap);

document.addEventListener('DOMContentLoaded', function() { 
  var configuration = {
    host: 'localhost',
    port: 8000,
    secure: false,
    userId: 1,
    userType: 2,
    accountName: 'test'
  };

  RadarClient.configure(configuration).alloc('map', function() {
    RadarClient.presence('map').on(function(data){
      console.log('data', data);
    }).subscribe(function() {
      console.log('ready to receive');
    });
  });
});
