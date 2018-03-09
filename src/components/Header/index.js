import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import MenuButton from './MenuButton';
import UploadManager from './UploadManager';
import './style.css';
import './upload.css';

@inject("uiStore", "auth", "profileStore", "uploaderStore")
@observer
class Header extends Component {
  componentDidMount = () => {
    this.props.auth.checkToken()
    .then(() => this.props.profileStore.getProfile())
    .catch(() => console.log('no auth'));
  }
  
  login() {
    this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
  }

  render() {
    const files = this.props.uploaderStore.stateFiles;

    return (
      <header className="b-header">
        <MenuButton isActive={this.props.uiStore.menuIsOpen} clickHandler={this.props.uiStore.stateMenuToggle}/>
        <div className="button-wrapper">
          <UploadManager files={files}
                         openUploader={this.props.uiStore.openUploader}
                         isActive={this.props.uiStore.uploaderIsOpen}/>
        {
          !this.props.auth.isAuthenticated && (
            <Button
              bsStyle="primary"
              className="auth-btn"
              onClick={() => this.login()}
            >
              Log In
            </Button>
          )
        }
        {
          this.props.auth.isAuthenticated && (
            <div className="flex-container">
              <Link to="/profile">
                <div className="g-user-avatar small">
                  <img src={this.props.profileStore.form.picture} className="image" alt="avatar"/>
                </div>
              </Link>
              <Button
                bsStyle="primary"
                className="auth-btn"
                onClick={() => this.logout()}
              >
                Log Out
              </Button>
            </div>
          )
        }
        </div>
      </header>
    )
  }
}

export default Header;
