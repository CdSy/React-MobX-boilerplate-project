import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import browserHistory from './history';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';

import './styles/index.css';
import 'normalize.css/normalize.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import registerServiceWorker from './registerServiceWorker';
import App from './App';
import RootStore from './store';

const routingStore = new RouterStore();
const history = syncHistoryWithStore(browserHistory, routingStore);

const stores = {
    routing: routingStore,
    ...new RootStore()
};


ReactDOM.render(
    <Provider {...stores}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
