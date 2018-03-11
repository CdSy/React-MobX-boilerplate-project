var express = require('express');
var app     = express();
var server  = app.listen(5000, function() {
  console.log("server run on port 5000");
});
var io      = require('socket.io').listen(server);
var fs      = require('fs');
var sha1    = require('sha1');

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
var dir = 

upload.on('connection', function(client) {  
  console.log(client.conn.id, 'Client connected...');
  var id = client.conn.id;
  let writeStream;
  
  clients[id] = client;

  clients[id].on('join', function(data) {
      console.log(data, "Client connect succsessfull");
  });

  clients[id].on('send-next-chunk', function(data) {
    var parseData = JSON.parse(data);
    var final = parseData.status;
    var fileId = parseData.fileId;
    var chunk = parseData.chunk;
    var checkSum = sha1(chunk);
    var hashSumEqual = checkSum = parseData.checkSum;
    let buff;

    if (hashSumEqual) {
      var base64data = chunk.split('base64,');
      buff = Buffer.from(base64data[1], 'base64');
    }

    if (!writeStream) {
      writeStream = fs.createWriteStream(__dirname + '/files/' + parseData.name);
      writeStream.on('finish', () => {  
        console.log('wrote all data to file');

        delete files[fileId];
        clients[id].emit('send-file-successful', "SUCCESSFUll");
        clients[id].disconnect(true);
      });
    }

    console.log(parseData.chunkNum, "num Chunk");
    console.log(final, "isFinal"); 

    if (final && hashSumEqual) {
      writeStream.write(buff, "binary");
      writeStream.end();
    } else {
      if (hashSumEqual) {
        writeStream.write(buff, "binary");
        files[fileId].lastChunk = parseData.chunkNum;
        clients[id].emit('send-next-chunk-successful', "SUCCESSFUll");
      } else {
        clients[id].emit('send-chunk-again', parseData.chunkNum);
      }
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
