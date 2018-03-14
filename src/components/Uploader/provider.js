import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Uploader from './uploader';

class UploaderProvider extends Component {
  uploader = null;

  componentDidMount = () => {
    this.uploader = new Uploader({
      onProgress: this.onProgress, 
      onError:    this.onError, 
      ...this.props.params
    });
  }
  
  getChildContext = () => {
    return { 
      submit: this.submit,
      resume: this.resume,
      pause:  this.pause,
      stop:   this.stop,
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

  onError = (error) => {
    const { onError = () => {}} = this.props;
    
    onError(error);
  }

  onProgress = (filesState) => {
    const { onProgress } = this.props;

    onProgress(filesState);
  }

  render() {
    return (
      <React.Fragment>
        { this.props.children }
      </ React.Fragment>
    );
  }
}

UploaderProvider.childContextTypes = {
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

export function getFileName(originName) {
  const name = originName.replace(/\.[^/.]+$/, "");

  return humanize(name);
}

export function getFileSize(bytesSize, decimalPoint) {
  const bytes = bytesSize;

  if(bytes === 0) return '0 Bytes';

  const k = 1000;
  const dm = decimalPoint || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function getFileFormat(name) {
  const format = (/[.]/.exec(name)) ? /[^.]+$/.exec(name) : "not identified";

  return format;
}

export function hashCode(str) {
  let hash = 0;

  if (str.length === 0) {
    return hash;
  }

  for (let i = 0; i < str.length; ++i) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  return hash + "";
}

export default UploaderProvider;
