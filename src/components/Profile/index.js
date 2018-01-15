import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import FormInput from './FormInput';
import './style.css';

@inject("profileStore")
@observer
class UserProfile extends Component {
  defaultPicture = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=blank&f=y';

  componentDidMount() {
    this.props.profileStore.getProfile();
  }

  submit = (event) => {
    event.preventDefault();
    this.props.profileStore.onSubmit();
  }

  render() {
    const {form, onFieldChange} = this.props.profileStore;
    const {fields, meta, picture} = form;

    return (
      <div className="p-pofile-page">
        <div className="g-page-title">Profile</div>
        <div className="b-pofile-info">
          <div className="g-user-avatar">
            <img src={picture || this.defaultPicture} className="image" alt="avatar"/>
          </div>
          <form className="form-wrapper" onSubmit={this.submit}>
            <FormInput type="email"
                       name="email"
                       value={fields.email.value}
                       error={fields.email.error}
                       onChange={onFieldChange}
                       placeholder="your email"/>
            <FormInput type="text"
                       name="name"
                       value={fields.name.value}
                       error={fields.name.error}
                       onChange={onFieldChange}
                       placeholder="your name"/>

            {meta.error && <div className="error-message"> {meta.error} </div>}

            <input disabled={!meta.isValid}
                   className={classNames("g-submit-button", {"hide": !meta.isChange, "disabled": !meta.isValid})}
                   value="Save"
                   type="submit"/>
          </form>
        </div>
      </div>
    );
  }
}

export default UserProfile;