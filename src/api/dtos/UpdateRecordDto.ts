import {Record} from "../../classes/Record";

export interface UpdateRecordDto {
    notes: string;
    entryDate: string;
    recordType: string;
    attachments: {
        attachmentId: string;
        name: string;
        lastModifiedDate: string;
        size: number;
        type: string;
    }[];
}

export const generateUpdateRecordDto = (record: Record): UpdateRecordDto => {
    return {
        notes: "",
        recordType: "",
        entryDate: record.entryDate,
        attachments: (record.attachments || []).map(x => ({
            attachmentId: x.attachmentId,
            name: x.name,
            lastModifiedDate: x.lastModifiedDate,
            size: x.size,
            type: x.type,
        }))
    }
}