import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { inject, observer } from 'mobx-react';
import './style.css';

@inject("messagesStore")
@observer
class Notifications extends Component {
  count = 0;

  componentDidMount() {
    this.clearMessages();
  }

  clearMessages = () => {
    this.timeout = setTimeout(() => {
      const messages = this.props.messagesStore.messages;

      if (messages.length === 0) {
        clearTimeout(this.timeout);
        this.timeout = null;
      } else {
        this.props.messagesStore.removeMessage();
        this.clearMessages();
      }
    }, 5000);
  }

  removeMessage = (id) => {
    const { removeMessage } = this.props.messagesStore;

    removeMessage(id);
  }

  render() {
    const messages = this.props.messagesStore.messages;

    return (
      ReactDOM.createPortal(
        <Fragment>
          {
            messages.map((message, index) => {
              const style = {
                height: "100px",
                top: (index * (100 + 15)) + 15 + "px",
                left: "15px"
              };

              return (
                <div className="message-popover" key={message.identifier + index} style={style}>
                  {message.error.message}
                  <i className="fas fa-exclamation-circle error-icon"></i>
                  <div className="close-message" 
                       onClick={() => this.removeMessage(message.identifier)}>
                    <i className="fas fa-times icon"></i>
                  </div>
                </div>
              );
            })
          }
        </Fragment>,
        document.body
      )
    );
  }
}

export default Notifications;
