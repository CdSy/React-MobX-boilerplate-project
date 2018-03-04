import React from 'react';
import { getFileSize, getFileName, getFileFormat } from '../Uploader';

const UploadedFile = (props) => {
  const { removeFile, file } = props;

  return (
    <div className="file-item">
      <div className="name">{ getFileName(file) }</div>
      <div>
        <div className="size">format: { getFileFormat(file) }</div>
        <div className="size">size: { getFileSize(file) }</div>
      </div>
      <div className="remove" onClick={() => removeFile(file)}>
        <i className="fas fa-trash-alt"></i>
      </div>
    </div>
  );
}

export default UploadedFile;
