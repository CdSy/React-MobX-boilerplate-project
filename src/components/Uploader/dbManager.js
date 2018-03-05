export default class DBManager {
  dbName = "uploadingFiles";
  storeName = "filesStore";

  connectDB = (func) => {
    const request = indexedDB.open(this.dbName, 1);

    request.onerror = this.logger;

    request.onsuccess = (event) => {
      func(event.target.result);
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      db.createObjectStore(this.storeName, {keyPath: "id"});
      this.connectDB(func);
    }
  }

  getFile = (file, func) => {
    this.connectDB((db) => {
      const request = db.transaction([this.storeName], "readonly").objectStore(this.storeName).get(file);

      request.onerror = this.logger;

      request.onsuccess = function(event){
        func(event.target.result ? event.target.result : -1);
      }
    });
  }

  getStorage = (func) => {
    this.connectDB((db) => {
      const rows = [];
      const store = db.transaction([this.storeName], "readonly").objectStore(this.storeName);
  
      if (store.mozGetAll) {
        store.mozGetAll().onsuccess = (event) => func(event.target.result);
      } else {
        store.openCursor().onsuccess = (event) => {
          const cursor = event.target.result;

          if (cursor) {
            rows.push(cursor.value);
            cursor.continue();
          } else {
            func(rows);
          }
        };
      }
    });
  }

  setFile = (file) => {
    this.connectDB((db) => {
      const request = db.transaction([this.storeName], "readwrite").objectStore(this.storeName).put(file);

      request.onerror = this.logerr;
      request.onsuccess = (event) => {
        return event.target.result;
      }
    });
  }
  
  delFile = (file) => {
    connectDB((db) => {
      const request = db.transaction([this.storeName], "readwrite").objectStore(this.storeName).delete(file);

      request.onerror = this.logerr;
      request.onsuccess = () => {
        console.log("File delete from DB:", file);
      }
    });
  }

  logger = (message) => {
    console.log(message);
  }
}
