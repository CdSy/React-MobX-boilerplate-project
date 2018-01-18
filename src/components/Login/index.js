import React, { Component } from 'react';
import Modal from 'react-modal';
import { Button } from 'react-bootstrap';
import { observer, inject } from "mobx-react";

@inject("auth", "uiStore", "routing")
@observer
class Login extends Component {
  constructor() {
    super();
    this.closeModal = this.closeModal.bind(this);
  }

  componentWillMount() {
    this.props.uiStore.openModal("loginModal");
  }

  afterOpenModal() {
    console.log('modal is open!');
  }

  closeModal() {
    this.props.uiStore.closeModal("loginModal");
    this.props.routing.history.push("/");
  }

  login() {
    this.props.auth.login();
  }

  render() {
    const { isOpen } = this.props.uiStore.loginModal;

    const customStyles = {
      content : {
        position                   : 'relative',
        top                        : 'auto',
        left                       : 'auto',
        right                      : 'auto',
        bottom                     : 'auto',
        overflow                   : 'auto',
        WebkitOverflowScrolling    : 'touch'
      }
    };

    const closeButtonStyle = {
      position: "absolute",
      right: "10px",
      top: "10px"
    };

    const iconStyle = {
      width: "1.6em",
      height: "1.6em",
      color: "orange",
      cursor: "pointer"
    };

    return (
      <div>
        <Modal
          isOpen={isOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Log in"
        >

          <h2>Log In</h2>
          <div className="modal-close" style={closeButtonStyle} onClick={this.closeModal}>
          <i className="far fa-times-circle" style={iconStyle}></i>
          </div>
          <Button
            bsStyle="primary"
            className="auth-btn"
            onClick={() => this.login()}
          >
            Log In
          </Button>
        </Modal>
      </div>
    );
  }
}

export default Login;