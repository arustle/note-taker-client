import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel,
    IonFab, IonFabButton, IonIcon,
} from '@ionic/react';
import React from 'react';
import './RecordList.css';
import { History } from 'history';

import {getRecords} from '../api/recordsApi'
import {Record} from "../classes/Record";
import {addCircleOutline} from "ionicons/icons";
import {useAuth} from "../auth/AuthProvider";
import moment from "moment";

const Item: React.FC<{ record: Record }> = ({record}) => {
    return (
        <IonItem routerLink={`/records/${record.recordId}`}>
            <IonLabel>{moment(record.entryDate).format('YYYY MMM DD - hh:mm a')}</IonLabel>
            <IonLabel>{record.recordType}</IonLabel>
            <IonLabel>{record.notes}</IonLabel>
        </IonItem>
    );
}


interface ItemsProps {
    history: History;
}


const RecordList: React.FC<ItemsProps> = (props) => {
    const [records, setRecords] = React.useState<Record[]>([]);

    const auth = useAuth();

    React.useEffect(() => {
        getRecords(auth.idToken).then(recs => setRecords(recs));
    }, [auth.idToken]);


    React.useEffect(() => {
       console.log('renderrrrr');

       return () => console.log('cleanupppppp');
    }, []);
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Items</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Items</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonList>
                    {records.map(x => (<Item key={x.recordId} record={x} />))}
                </IonList>

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => {props.history.push("records/new")}}>
                        <IonIcon icon={addCircleOutline} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default RecordList;
