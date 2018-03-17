import React, { Component } from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Menu from './components/Menu';
import Uploader from './components/Uploader';
import Notifications from './components/Notifications';

class App extends Component {
  componentWillMount = () => {
    document.body.classList.add('light');
  }
  
  render() {
    const params = {
      chunkSize: 5 * 1024 * 1024,
      maxConnectionAttempts: 3,
      fileThrottle: 300,
      mainThrottle: 300,
      url: 'ws://localhost:5000/upload',
      events: {
        GET_LAST_CHUNK: 'get-last-chunk',
        SEND_NEXT_CHUNK: 'send-next-chunk',
        SEND_NEXT_CHUNK_SUCCESS: 'send-next-chunk-successful',
        SEND_FILE_SUCCESS: 'send-file-successful',
        CANCEL_UPLOAD: 'cancel-upload',
        SEND_CHUNK_AGAIN: 'send-chunk-again',
      }
    };

    return (
      <Uploader params={params}>
        <div className="App">
          <Notifications/>
          <Header/>
          <div className="app-body">
            <Menu/>
            <Main/>
          </div>
        </div>
      </Uploader>
    );
  }
}

export default App;
