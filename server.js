var Radar = require('radar'),
    memwatch = require('memwatch'),
    RadarClient = require('radar_client').constructor,
    configuration = Radar.configurator.load({persistence: true}),
    http = require('http'),
    p404 = function(req, res){
      console.log('Returning Error 404 for '+req.method+' '+req.url);
      res.statusCode = 404;
      res.end('404 Not Found');
    },
    clientConfiguration = {
      host: 'localhost',
      port: configuration.port,
      secure: false,
      userId: Math.floor(Math.random() * 1000),
      userType: 2,
      accountName: 'test'
    },
    httpServer,
    radarServer,
    radarClient;

process.title = 'RWB - Server on port ' + configuration.port;
memwatch.on('leak', function(info) { 
  console.log(info);
});


httpServer = http.createServer(p404);
httpServer.listen(configuration.port, function() {
  console.log('Radar Server listening on http://localhost:' + configuration.port);
  console.log('Radar Server Name: ', radarServer.sentry.name);
});

radarClient = new RadarClient();
radarClient.configure(clientConfiguration).alloc('events', function() {
  radarClient.message('list').subscribe();
});

radarServer = new Radar.server();
radarServer.attach(httpServer, configuration);
radarServer.sentry.on('up', function(name, message) {
  radarClient.message('list').publish({
    name: name, 
    event: 'up', 
    message: message
  });
});

radarServer.sentry.on('down', function(name, message) {
  radarClient.message('list').publish({
    name: name, 
    event: 'down', 
    message: message
  });
});

