import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Settings from '../Settings';
import Callback from '../Callback';
import Home from '../Home';
// import Profile from '../Profile';

const Main = () => {
    return (
        <div className="p-content-section">
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route path='/settings' component={Settings}/>
                <Route path='/callback' component={Callback}/>
            </Switch>
        </div>
    );
}

export default Main;