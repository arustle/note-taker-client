import React from 'react';
import './RecordList.css';
import RecordView from "./RecordView";

import {Record} from "../classes/Record";
import {RouteComponentProps} from "react-router-dom";
import {getRecord} from "../api/recordsApi";
import {useAuth} from "../auth/AuthProvider";


export default (route: RouteComponentProps<any>) => {
    const [record, setRecord] = React.useState<Record | null>(null);

    const auth = useAuth();

    React.useEffect(() => {
        getRecord(auth.idToken, route.match.params.recordId).then(rec => setRecord(rec));
    }, [auth.idToken, route.match.params.recordId]);

    if (!record) {
        return (
            <div>Loading</div>
        );
    }

    return (
        <RecordView record={record} history={route.history} />
    );
};
