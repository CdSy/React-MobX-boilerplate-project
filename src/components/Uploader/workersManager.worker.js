import sha1 from 'sha1';

const window = self;
// window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
// IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction;

class WorkersManager {
  constructor() {
    this.subWorkers = {};
    this.bindEvents();
    this.initialize();
  }

  bindEvents() {
    window.onmessage = this.onMessage;
  }

  initialize() {
  }

  postMessage = (data) => {
    window.postMessage(data);
  }

  refreshUploadedFiles = (data) => {
    this.postMessage({payload: data, event: "refreshUploadedFiles"});
  }

  onMessage = (event) => {
    const data = event.data.map((file) => {
      const fileId = sha1(file.name + '-' + file.size + '-' + +file.lastModifiedDate);

      return fileId;
    });

    this.refreshUploadedFiles(data);
  }
}

const Manager = new WorkersManager();
