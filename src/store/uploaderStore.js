import { observable, computed, action, toJS } from "mobx";

export class File {
  constructor(source) {
    this.name = source.name;
    this.lastModified = source.lastModified;
    this.size = source.size;
    this.type = source.type;
  }
}

export default class UploaderStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable 
  state = {
    uploadedFiles: [],
    filesState: []
  }

  @computed
  get uploadedFiles() {
    return toJS(this.state.uploadedFiles);
  }

  @action
  removeFile = (file) => {
    const index = this.state.uploadedFiles.indexOf(file);

    this.state.uploadedFiles.splice(index, 1);
  }

  @action
  uploadFiles = (files) => {
    console.log(files, 'store');
    this.state.uploadedFiles = [...new Set(files)];
  }

  @action
  setChangedState = (changedFileList) => {
    this.state.filesState = [...changedFileList.map((file) => new File(file))];
  }
}