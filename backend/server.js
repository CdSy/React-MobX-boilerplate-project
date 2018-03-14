var express = require('express');
var app     = express();
var server  = app.listen(5000, function() {
  console.log("server run on port 5000");
});
var io      = require('socket.io').listen(server);
var fs      = require('fs');
const { performance } = require('perf_hooks');

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

function write(stream, data, cb) {
  if (!stream.write(data)) {
    stream.once('drain', cb);
  } else {
    process.nextTick(cb);
  }
}

upload.on('connection', function(client) {  
  console.log(client.conn.id, 'Client connected...');
  var id = client.conn.id;
  let writeStream;
  
  clients[id] = client;

  clients[id].on('join', function(data) {
      console.log(data, "Client connect succsessfull");
  });

  clients[id].on('send-next-chunk', function(data) {
    const START = "" + data.chunkSize;
    const END = START.slice(0, START.length / 2);
    performance.mark(START);

    var final = data.isFinal;
    var fileId = data.fileId;
    var chunk = data.chunk;
    console.log(data.chunkSize, chunk.byteLength, "LENGTH");
    var sizeEqual = data.chunkSize === chunk.byteLength;
    const options = {
      highWaterMark: Math.pow(2,16)
    };

    if (!sizeEqual) {
      console.log("chunks size not equal");
    }

    if (!writeStream) {
      writeStream = fs.createWriteStream(__dirname + '/files/' + data.name, options);
      writeStream.on('finish', () => {  
        console.log('wrote all data to file');

        delete files[fileId];
        clients[id].emit('send-file-successful', "SUCCESSFUll");
        clients[id].disconnect(true);
      });
    }

    console.log(data.chunkNum, "num Chunk");
    console.log(final, "isFinal"); 

    if (final && sizeEqual) {
      write(writeStream, chunk, () => {
        console.log("last chunk is writed");
        writeStream.end();
      });
    } else {
      if (sizeEqual) {
        files[fileId].write = true;
        write(writeStream, chunk, () => {
          performance.mark(END);
          performance.measure(START + ' to ' + END, START, END);
          const measure = performance.getEntriesByName(START + ' to ' + END)[0];
          console.log("Call to doSomething took " + measure.duration + " milliseconds.");
          files[fileId].lastChunk = data.chunkNum;
          files[fileId].write = false;
          clients[id].emit('send-next-chunk-successful', "SUCCESSFUll");
        });
      } else {
        clients[id].emit('send-chunk-again', data.chunkNum);
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

    if (files[fileId].write) {
      setTimeout(() => {
        delete files[fileId];
      }, 500)
    }
  });

  clients[id].on('messages', function(data) {
    clients[id].emit('broad', data);
  });

  // clients[id].on('disconnect', function() {
  //   delete clients[id];
  // });
});
