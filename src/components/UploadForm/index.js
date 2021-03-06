import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import UploadedFile from './UploadedFile';
import {uploaderContext} from 'react-file-uploader';
import './style.css';

@uploaderContext
@inject("uploaderStore")
@observer
class UploadForm extends Component {
  url = 'ws://localhost:5000/upload';
  state = {
    isValid: false,
    displayError: false
  }

  onChange = (event) => {
    if (event.target.files.length === 0) {
      this.setState({isValid: false});
    } else {
      this.setState({isValid: true, displayError: false});
    }
    
    this.props.uploaderStore.uploadFiles(event.target.files);
    event.target.value = null;
  }

  render() {
    const { submit } = this.props;
    const { displayError } = this.state;
    const { removeFile } = this.props.uploaderStore;
    const uploadedFiles = this.props.uploaderStore.uploadedFiles;
    const filesCount = uploadedFiles.length;

    return (
      <div className="g-card-content">
        <div className="g-page-title">Upload your files</div>
        <form className="upload-form">
          <label className="file-input-wrapper">
            Selected files on your computer

            <input
              type="file"
              className="file-input" 
              name="fileuploader"
              onChange={this.onChange}
              multiple/>

            { displayError && <div className="error-text">Please choose files</div> }
          </label>
          
          {filesCount > 0 && 
            <div className="files-wrapper">
              {uploadedFiles.map((file) => {
                return (
                  <UploadedFile key={file.size} file={file} removeFile={removeFile}/>
                )
              })}
            </div>
          }

          <button className="submit-button"  
                  onClick={(event) => {
                    event.preventDefault();

                    if (this.state.isValid === false) {
                      this.setState({displayError: true});

                      return;
                    }

                    submit(uploadedFiles, this.url);
                  }}>
            Upload
          </button>
        </form>
      </div>
    );
  }
}

export default UploadForm;
