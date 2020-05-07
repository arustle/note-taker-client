import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import App from "./App";
import {AuthProvider} from "./auth/AuthProvider";

import { defineCustomElements } from '@ionic/pwa-elements/loader';

defineCustomElements(window).then();
// ReactDOM.render(<AuthProvider><App /></AuthProvider>, document.getElementById('root'));
ReactDOM.render(<AuthProvider><App /></AuthProvider>, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
