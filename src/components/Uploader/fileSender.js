class SubWorker {
  constructor({ onChange, ...params}) {
    const defaultParams = {
      chunkSize: 1 * 1024 * 1024,
    };

    this.onMessage = onChange;
    this.file = null;
    this.params = {...defaultParams, ...params};
    this.BYTES_PER_CHUNK = this.params.chunkSize;
    this.start = 0;
    this.end = this.BYTES_PER_CHUNK;
    console.log(this.BYTES_PER_CHUNK, 'chunkSize');
  }

  postMessage = (message) => {
    this[message.event](message.payload);
  }

  uploadFile = (file) => {
    this.file = file;
    this.onMessage({data: {payload: [{id: file.id, name: file.name, progress: 80}], event: "onProgress"}});
  }
}

export default SubWorker;