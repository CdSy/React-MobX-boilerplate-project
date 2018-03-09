import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import PropTypes from 'prop-types';
import Uploader from './Uploader';

@inject("uploaderStore")
@observer
class UploaderProvider extends Component {
  uploader = null;

  componentDidMount = () => {
    this.uploader = new Uploader({onProgress: this.onProgress, ...this.props.params});
  }
  
  getChildContext = () => {
    return { 
      submit: this.submit,
      resume: this.resume,
      pause: this.pause,
      stop: this.stop,
    };
  }

  submit = (files, url) => {
    this.uploader.send(files, url);
  }

  resume = (index) => {
    this.uploader.resume(index);
  }

  pause = (index) => {
    this.uploader.pause(index);
  }

  stop = (index) => {
    this.uploader.stop(index);
  }

  onProgress = (filesState) => {
    const { setChangedState } = this.props.uploaderStore;

    setChangedState(filesState);
  }

  render() {
    return (
      <React.Fragment>
        { this.props.children }
      </ React.Fragment>
    );
  }
}

UploaderProvider.wrappedComponent.childContextTypes = {
  submit: PropTypes.func.isRequired,
  resume: PropTypes.func.isRequired,
  pause: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
};

export function humanize(str) {
  return str
      .replace(/^[\s_]+|[\s_]+$/g, '')
      .replace(/[_\s]+/g, ' ')
      .replace(/^[a-z]/, function(m) { return m.toUpperCase(); });
}

export function getFileName(file) {
  const name = file.name.slice(0, file.name.indexOf('.'));

  return humanize(name);
}

export function getFileSize(file, decimalPoint) {
  const bytes = file.size;

  if(bytes === 0) return '0 Bytes';

  const k = 1000;
  const dm = decimalPoint || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function getFileFormat(file) {
  const format = (/[.]/.exec(file.name)) ? /[^.]+$/.exec(file.name) : "not identified";

  return format;
}

export default UploaderProvider;
