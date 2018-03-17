import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Uploader from './uploader';

const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB;

if (!indexedDB) {
  alert("Your browser doesn't support a stable version of IndexedDB. Please update your browser");
}

if (!window.Worker) {
  alert("Your browser doesn't support Web Worker. Please update your browser");
}

class UploaderProvider extends Component {
  uploader = null;

  componentDidMount = () => {
    if (window.Worker && indexedDB) {
      this.uploader = new Uploader({
        onProgress: this.props.onProgress, 
        onError:    this.props.onError,
        complete:   this.props.complete,
        ...this.props.params
      });
    }
  }
  
  getChildContext = () => {
    if (window.Worker && indexedDB) {
      return { 
        submit: this.submit,
        resume: this.resume,
        pause:  this.pause,
        stop:   this.stop,
      };
    } else {
      return { 
        submit: () => console.log('fileuploader did not initialized! Your browser does not support Web Worker or IndexedDB'),
        resume: () => console.log('fileuploader did not initialized! Your browser does not support Web Worker or IndexedDB'),
        pause:  () => console.log('fileuploader did not initialized! Your browser does not support Web Worker or IndexedDB'),
        stop:   () => console.log('fileuploader did not initialized! Your browser does not support Web Worker or IndexedDB'),
      }
    }
  }

  submit = (files, url) => {
    this.uploader.send(files, url);
  }

  resume = (index) => {
    return this.uploader.resume(index);
  }

  pause = (index) => {
    return this.uploader.pause(index);
  }

  stop = (index) => {
    return this.uploader.stop(index);
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
