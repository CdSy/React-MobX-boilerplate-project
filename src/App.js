import React, { Component } from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Menu from './components/Menu';
import Uploader from './components/Uploader';

class App extends Component {
  componentWillMount = () => {
    document.body.classList.add('light');
  }
  
  render() {
    const params = {
      chunkSize: 1 * 1024 * 1024,
    };

    return (
      <Uploader params={params}>
        <div className="App">
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
