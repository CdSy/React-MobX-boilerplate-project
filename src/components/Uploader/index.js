import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import {UploaderProvider} from 'react-file-uploader';

@inject("uploaderStore", "messagesStore")
@observer
class UploaderWrapper extends Component {
  onProgress = (filesState) => {
    const { setChangedState } = this.props.uploaderStore;

    setChangedState(filesState);
  }

  onError = (error) => {
    const { setMessage } = this.props.messagesStore;

    setMessage(error);
  }

  complete = (file) => {
    console.log(file.name + 'is completed');
  }

  render() {
    return (
      <UploaderProvider {...this.props} 
                onProgress={this.onProgress} 
                onError={this.onError} 
                complete={this.complete}/>
    );
  }
}

export default UploaderWrapper;
