import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { inject } from 'mobx-react';
import Settings from '../Settings';
import Callback from '../Callback';
import Home from '../Home';
import UserProfile from '../Profile';

@inject("auth")
class Main extends Component {
    render() {
        return (
            <Switch>
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
        );
    }
}

export default Main;