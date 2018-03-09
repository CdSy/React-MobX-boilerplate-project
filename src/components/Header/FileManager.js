import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

@observer
class FileManager extends Component {
  state = {
    active: true
  };
  
  changeState = () => {
    const { file: { fileId }, pause, start } = this.props;
    
    if (this.state.active) {
      pause(fileId);
    } else {
      start(fileId);
    }

    this.setState({active: !this.state.active});
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
    const { name } = file;
    const progress = ~~(file.progress);
    console.log(this.state.active);

    return (
      <div className={`file-body ${isActive ? "active" : ""}`} onClick={(event) => {
          event.stopPropagation();
          chooseFile(file.fileId);
        }}>
        <div className="info">
          <div className="file-name">{name}</div>
          <div className="file-progress">
            <div className="inner-bar" style={{transform: `translateX(-${100 - progress}%)`}}></div>
          </div>
        </div>
        <div className="controls">
          { this.renderControl() }
          <div className="icon" onClick={() => stop(file.fileId)}><i className="fas fa-times"></i></div>
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
