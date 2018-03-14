import Worker from './workersManager.worker.js';
import crc32 from 'crc32';

class Uploader {
  constructor({onProgress, onError, ...params}) {
    this.state.workerManager = new Worker();
    this.state.workerManager.onmessage = this.onMessage;
    this.postMessage({payload: params, event: 'setParams'});
    this.onProgress = onProgress;
    this.onError = onError;
  }

  state = {
    uploadedFiles: [],
    workerManager: null
  };

  resume = (fileId) => {
    this.postMessage({payload: fileId, event: 'resumeUpload'});
  }

  pause = (fileId) => {
    this.postMessage({payload: fileId, event: 'pauseUpload'});
  }

  stop = (fileId) => {
    this.postMessage({payload: fileId, event: 'stopUpload'});
  }

  send = (files, url) => {
    const post = [];

    files.forEach((file) => {
      const fileId = crc32(file.name + '-' + file.size + '-' + +file.lastModified);
      const isContain = this.state.uploadedFiles.findIndex((identifier) => identifier === fileId);

      if (isContain === -1) {
        this.state.uploadedFiles.push(fileId);
        post.push({id: fileId, data: file});
      }
    });

    (post.length && this.postMessage({
      payload: {
        files: post,
        url: url
      },
      event: 'setFiles'
    }));
  }

  postMessage = (data) => {
    this.state.workerManager.postMessage(data);
  }

  onMessage = (message) => {
    this[message.data.event](message.data.payload);
  }

  refreshUploadedFiles(hashArray) {
    this.state.uploadedFiles = [...new Set([...this.state.uploadedFiles, ...hashArray])];
  }
}

export default Uploader;
