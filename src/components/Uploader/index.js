import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import Provider from './provider';

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

  render() {
    return (
      <Provider {...this.props} onProgress={this.onProgress} onError={this.onError}/>
    );
  }
}

export default UploaderWrapper;
