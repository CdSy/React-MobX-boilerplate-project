import React, { Component } from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Menu from './components/Menu';

class App extends Component {
  componentWillMount = () => {
    document.body.classList.add('light');
  }
  
  render() {
    return (
      <div className="App">
        <Header/>
        <div className="app-body">
          <Menu/>
          <Main/>
        </div>
      </div>
    );
  }
}

export default App;