import SubWorker from './fileSender';
import sha1 from 'sha1';
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
    this.stateFiles = {};
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
        // this.subWorkers[id].postMessage({payload: payload, event: 'uploadFile'});
      });

      this.refreshUploadedFiles(ids);
    });
  }
  
  refreshUploadedFiles = (data) => {
    this.postMessage({payload: data, event: "refreshUploadedFiles"});
  }

  setFiles = (files) => {
    files.forEach((file) => {
      const fileId = sha1(file.name + '-' + file.size + '-' + +file.lastModified);

      this.DB.setFile({id: fileId, data: file, currentChunk: 0});
    });
  }

  putFile = (file) => {

  }

  deleteFile = (file) => {
    this.DB.delFile(file);
  }

  setParams = (params) => {
    this.params = params;
    this.initialize();
  }

  onProgress = (data) => {
    this.stateFiles[data.id] = data;
    const filesArray = this.arrayFrom(this.changeIdKey(this.stateFiles));

    this.DB.putFile({id: data.id, currentChunk: data.currentChunk});
    this.postMessage({payload: filesArray, event: "onProgress"});
  }

  closeFileSender = (data) => {
    this.onProgress(data);
    this.deleteFile(data.id);

    delete this.subWorkers[data.id];
  }

  changeIdKey = (files) => {
    for (let key in files) {
      const {id, ...keys} = files[key];

      files[key] = {fileId: id, ...keys}; 
    }

    return files;
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
