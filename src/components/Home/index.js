import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import animateTransition from '../AnimatedWrapper';
import './style.css';

@animateTransition
@inject("uiStore")
@observer
class Home extends Component {
  render() {
    return (
      <div className="p-home p-content-section">
        <div className="main-title">HELLO WORLD!</div>
      </div>
    );
  }
}

export default Home; 
