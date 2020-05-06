import {IonContent, IonHeader, IonItem, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import React from 'react';
import './Home.css';

const Home: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
          <IonItem>
              <div>An application to record your notes.</div>
          </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Home;
