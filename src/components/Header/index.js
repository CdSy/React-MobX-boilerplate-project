import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'react-bootstrap';
import MenuButton from './MenuButton';
import './style.css';

@inject("uiStore", "auth")
@observer
class Header extends Component {
  componentDidMount = () => {
    this.props.auth.checkToken();
  }
  
  login() {
    this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
  }

  render() {
    return (
      <header className="b-header">
        <MenuButton isActive={this.props.uiStore.menuIsOpen} clickHandler={this.props.uiStore.stateMenuToggle}/>
        <div>
        {
          !this.props.auth.isAuthenticated && (
            <Button
              bsStyle="primary"
              className="btn-margin"
              onClick={() => this.login()}
            >
              Log In
            </Button>
          )
        }
        {
          this.props.auth.isAuthenticated && (
            <Button
              bsStyle="primary"
              className="btn-margin"
              onClick={() => this.logout()}
            >
              Log Out
            </Button>
          )
        }
        </div>
      </header>
    )
  }
}

export default Header;