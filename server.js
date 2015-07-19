var Radar = require('radar'),
    Minilog = require('minilog'),
    configuration = Radar.configurator.load({persistence: true}),
    http = require('http'),
    p404 = function(req, res){
      console.log('Returning Error 404 for '+req.method+' '+req.url);
      res.statusCode = 404;
      res.end('404 Not Found');
    },
    httpServer, radarServer;

Minilog.pipe(process.stdout);

httpServer = http.createServer(p404);
radarServer = new Radar.server();
radarServer.attach(httpServer, configuration);

httpServer.listen(configuration.port, function() {
  console.log('Radar Server listening on http://localhost:' + configuration.port);
});
