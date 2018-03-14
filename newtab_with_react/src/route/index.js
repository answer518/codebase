import React from 'react';
import {
    Router,
    Route,
    Switch
} from 'react-router-dom';
import Loadable from 'react-loadable'
import Index from '../components/home/index'
import Page1 from '../components/page/page1'
import history from '../components/public/history';

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (
            <Router  history={history}>
                <div className="contents">
                    {/**
                     * 这里可以公共的样式,比如 头部, 尾部, 等.
                     */
                    }
                    <Switch>
                        <Index />
                    </Switch>
                </div>
            </Router>
        );
    }
}
export default App;