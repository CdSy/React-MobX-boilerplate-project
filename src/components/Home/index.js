import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import './style.css';

@inject("uiStore")
@observer
class Home extends Component {
  render() {
    return (
        <div className="g-card-content">
          <div className="main-title">HELLO WORLD!</div>
        </div>
    );
  }
}

export default Home; 
