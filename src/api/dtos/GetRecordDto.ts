import {AttachmentDto} from "./AttachmentDto";

export interface GetRecordDto {
    recordId: string;
    entryDate: string;
    notes: string;
    recordType: string;
    attachments?: AttachmentDto[];
}