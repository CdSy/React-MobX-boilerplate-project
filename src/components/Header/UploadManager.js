import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import FileManager from './FileManager';
import {uploaderContext} from 'react-file-uploader';

@uploaderContext
@observer
class UploadManager extends Component {
  constructor(props) {
    super(props);          
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  state = {
    chosenFile: null
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  componentDidUpdate() {
    if (this.state.chosenFile === null && this.props.files.length > 0) {
      this.setState({chosenFile: this.props.files[0].fileId});
    }
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.openUploader(false);
    }
  }
  
  chooseFile = (index) => {
    this.setState({chosenFile: index});
  }

  stop = (fileId) => {
    console.log("stop");
    return this.props.stop(fileId);
  }

  pause = (fileId) => {
    console.log("pause");
    return this.props.pause(fileId);
  }

  start = (fileId) => {
    console.log("start");
    return this.props.resume(fileId);
  }

  getChosenFileProgress = (files) => {
    const index = files.findIndex((file) => file.fileId === this.state.chosenFile);

    if (index === -1) {
      return 0;
    }

    return ~~(files[index].progress);
  }

  render() {
    const { files, isActive, openUploader } = this.props;
    const chosenFile = this.state.chosenFile;
    const mainBarProgress = files.length > 0 ? this.getChosenFileProgress(files) : 0;

    return (
      <div className={`b-uploader ${isActive ? 'active' : 'deactivate'}`} 
           onClick={openUploader}
           ref={(node) => this.wrapperRef = node}>
        <div className="ko-progress-circle" data-progress={mainBarProgress}>
          <div className="ko-circle">
            <div className="full ko-progress-circle__slice">
              <div className="ko-progress-circle__fill"></div>
            </div>
            <div className="ko-progress-circle__slice">
              <div className="ko-progress-circle__fill"></div>
              <div className="ko-progress-circle__fill ko-progress-circle__bar"></div>
            </div>
          </div>
          <div className="ko-progress-circle__overlay"><i className="fas fa-cloud-upload-alt"></i></div>
        </div>
        
        {files.length > 0 && 
          <div className="file-list">
            {files.map((file, index) => {
              const isActive = chosenFile === file.fileId;

              return (
                <FileManager
                  file={file}
                  key={file.fileId}
                  isActive={isActive}
                  pause={this.pause}
                  start={this.start}
                  stop={this.stop}
                  chooseFile={this.chooseFile} />
              );
            })}
          </div>
        }
      </div>
    );
  }
}

UploadManager.propTypes = {
  files: PropTypes.array,
  isActive: PropTypes.bool,
  openUploader: PropTypes.func
};

export default UploadManager;
