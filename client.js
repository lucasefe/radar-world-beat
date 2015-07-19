var RadarClient = require('./node_modules/radar_client/lib/radar_client.js'),
    INTERVAL = 10000,
    clients = [];

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
    client.presence('map').set('online', function() {
      console.log('client: ', client.name, configuration.userId);
    });
  });

  clients.push(client);

  setTimeout(newClient, INTERVAL);
};

setTimeout(newClient, INTERVAL);
