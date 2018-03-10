import io from 'socket.io-client';
import sha1 from 'sha1';

class SubWorker {
  constructor({ onChange, ...params}, file) {
    const defaultParams = {
      chunkSize: 1 * 1024 * 1024,
      maxConnectionAttempts: 10,
      fileThrottle: 1000,
      url: 'ws://localhost:5000/upload',
      events: {
        GET_LAST_CHUNK: 'get-last-chunk',
        SEND_NEXT_CHUNK: 'send-next-chunk',
        SEND_NEXT_CHUNK_SUCCESS: 'send-next-chunk-successful',
        SEND_FILE_SUCCESS: 'send-file-successful',
        CANCEL_UPLOAD: 'cancel-upload',
        SEND_CHUNK_AGAIN: 'send-chunk-again',
      }
    };

    this.onMessage = onChange;
    this.socket = null;
    this.file = file;
    this.params = {...defaultParams, ...params};
    this.events = this.params.events;
    this.fileSize = this.file.data.size,
    this.chunkSize = this.params.chunkSize;
    this.maxChunk = Math.ceil(this.fileSize / this.chunkSize);
    this.offset = 0;
    this.start = 0;
    this.end = this.chunkSize;
    this.progress = 0;
    this.maxConnectionAttempts = this.params.maxConnectionAttempts;
    this.errorCount = 0;
    this.throttle = this.params.fileThrottle;
    this.previousTime = Date.now();
    this.isSuspended = false;
    this.openSocket();
  }

  postMessage = (message) => {
    this[message.event](message.payload);
  }

  pause = () => {
    this.isSuspended = true;
  }

  resume = () => {
    this.isSuspended = false;
    this.process();
  }

  stop = () => {
    this.onMessage({
      data: {
        payload: this.createFileObject(false),
        event: "cancelFileSender"
      }
    });
    this.socket.emit(this.events.CANCEL_UPLOAD, this.file.id);
  }

  updateFileState = () => {
    const now = Date.now();

    if ((now - this.previousTime) >= this.throttle) {
      this.previousTime = now;

      this.onMessage({
        data: {
          payload: this.createFileObject(false),
          event: "onProgress"
        }
      });
    }
  }

  closeFileSender = () => {
    this.onMessage({
      data: {
        payload: this.createFileObject(true),
        event: "closeFileSender"
      }
    });
  }

  createFileObject = (status) => {
    return {
      fileId: this.file.id, 
      name: this.file.data.name,
      progress: this.progress, 
      currentChunk: this.offset,
      type: this.file.data.type,
      status: status
    }
  }

  process = () => {
    const reader = new FileReaderSync();

    this.start = this.offset * this.chunkSize;
    this.end = Math.min(this.fileSize, (this.offset + 1) * this.chunkSize);

    if (this.fileSize - this.end < this.chunkSize) {
      this.end = this.fileSize;
    }

    const blob = this.slice(this.file.data, this.start, this.end);
    const dataUrl = reader.readAsDataURL(blob);
    const checkSumBlob = this.getCheckSum(dataUrl);
    const final = this.offset === this.maxChunk;
    
    const post = {
      chunk: dataUrl,
      fileId: this.file.id,
      chunkNum: this.offset,
      checkSum: checkSumBlob,
      type: this.file.data.type,
      name: this.file.data.name,
      status: final
    };

    this.socket.emit(this.events.SEND_NEXT_CHUNK, JSON.stringify(post));
  }

  getCheckSum = (blob) => {
    return sha1(blob);
  }

  slice = (file, start, end) => {
    const slice = file.mozSlice ||
                  file.webkitSlice ||
                  file.slice;
    
    return slice.bind(file)(start, end);
  }

  openSocket = () => {
    this.socket = io(this.params.url);

    this.socket.on('connect', () => {
      console.log('Socket ID: ' + this.socket.id + ' CONNECTED');
      
      this.socket.emit(this.events.GET_LAST_CHUNK, JSON.stringify({id: this.file.id}));
    });

    this.socket.on(this.events.GET_LAST_CHUNK, (data) => {
      this.offset = data;
      console.log(this.offset, "GET_LAST_CHUNK_SUCCESS");
      this.process();
    });

    this.socket.on(this.events.SEND_NEXT_CHUNK_SUCCESS, (event) => {
      this.offset += 1;
      this.progress = (this.offset / this.maxChunk) * 100;
      this.updateFileState();

      if (!this.isSuspended) {
        this.process();
      }
    });

    this.socket.on(this.events.SEND_FILE_SUCCESS, (event) => {
      this.closeFileSender();
      console.log(event, "SENDING_FILE_SUCCESSFUL");
    });

    this.socket.on(this.events.SEND_CHUNK_AGAIN, () => {
      this.process();
    });

    this.socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        console.log('Connection closed by server');
      } 

      if (reason === 'transport close') {
        console.log(this.errorCount + ' attempts - ' + 'Server Crashed');

        if (this.errorCount < this.maxConnectionAttempts) {
          this.errorCount += 1;
          this.socket.open();
        }
      }

      console.log('Connection closed, reason: ' + reason);
    });

    this.socket.on('connect_failed', () => {
      console.log('Connection Failed');
    });
  }
}

export default SubWorker;
