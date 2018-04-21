import { browserHistory } from 'react-router';

module.exports = {

    path: '/index',

    getChildRoutes(partialNextState, cb) {
        require.ensure([], (require) => {
            cb(null, [
                require('./User'),
                require('./Product')
            ])
        })
    },
    onEnter() {
        if (!localStorage.getItem('userData')) {
            browserHistory.push('/login');
        }
    },
    indexRoute: {
        component: require('COMPONENTS/Content/User').default
    },

    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('CONTAINER/Container/Main').default)
        })
    }

}