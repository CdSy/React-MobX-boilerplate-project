import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { CSSTransition } from 'react-transition-group';
import { inject } from 'mobx-react';
import Settings from '../Settings';
import Callback from '../Callback';
import Home from '../Home';
import UserProfile from '../Profile';
import Statistics from '../Statistics';
import Login from '../Login';
import Employees from '../Employees';
import Slider from '../Slider';
import UploadForm from '../UploadForm';

const AnimatedRedirect = (props) => {
  return (
    <div className="redirect-wrapper">
      <Redirect {...props} />
    </div>
  )
}

@inject("auth", "routing")
class Main extends Component {
  render() {
    const currentKey = this.props.routing.location.pathname.split('/')[1] || '/';
    const timeout = { enter: 700, exit: 300 };

    return (
      <TransitionGroup className='p-content-section' component="main" >
        <CSSTransition key={currentKey} timeout={timeout} classNames="Fade">
          <Switch location={this.props.routing.location}>
            <Route exact path='/' component={Home} />
            <Route path="/profile" render={(props) => (
              !this.props.auth.isAuthenticated ? (
                <AnimatedRedirect to="/login" />
              ) : (
                  <UserProfile {...props} />
                )
            )} />
            <Route path='/statistics' component={Statistics} />
            <Route path='/settings' component={Settings} />
            <Route path='/employees' component={Employees} />
            <Route path='/gallery' component={Slider} />
            <Route path='/upload' component={UploadForm} />
            <Route path='/login' component={Login} />
            <Route path='/callback' component={Callback} />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    );
  }
}

export default Main;
