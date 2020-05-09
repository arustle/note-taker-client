import React from "react";
import Auth0 from "auth0-js";
import {createBrowserHistory} from 'history';
import {AUTH_CONFIG} from "./auth.config";

import { Plugins } from '@capacitor/core';
import {IonReactRouter} from "@ionic/react-router";
import {IonApp} from "@ionic/react";
import {Redirect, Route, Switch} from "react-router-dom";
const { Storage } = Plugins;

const history = createBrowserHistory();

const auth0 = new Auth0.WebAuth({
    clientID: AUTH_CONFIG.clientId,
    domain: AUTH_CONFIG.domain,
    redirectUri: AUTH_CONFIG.redirectUri,
    responseType: 'token id_token',
    scope: 'openid'
})

const storageSet = async (keyName: string, value: any) => {
    await Storage.set({
        key: keyName,
        value: JSON.stringify(value),
    });
};
const storageGet = async (keyName: string) => {
    const result: any = await Storage.get({
        key: keyName,
    });

    // return result.value;
    return JSON.parse(result.value);
};
const storageRemove = async (keyName: string): Promise<void> => {
    return await Storage.remove({
        key: keyName,
    });
};




interface ProvideAuth {
    login: () => void;
    logout: () => void;
    handleAuthentication: () => void;
    isAuthenticated: () => boolean;
    idToken: string;
}

const useProvideAuth = (): ProvideAuth => {
    // const [ isLoggedIn, setIsLoggedIn ] = React.useState(false);
    // const [ accessToken, setAccessToken ] = React.useState('');
    const [ idToken, setIdToken ] = React.useState('');
    const [ expiresAt, setExpiresAt ] = React.useState(0);


    React.useEffect(() => {
        Promise.all([
            // storageGet('isLoggedIn').then(setIsLoggedIn),
            // storageGet('accessToken').then(setAccessToken),
            storageGet('idToken').then(setIdToken),
            storageGet('expiresAt').then(setExpiresAt),
        ]).then()
    }, []);

    const login = () => {
        auth0.authorize();
    };


    // TODO: determine authResult type
    const setSession = (authResult: any) => {
        // Set the time that the access token will expire at
        let tempExpiresAt = (authResult.expiresIn * 1000) + new Date().getTime();

        // Set isLoggedIn flag in localStorage
        // storageSet('isLoggedIn', true).then();
        storageSet('accessToken', authResult.accessToken).then();
        storageSet('idToken', authResult.idToken).then();
        storageSet('expiresAt', tempExpiresAt).then();

        // setAccessToken(authResult.accessToken);
        setIdToken(authResult.idToken);
        setExpiresAt(tempExpiresAt);


        // navigate to the home route
        history.replace('/');
    }
    const clearSession = () => {
        // storageRemove('isLoggedIn').then();
        // storageRemove('accessToken').then();
        storageRemove('idToken').then();
        storageRemove('expiresAt').then();

        // setIsLoggedIn(false);
        // setAccessToken('');
        setIdToken('');
        setExpiresAt(0);

        // navigate to the home route
        history.replace('/');
    }

    const logout = () => {
        // Remove tokens and expiry time
        clearSession();

        auth0.logout({
            returnTo: window.location.origin
        });
    }

    const handleAuthentication = () => {
        auth0.parseHash((err, authResult) => {
            console.log('authResultauthResult', authResult)

            if (authResult && authResult.accessToken && authResult.idToken) {
                console.log('Access token: ', authResult.accessToken)
                console.log('id token: ', authResult.idToken)
                setSession(authResult);
            } else if (err) {
                history.replace('/');
                console.log(err);
                alert(`Error: ${err.error}. Check the console for further details.`);
            }
        });
    }

    // const renewSession = () => {
    //     auth0.checkSession({}, (err, authResult) => {
    //         if (authResult && authResult.accessToken && authResult.idToken) {
    //             setSession(authResult);
    //         } else if (err) {
    //             logout();
    //             console.log(err);
    //             alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
    //         }
    //     });
    // };

    const isAuthenticated = (): boolean => {
        // Check whether the current time is past the
        // access token's expiry time
        return Date.now() < expiresAt;
    }



    return {
        login,
        logout,
        isAuthenticated,
        handleAuthentication,
        idToken,
    };
}


export const AuthContext = React.createContext<any>(null);
export const useAuth = (): ProvideAuth => {
    console.log('aaaaa', React.useContext(AuthContext))
    return React.useContext(AuthContext);
}


export const AuthProvider: React.FC = (props)=> {

    const auth = useProvideAuth();

    return (
        <AuthContext.Provider value={auth}>
            <IonApp>
                <IonReactRouter>
                    <Switch>
                        <Route
                            path="/callback"
                            render={(props) => {
                                if (props) {
                                    const location = props.location
                                    if (/access_token|id_token|error/.test(location.hash)) {
                                        auth.handleAuthentication()
                                    }
                                }
                                return <Redirect to="/" />
                            }}
                        />
                        <Route>
                            {props.children}
                        </Route>
                    </Switch>
                </IonReactRouter>
            </IonApp>
        </AuthContext.Provider>
    );
}