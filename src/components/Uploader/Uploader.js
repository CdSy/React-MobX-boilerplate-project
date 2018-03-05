import Worker from './workersManager.worker.js';
import sha1 from 'sha1';

export class File {
  constructor(source) {
    this.name = source.name;
    this.lastModified = source.lastModified;
    this.size = source.size;
    this.type = source.type;
  }
}

class Uploader {
  constructor() {
    this.state.workerManager = new Worker();
    this.state.workerManager.onmessage = this.onMessage;
  }

  state = {
    uploadedFiles: [],
    stateFiles: [],
    workerManager: null
  };

  start = () => {}

  pause = () => {}

  stop = () => {}

  send = (files) => {
    const post = [];

    files.forEach((file) => {
      const fileId = sha1(file.name + '-' + file.size + '-' + +file.lastModifiedDate);
      const isContain = this.state.uploadedFiles.findIndex((identifier) => identifier === fileId);

      if (isContain === -1) {
        this.state.uploadedFiles.push(fileId);
        post.push(file);
      }
    });

    (post.length && this.postMessage({payload: post, event: 'setFiles'}));
  }

  postMessage = (data) => {
    this.state.workerManager.postMessage(data);
  }

  onMessage = (message) => {
    this[message.data.event](message.data.payload);
  }

  refreshUploadedFiles(hashArray) {
    this.state.uploadedFiles = [...new Set([...this.state.uploadedFiles, ...hashArray])];

    console.log(this.state.uploadedFiles, "uploaded");
  }
}

export default Uploader;
