import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import {getFileSize, getFileName} from 'react-file-uploader';

@observer
class FileManager extends Component {
  state = {
    active: true
  };
  
  changeState = () => {
    const { file: { fileId }, pause, start } = this.props;
    let actionSuccessful;
    
    if (this.state.active) {
      actionSuccessful = pause(fileId);
    } else {
      actionSuccessful = start(fileId);
    }

    if (actionSuccessful) {
      this.setState({active: !this.state.active});
    }
  }

  renderControl = () => {
    const isActive = this.state.active;

    if (isActive) {
      return (
        <React.Fragment>
          <div className="icon"
               style={{display: "block"}}
               onClick={this.changeState}>
               <i className="fas fa-pause"></i>
          </div>
          <div className="icon"
               style={{display: "none"}}
               onClick={this.changeState}>
               <i className="fas fa-play"></i>
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
        <div className="icon"
             style={{display: "none"}}
             onClick={this.changeState}>
             <i className="fas fa-pause"></i>
        </div>
        <div className="icon"
             style={{display: "block"}}
             onClick={this.changeState}>
             <i className="fas fa-play"></i>
        </div>
      </React.Fragment>
      );
    }
  }

  render() {
    const { file, stop, chooseFile, isActive } = this.props;
    const { name, isFinal, size, passedBytes } = file;
    const progress = ~~(file.progress);

    return (
      <div className={`file-body ${isActive ? "active" : ""}`} onClick={(event) => {
          event.stopPropagation();
          chooseFile(file.fileId);
        }}>
        <div className="info">
          <div className="file-name">{getFileName(name)}</div>
          <div className="percent">{progress}%</div>

          {isFinal ? (
              <div className="successful-text">file uploaded successfully</div>
            ) : (
              <div className="file-progress">
                <div className="amount">{`${getFileSize(passedBytes)}/${getFileSize(size)}`}</div>
                <div className="inner-bar" style={{transform: `translateX(-${100 - progress}%)`}}></div>
              </div>
            )
          }

        </div>
        <div className="controls">
          {isFinal ? (
              ""
            ) : (
              <React.Fragment>
                {this.renderControl()}
                <div className="icon" onClick={() => stop(file.fileId)}><i className="fas fa-times"></i></div>
              </React.Fragment>
            )
          }
        </div>
      </div>
    );
  }
}

FileManager.propTypes = {
  file: PropTypes.object,
  isActive: PropTypes.bool,
  pause: PropTypes.func,
  start: PropTypes.func,
  stop: PropTypes.func,
  chooseFile: PropTypes.func,
};

export default FileManager;
