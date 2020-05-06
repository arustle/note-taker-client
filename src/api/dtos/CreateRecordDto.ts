import {Record} from "../../classes/Record";

export interface CreateRecordDto {
    recordId: string;
    entryDate: string;
    notes: string;
    recordType: string;
    attachments: {
        attachmentId: string;
        name: string;
        lastModifiedDate: string;
        size: number;
        type: string;
    }[];
}

export const generateCreateRecordDto = (record: Record): CreateRecordDto => {
    return {
        recordId: record.recordId,
        entryDate: record.entryDate,
        notes: record.notes,
        recordType: record.recordType,
        attachments: (record.attachments || []).map(x => ({
            attachmentId: x.attachmentId,
            name: x.name,
            lastModifiedDate: x.lastModifiedDate,
            size: x.size,
            type: x.type,
        }))
    }
}