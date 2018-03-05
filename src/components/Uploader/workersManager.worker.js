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
    this.bindEvents();
    this.initialize();
  }

  bindEvents() {
    window.onmessage = this.onMessage;
  }

  initialize() {
    this.DB.getStorage((rows) => {
      const ids = rows.map((row) => row.id);

      this.refreshUploadedFiles(ids);
    });
  }

  postMessage = (data) => {
    window.postMessage(data);
  }

  onMessage = (message) => {
    this[message.data.event](message.data.payload);
  }
  
  refreshUploadedFiles = (data) => {
    this.postMessage({payload: data, event: "refreshUploadedFiles"});
  }

  setFiles = (files) => {
    files.forEach((file) => {
      const fileId = sha1(file.name + '-' + file.size + '-' + +file.lastModifiedDate);

      this.DB.setFile({id: fileId, data: file});
    });
  }
}

const Manager = new WorkersManager();
