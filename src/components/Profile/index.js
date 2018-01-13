import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import './style.css';

@inject("userProfileStore")
@observer
class UserProfile extends Component {
  render() {
    return (
      <div>
      </div>
    );
  }
}

export default observer(UserProfile);