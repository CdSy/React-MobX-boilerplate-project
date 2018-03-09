import io from 'socket.io-client';

class SubWorker {
  constructor({ onChange, ...params}, file) {
    const defaultParams = {
      chunkSize: 1 * 1024 * 1024,
    };

    this.onMessage = onChange;
    this.socket = null;
    this.file = file;
    this.params = {...defaultParams, ...params};
    this.fileSize = this.file.data.size,
    this.chunkSize = this.params.chunkSize;
    this.maxChunk = Math.ceil(this.fileSize / this.chunkSize);
    this.offset = file.currentChunk;
    this.start = 0;
    this.end = this.chunkSize;
    this.progress = 0;
    this.openSocket();
  }

  postMessage = (message) => {
    this[message.event](message.payload);
  }

  uploadFile = () => {
    this.file = file;
    this.fileSize = this.file.data.size;
  }

  updateFileState = () => {
    this.onMessage({
      data: {
        payload: {
          id: this.file.id, 
          name: this.file.data.name,
          progress: this.progress, 
          currentChunk: this.offset,
          type: this.file.data.type,
          status: false
        },
        event: "onProgress"
      }
    });
  }

  closeFileSender = () => {
    this.onMessage({
      data: {
        payload: {
          id: this.file.id, 
          name: this.file.data.name,
          progress: this.progress, 
          currentChunk: this.offset,
          type: this.file.data.type,
          status: true
        },
        event: "closeFileSender"
      }
    });
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
    const final = this.offset === this.maxChunk;
    const post = {
      data: dataUrl,
      fileId: this.file.id,
      numChunck: this.offset,
      type: this.file.data.type,
      status: final
    };

    this.socket.emit('send-next-chunk', JSON.stringify(post));
  }

  slice = (file, start, end) => {
    const slice = file.mozSlice ||
                  file.webkitSlice ||
                  file.slice;
    
    return slice.bind(file)(start, end);
  }

  openSocket = () => {
    this.socket = io("ws://localhost:5000/upload");

    this.socket.on('connect', () => {
      console.log(this.socket.id, "Соединение установлено.");
      
      this.process();
    });

    this.socket.on('event', (data) => {
      console.log("Получены данные " + event.data);
    });

    this.socket.on('send-next-chunk-successful', (event) => {
      console.log(event, "send chunk successfull");
      this.offset += 1;
      this.progress = (this.offset / this.maxChunk) * 100;
      this.updateFileState();
      this.process();
    });

    this.socket.on('send-file-successful', (event) => {
      this.closeFileSender();
      console.log(event, "send file successfull");
    });

    this.socket.on('disconnect', (event) => {
      console.log(event);
      if (event.wasClean) {
        console.log('Соединение закрыто чисто');
      } else {
        console.log('Обрыв соединения');
        // this.socket.open();
      }
      console.log('Код: ' + event.code + ' причина: ' + event.reason);
    });

    this.socket.on('error', (error) => {
      console.log("Ошибка " + (error.message || error));
    });
  }
}

export default SubWorker;
