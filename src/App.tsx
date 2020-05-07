import React from 'react';
import {Route, Switch} from 'react-router-dom';
// const IonTabs = require('@ionic/react');
import {
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
} from '@ionic/react';
import {listOutline, homeOutline} from 'ionicons/icons';
import Home from './pages/Home';
import RecordList from './pages/RecordList';
import LogIn from './pages/Login';
import RecordView from './pages/RecordView.route';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import {useAuth} from "./auth/AuthProvider";


const App: React.FC<any> = () => {

    const auth = useAuth();


    if (!auth.isAuthenticated()) return (<LogIn auth={auth} />);



    // @ts-ignore
    return (
        <IonTabs>
            <IonRouterOutlet>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/records" component={RecordList} />
                    <Route exact path="/records/:recordId" component={RecordView} />
                </Switch>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
                <IonTabButton tab="home" href="/">
                    <IonIcon icon={homeOutline}/>
                    <IonLabel>Home</IonLabel>
                </IonTabButton>
                <IonTabButton tab="records" href="/records">
                    <IonIcon icon={listOutline}/>
                    <IonLabel>Records</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    );
};

export default App;
