// @flow
import { Platform } from 'react-native';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import firebase from 'react-native-firebase';
import { getFirebase, reactReduxFirebase } from 'react-redux-firebase';
import { composeWithDevTools } from 'remote-redux-devtools';
import reducers from './reducers/index';

const reactFirebaseConfig = {
    attachAuthIsReady: true,
    enableRedirectHandling: false,
    userProfile: 'users',
};

const composeEnhancers = composeWithDevTools({
    name: Platform.OS,
    hostname: 'localhost',
    port: 5678,
    realtime: true,
});

// the initial state argument is only used for jest
export const store = (initialState?: {} = {}) => createStore(
    reducers,
    initialState,
    composeEnhancers(
        applyMiddleware(thunkMiddleware.withExtraArgument(getFirebase)),
        reactReduxFirebase(firebase, reactFirebaseConfig),
    ),
);

export default function setupStore() {
    return store();
}
