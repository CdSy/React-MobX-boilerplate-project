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
        this.subWorkers[id] = new SubWorker({onChange: this.onMessage, ...this.params});
        this.subWorkers[id].postMessage({payload: row, event: 'uploadFile'});
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

      this.DB.setFile({id: fileId, data: file});
    });
  }

  setParams = (params) => {
    this.params = params;
    this.initialize();
  }

  onProgress = (data) => {
    this.postMessage({payload: data, event: "onProgress"});
  }
}

const Manager = new WorkersManager();
