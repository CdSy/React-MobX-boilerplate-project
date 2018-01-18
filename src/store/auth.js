import { observable, computed, action } from "mobx";
import auth0 from 'auth0-js';
import browserHistory from '../history';

class Auth {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable isAuth = false;
  
  auth0 = new auth0.WebAuth({
    domain: 'cdsy.auth0.com',
    clientID: '57iXOPluZRTg9DYHFQendB5tU7sTqIpe',
    redirectUri: 'http://localhost:3000/callback',
    audience: 'https://cdsy.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile user_metadata'
  });

  @action.bound
  login() {
    this.auth0.authorize();
  }

  @action.bound
  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.checkToken();
        this.rootStore.profileStore.getProfile();
        browserHistory.replace('/profile');
      } else if (err) {
        browserHistory.replace('/');
        console.log(err);
      }
    });
  }

  setSession(authResult) {
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());

    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  @action.bound
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    this.isAuth = false;
    browserHistory.replace('/');
  }

  @computed get isAuthenticated() {
    return this.isAuth;
  }

  @action.bound
  checkToken() {
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));

    this.isAuth = new Date().getTime() < expiresAt;

    if(this.isAuth === true) {
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  }
}

export default Auth;
