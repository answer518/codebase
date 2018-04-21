import React from 'react';

import ReactDOM from 'react-dom';

import { createStore, applyMiddleware } from 'redux';

import { Provider } from 'react-redux';

import { Router, browserHistory } from 'react-router';

import createLogger from 'redux-logger';

import reducers from '../../redux/reducers/index.js';

import 'antd/dist/antd.css';

import './global.scss';

import { notification } from 'antd';

const logger = createLogger();

const store = createStore(
    reducers,
    applyMiddleware(logger)
);

notification.config({
    top: 45
});
const rootRoute = {
    childRoutes: [{
        path: '/',
        component: require('CONTAINER/Container').default,
        indexRoute: {
            component: require('CONTAINER/Container/Login').default
        },
        childRoutes: [
            require('ROUTES/Login'),
            require('ROUTES/Main')
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
