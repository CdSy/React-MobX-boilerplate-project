import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import List from '../List';
import Table from '../Table';

const Main = () => {
    return (
        <div>
            <Switch>
                <Route path='/list' component={List}/>
                <Route path='/table' component={Table}/>
            </Switch>
        </div>
    );
}

export default Main;