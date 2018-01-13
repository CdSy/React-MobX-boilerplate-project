import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Settings from '../Settings';
// import Profile from '../Profile';

const Main = () => {
    return (
        <div className="p-content-section">
            <Switch>
                <Route path='/settings' component={Settings}/>
            </Switch>
        </div>
    );
}

export default Main;