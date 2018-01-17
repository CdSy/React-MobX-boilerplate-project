import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { inject } from 'mobx-react';
import Settings from '../Settings';
import Callback from '../Callback';
import Home from '../Home';
import UserProfile from '../Profile';
import { TransitionGroup } from 'react-transition-group';
import { CSSTransition } from 'react-transition-group';

@inject("auth", "routing")
class Main extends Component {
    render() {
        const currentKey = this.props.routing.location.pathname.split('/')[1] || '/';
        const timeout = { enter: 700, exit: 300 };

        return (
            <TransitionGroup className='p-content-section' component="main" >
                <CSSTransition key={currentKey} timeout={timeout} classNames="Fade">
                <Switch location={this.props.routing.location}>
                    <Route exact path='/' component={Home}/>
                    <Route path="/profile" render={(props) => (
                        !this.props.auth.isAuthenticated ? (
                        <Redirect to="/"/>
                        ) : (
                        <UserProfile {...props} />
                        )
                    )} />
                    <Route path='/settings' component={Settings}/>
                    <Route path='/callback' component={Callback}/>
                </Switch>
                </CSSTransition>
            </TransitionGroup>
        );
    }
}

export default Main;