var static = require('node-static'),
    file = new static.Server('./subscriber/public'),
    http = require('http');

http.createServer(function (request, response) {
  
  request.addListener('end', function () {
    file.serve(request, response);
  }).resume();

}).listen(8080, function() {
  
  console.log('Map available on http://localhost:8080/');

});
