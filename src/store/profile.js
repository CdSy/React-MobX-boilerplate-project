import { observable, computed, action, toJS } from "mobx";
import Validator from 'validatorjs';

export default class ProfileStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable
  form = {
    picture: null,
    fields: {
      name: {
        value: '',
        error: null,
        rule: 'required'
      },
      email: {
        value: '',
        error: null,
        rule: 'required|email'
      }
    },
    meta: {
      isValid: true,
      isChange: false,
      error: null,
    },
  };

  getFlattenedValues = (valueKey = 'value') => {
    let data = {};
    let form = toJS(this.form).fields;

    for (let key in form) {
      data[key] = form[key][valueKey];
    }

    return data;
  };

  @action.bound
  onSubmit() {
    this.form.meta.isChange = false;
    console.log('sumbit_form_success');
  }

  @action.bound
  onFieldChange = (field, value) => {
    this.form.fields[field].value = value;

    const validation = new Validator(
      this.getFlattenedValues('value'),
      this.getFlattenedValues('rule'));

    this.form.meta.isValid = validation.passes();
    this.form.meta.isChange = true;
    this.form.fields[field].error = validation.errors.first(field);
  };

  @computed get formData() {
    return this.form;
  }

  getAccessToken() {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      throw new Error('No access token found');
    }

    return accessToken;
  }

  @action.bound
  getProfile() {
    if (!!this.form.picture) {
      return;
    }

    let accessToken = this.getAccessToken();

    this.rootStore.auth.auth0.client.userInfo(accessToken, action("GET_PROFILE_SUCCESS", (err, profile) => {
      if (profile) {
        const {name: email, nickname: name, picture } = profile;

        this.form.fields.name.value = name;
        this.form.fields.email.value = email;
        this.form.picture = picture;
      }
    }));
  }
}