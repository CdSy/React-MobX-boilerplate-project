import SubWorker from './fileSender';
import DBManager from './dbManager';

const window = self;
const indexedDB = self.indexedDB || self.webkitIndexedDB || self.mozIndexedDB || self.OIndexedDB || self.msIndexedDB;
const IDBTransaction = self.IDBTransaction || self.webkitIDBTransaction || self.msIDBTransaction;
const IDBKeyRange = self.IDBKeyRange || self.webkitIDBKeyRange || self.msIDBKeyRange;

class WorkersManager {
  constructor() {
    this.subWorkers = {};
    this.DB = new DBManager();
    this.params = null;
    this.throttle = 1000;
    this.previousTime = Date.now();
    this.filesState = {};
    this.bindEvents();
  }

  bindEvents = () => {
    window.onmessage = this.onMessage;
  }

  postMessage = (data) => {
    window.postMessage(data);
  }

  onMessage = (message) => {
    this[message.data.event](message.data.payload);
  }

  initialize = () => {
    this.DB.getStorage((rows) => {
      const ids = rows.map((row) => row.id);
      
      rows.forEach((row) => {
        const id = row.id;

        this.subWorkers;
        this.subWorkers[id] = new SubWorker({onChange: this.onMessage, ...this.params}, row);
      });

      this.refreshUploadedFiles(ids);
    });
  }
  
  refreshUploadedFiles = (data) => {
    this.postMessage({payload: data, event: "refreshUploadedFiles"});
  }

  setFiles = (payload) => {
    const url = payload.url;
    
    payload.files.forEach((file) => {
      let params = {
        onChange: this.onMessage,
        ...this.params
      };

      if (url) {
        params = {...params, url: url};
      }

      this.DB.setFile(file);
      this.subWorkers[file.id] = new SubWorker(params, file);
    });
  }

  pauseUpload = (fileId) => {
    this.subWorkers[fileId].pause();
  }

  resumeUpload = (fileId) => {
    this.subWorkers[fileId].resume();
  }

  stopUpload = (fileId) => {
    this.subWorkers[fileId].stop();
  }

  deleteFile = (file) => {
    this.DB.delFile(file);
  }

  setParams = (params) => {
    this.params = params;
    this.throttle = this.params.mainThrottle || this.throttle;
    this.initialize();
  }

  onProgress = (data, force) => {
    this.filesState[data.fileId] = data;
    const filesArray = this.arrayFrom(this.filesState);
    const now = Date.now();
    
    if ((now - this.previousTime) >= this.throttle) {
      this.previousTime = now;
      this.postMessage({payload: filesArray, event: "onProgress"});
    }
    
    if (force) {
      this.postMessage({payload: filesArray, event: "onProgress"});
    }
  }

  onError = (error) => {
    this.postMessage({payload: error, event: "onError"});
  }

  closeFileSender = (data) => {
    this.postMessage({payload: data, event: "complete"});
    this.onProgress(data, true);
    this.deleteFile(data.fileId);

    delete this.subWorkers[data.fileId];
  }

  cancelFileSender = (data) => {
    delete this.filesState[data.fileId];
    const filesArray = this.arrayFrom(this.filesState);
    this.postMessage({payload: filesArray, event: "onProgress"});
    this.deleteFile(data.fileId);
    delete this.subWorkers[data.fileId];
  }

  arrayFrom = (obj) => {
    const array = [];

    for (let key in obj) {
      array.push(obj[key]);
    }

    return array;
  }
}

const Manager = new WorkersManager();
