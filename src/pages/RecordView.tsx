import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonDatetime,
    IonSelect,
    IonSelectOption,
    IonList,
    IonItem,
    IonLabel,
    IonTextarea,
    IonImg,
    IonThumbnail,
    IonIcon,
    IonButton, IonGrid, IonCol, IonRow,
} from '@ionic/react';
import React from 'react';
import './RecordList.css';

import {Record} from "../classes/Record";
import {camera} from "ionicons/icons";
import usePhotoGallery from "../hooks/usePhotoGallery";
import FilePicker from "../components/FilePicker";
import {Attachment} from "../classes/Attachment";
import {useAuth} from "../auth/AuthProvider";
import {createRecord, getUploadInfo, updateRecord, deleteRecord} from "../api/recordsApi";
import {GetUploadInfoDto} from "../api/dtos/GetUploadInfoDto";
import useUploader from "../hooks/useUploader";
import {generateCreateRecordDto} from "../api/dtos/CreateRecordDto";

import historyLib from 'history';

const RecordView: React.FC<{ record: Record, history: historyLib.History }> = ({record, history}) => {
    const { takePhoto } = usePhotoGallery();
    const [entryDate, setEntryDate] = React.useState<string>(record.entryDate);
    const [recordType, setRecordType] = React.useState<string>(record.recordType);
    const [notes, setNotes] = React.useState<string>(record.notes);
    const [attachments, setAttachments] = React.useState<Attachment[]>(record.attachments || []);


    const auth = useAuth();
    const uploader = useUploader();

    const uploadFiles = (newAttachments: Attachment[]) => {
        Promise.all(newAttachments.map(() => getUploadInfo(auth.idToken)))
            .then((infos: GetUploadInfoDto[]) => {

                infos.forEach((info, i) => {
                    newAttachments[i].uploadUrl = info.uploadUrl;
                    newAttachments[i].attachmentId = info.attachmentId;
                    uploader.uploadAttachment(newAttachments[i])
                        .catch((err) => console.error('Upload Error-62', err))
                })


                setAttachments(attachments.concat(newAttachments));

            });
    };

    const handleSaveRecord = async (): Promise<void> => {
        const rec = generateCreateRecordDto({
            recordId: record.recordId,
            entryDate: entryDate,
            recordType,
            notes,
            attachments
        });


        let recId = rec.recordId;
        if (rec.recordId === 'new') {
            const newRec = await createRecord(auth.idToken, rec);
            recId = newRec.recordId;
            // history.push(newRec.recordId);
        } else {
            await updateRecord(auth.idToken, rec.recordId, rec);
        }
        history.push(`/records#${recId}`);

    }

    const handleDeleteRecord = async () => {
        await deleteRecord(auth.idToken, record.recordId);
        history.push('/records');
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Record</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Record</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonGrid>
                    <IonRow>
                        <IonCol></IonCol>
                        <IonCol>
                            <IonList>
                                <IonItem>
                                    <IonLabel>Created</IonLabel>
                                    <IonDatetime
                                        displayFormat={'MMM DD, YYYY HH:mm'}
                                        value={entryDate}
                                        onIonChange={(e) => {
                                            setEntryDate(e.detail.value!)
                                        }}
                                    />
                                </IonItem>
                                <IonItem>
                                    <IonLabel>Record Type</IonLabel>
                                    <IonSelect
                                        value={recordType}
                                        onIonChange={(e) => {
                                            setRecordType(e.detail.value)
                                        }}
                                    >
                                        <IonSelectOption value="ANIMALS">Animal</IonSelectOption>
                                        <IonSelectOption value="CARS">Cars</IonSelectOption>
                                        <IonSelectOption value="PEOPLE">People</IonSelectOption>
                                    </IonSelect>
                                </IonItem>
                                <IonItem>
                                    <IonLabel position="stacked">Notes</IonLabel>
                                    <IonTextarea
                                        value={notes}
                                        onIonChange={(e) => {
                                            setNotes(e.detail.value!)
                                        }}
                                    />
                                </IonItem>
                                <IonItem>
                                    <IonLabel position="stacked">
                                        Images
                                        <FilePicker
                                            onSelect={(newAttachments) => {
                                                uploadFiles(newAttachments);
                                            }}
                                        />
                                        <IonButton onClick={() => takePhoto(uploadFiles)}>
                                            <IonIcon icon={camera} />
                                        </IonButton>
                                    </IonLabel>
                                    {
                                        (attachments || []).map(attachment => (
                                            <IonItem key={attachment.attachmentId}>
                                                <IonThumbnail slot="start">
                                                    <IonImg src={attachment.url} />
                                                </IonThumbnail>
                                                <IonLabel>{attachment.name}</IonLabel>
                                            </IonItem>
                                        ))
                                    }
                                </IonItem>
                            </IonList>
                            <IonButton onClick={() => handleSaveRecord()}>
                                Save
                            </IonButton>
                            <IonButton onClick={() => handleDeleteRecord()}>
                                Delete
                            </IonButton>
                        </IonCol>
                        <IonCol></IonCol>

                    </IonRow>

                </IonGrid>

            </IonContent>
        </IonPage>
    );
};

export default RecordView;
