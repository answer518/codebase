import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import createLogger from 'redux-logger';
import reducers  from '../../redux/reducer/index.js';

import './index.css';

const logger = createLogger();
const store = createStore(
    reducers,
    applyMiddleware(logger)
);

const rootRoute = {
	childRoutes: [{
        path: '/',
        component: require('LAYOUTS/pages').default,
        indexRoute: {
            // component: require('LAYOUTS/Container/Login').default
        },
        childRoutes: [
            // require('ROUTES/Login'),
            // require('ROUTES/Main')
        ]
    }]
}

class Root extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Router history={browserHistory} routes={rootRoute} />
            </Provider>
        );
    }
}

export default Root;