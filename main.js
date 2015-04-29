/*
  Clicky server program.
*/
(function(){
  'use strict';

  var fs = require('fs'),
    http = require('http'),

    io = require('socket.io'),

    // Clicky counter.
    clickyCounter = 0,

    // Setup HTTP server to serve static files.
    httpServer = http.createServer(function(request, response){
      fs.readFile(
        'web/index.html',
        {
          encoding: 'utf8'
        },
        function(error, data){
          if (error !== null) {
            response.statusCode = 500;
            response.end('Unable to load index.html.');
            return;
          }
          response.statusCode = 200;
          response.end(data);
        });
    }),

    ioServer = io(httpServer);

  ioServer.on('connection', function(socket){
    console.log('Got a connection from a client.');

    // Event handler for "addClicky" event from client.
    socket.on('addClicky', function(){
      // Increase counter by 1, then broadcast the new counter value to all
      // connected clients.
      clickyCounter += 1;
      ioServer.sockets.emit('clickyResult', {
        result: clickyCounter
      });
    });

    // Event handler for "getClicky" event from client.
    socket.on('getClicky', function(){
      socket.emit('clickyResult', {
        result: clickyCounter
      });
    });
  });

  httpServer.listen(8080);
}());