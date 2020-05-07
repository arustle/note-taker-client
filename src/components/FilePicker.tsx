import React from 'react';
import './ExploreContainer.css';
import {IonButton, IonIcon} from "@ionic/react";
import {folderOpenOutline} from "ionicons/icons";
import {Attachment} from "../classes/Attachment";
import moment from "moment";

interface FilePickerProps {
    onSelect: (attachments: Attachment[]) => void;
}


const FilePicker: React.FC<FilePickerProps> = ({onSelect}) => {
    const inputRef = React.useRef<HTMLInputElement>(null);


    const pickFiles = (fileSelectEvent: React.ChangeEvent<HTMLInputElement>) => {
        const selFiles = inputRef.current?.files;
        if (!selFiles?.length) return;
        const attachments: Attachment[] = Array.from(selFiles).map(file => {
            console.log('selectFile-22', file)
            const att = new Attachment({
                attachmentId: "",
                lastModifiedDate: moment(file.lastModified).toISOString(),
                name: file.name,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file)
            });

            att.uploadFile = file;

            return att;
        });



        onSelect(attachments);

        // reset selection
        fileSelectEvent.target.value = '';
    };


    return (
        <>
            <input ref={inputRef} type='file' style={{ opacity: 0, }} onChange={pickFiles} multiple />

            <IonButton onClick={() => inputRef?.current?.click()}>
                <IonIcon icon={folderOpenOutline} />
            </IonButton>
        </>
    );
};

export default FilePicker;
