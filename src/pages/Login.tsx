import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
    IonButton,
} from '@ionic/react';
import React from 'react';

export default (props: any): JSX.Element => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Login</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonButton
                    onClick={() => {
                        props.auth.login();
                    }}
                >
                    Login
                </IonButton>
            </IonContent>
        </IonPage>
    );
};
