var RadarClient = require('./node_modules/radar_client/lib/radar_client.js'),
    clients = [],
    sfCoordinates = { 
      lat: 37.7749300,
      lng: -122.4194200
    };

var newCoordinates = function(origin) {
  var u = Math.random(), 
      v = Math.random(),
      radius = 0.05,
      w = radius * Math.sqrt(u),
      t = 2 * Math.PI * v,
      x = w * Math.cos(t),
      y = w * Math.sin(t),
      x2 = x / Math.cos(origin.lng);

  return({
    lat: y+origin.lat,
    lng: x2+origin.lng
  });
};

function removeClient(client) {
  client.presence('map').set('offline');
}

var newClient = function () {
  var client = new RadarClient(),
      configuration = {
        host: 'localhost',
        port: 8000,
        secure: false,
        userId: Math.floor(Math.random() * 1000),
        userType: 2,
        accountName: 'test'
      };

  client.configure(configuration).alloc('map', function() {
    var data = newCoordinates(sfCoordinates);

    data.name = client.name;
    client.presence('map').set('online', data, function() {
      console.log('client: ', client.name, configuration.userId);
    });
  });

  clients.push(client);
  setTimeout(function() {
    removeClient(client);
  }, Math.random() * 10000);

  setTimeout(newClient, Math.random() * 10000);
};

setTimeout(newClient, Math.random() * 10000);
