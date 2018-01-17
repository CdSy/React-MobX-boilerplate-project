import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import Fade from '../AnimatedWrapper';
import './style.css';

@inject("uiStore")
@observer
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { in: true };
  }
  
  componentWillUnmount() {
    this.setState({in: false});
  }

  render() {
    return (
        <div className="g-card-content">
          <div className="main-title">HELLO WORLD!</div>
        </div>
    );
  }
}

export default Home; 
