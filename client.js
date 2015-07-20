var RadarClient = require('radar_client').constructor,
    clients = {},
    RADAR_PORT = process.env.RADAR_PORT || 8000,
    NEW_INTERVAL = 3000,
    REMOVE_INTERVAL = 30000,
    MAP_CENTER = { 
      lat: 37.7749300,
      lng: -122.4194200
    };

function newCoordinates(origin) {
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
}

function removeClient(client) {
  client.presence('map').set('offline');
  delete clients[client.name];
}

function newClient() {
  var client = new RadarClient(),
      configuration = {
        host: 'localhost',
        port: RADAR_PORT,
        secure: false,
        userId: Math.floor(Math.random() * 1000),
        userType: 2,
        accountName: 'test'
      };

  client.configure(configuration).alloc('map', function() {
    var data = newCoordinates(MAP_CENTER);

    data.name = client.name;
    data.port = RADAR_PORT;
    client.presence('map').set('online', data, function() {
      console.log('client ', client.name, configuration.userId, RADAR_PORT);
    });
  });

  clients[client.name] = client;

  setTimeout(function() {
    removeClient(client);
  }, Math.random() * REMOVE_INTERVAL);

  setTimeout(newClient, Math.random() * NEW_INTERVAL);
}

setTimeout(newClient, Math.random() * NEW_INTERVAL);
