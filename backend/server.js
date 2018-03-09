var express = require('express');
var app = express();
var server = app.listen(5000, function() {
  console.log("server run on port 5000");
});
var io = require('socket.io').listen(server);

var clients = {};

var files = {};

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.get('/upload', function(req, res,next) {  
  console.log(req, res, "get");
});

var upload = io.of('/upload');

upload.on('connection', function(client) {  
  console.log(client.conn.id, 'Client connected...');
  var id = client.conn.id;
  
  clients[id] = client;

  clients[id].on('join', function(data) {
      console.log(data, "Client connect succsessfull");
  });

  clients[id].on('send-next-chunk', function(data) {
    var parseData = JSON.parse(data);
    var final = parseData.status;
    var fileId = parseData.fileId;
    
    files[fileId].lastChunk = parseData.numChunck;
    
    console.log(parseData.numChunck, "num Chunk");
    console.log(final, "isFinal");

    if (final) {
      delete files[fileId];
      clients[id].emit('send-file-successful', "SUCCESSFUll");
      clients[id].disconnect(true);
    } else {
      clients[id].emit('send-next-chunk-successful', "SUCCESSFUll");
    }
  });

  clients[id].on('get-last-chunk', function(data) {
    var fileId = JSON.parse(data).id;
    var lastChunk = 0;

    if (!files[fileId]) {
      files[fileId] = {id: fileId, lastChunk: 0};
    } else {
      lastChunk = files[fileId].lastChunk;
    }

    clients[id].emit('get-last-chunk', lastChunk);
  });

  clients[id].on('cancel-upload', function(fileId) {
    clients[id].disconnect(true);
    delete files[fileId];
  });

  clients[id].on('messages', function(data) {
    clients[id].emit('broad', data);
  });

  clients[id].on('disconnect', function() {
    delete clients[id];
  });
});
