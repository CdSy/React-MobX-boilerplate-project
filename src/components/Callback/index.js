import React, { Component } from 'react';
import { inject } from 'mobx-react';
import loading from './loading.svg';

@inject("routing", "auth")
class Callback extends Component {
  componentDidMount = () => {
    if (/access_token|id_token|error/.test(this.props.routing.location.hash)) {
      this.props.auth.handleAuthentication();
    }
  }
    
  render() {
    const iconStyle = {
      width: '100px',
      height: '100px'
    };

    const wrapperStyle = {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#e74c3c',
      zIndex: '100'
    }

    return (
      <div style={wrapperStyle}>
        <img style={iconStyle} src={loading} alt="loading"/>
      </div>
    );
  }
}

export default Callback;