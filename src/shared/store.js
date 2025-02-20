// @flow
import { Platform } from 'react-native';
import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import firebase from 'react-native-firebase';
import { getFirebase, reactReduxFirebase } from 'react-redux-firebase';
import { composeWithDevTools } from 'remote-redux-devtools';
import AsyncStorage from '@react-native-community/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import reducers from './reducers/index';

const reactFirebaseConfig = {
    attachAuthIsReady: true,
    enableRedirectHandling: false,
    userProfile: 'v2/users',
};

let composeEnhancers;
if (process.env.NODE_ENV === 'test') {
    composeEnhancers = compose;
} else {
    // do not use the redux dev tools when testing as they
    // interfere with jest
    composeEnhancers = composeWithDevTools({
        name: Platform.OS,
        hostname: 'localhost',
        port: 5678,
        realtime: false,
    });
}

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
};

const persistedReducers = persistReducer(persistConfig, reducers);

// the initial state argument is only used for jest
// direct imports of createNewStore should only happen in tests
export const createNewStore = (initialState?: {} = {}) => createStore(
    persistedReducers,
    initialState,
    composeEnhancers(
        applyMiddleware(thunkMiddleware.withExtraArgument(getFirebase)),
        reactReduxFirebase(firebase, reactFirebaseConfig),
    ),
);

// this is the main store used by the app
const store = createNewStore();
const persistor = persistStore(store);

export default function setupStore() {
    return { store, persistor };
}
