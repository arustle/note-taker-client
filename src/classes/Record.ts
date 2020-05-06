import {GetRecordDto} from "../api/dtos/GetRecordDto";
import {Attachment} from "./Attachment";

export class Record {
    recordId: string;
    notes: string;
    entryDate: string;
    recordType: string;
    attachments?: Attachment[];

    constructor (apiRecord: GetRecordDto | undefined) {
        if (!apiRecord) {
            this.recordId = '';
            this.notes = '';
            this.entryDate = (new Date()).toISOString();
            this.recordType = '';
            return;
        }
        this.recordId = apiRecord.recordId;
        this.notes = apiRecord.notes;
        this.entryDate = apiRecord.entryDate;
        this.recordType = apiRecord.recordType;

        if (Array.isArray(apiRecord.attachments)) {
            this.attachments = apiRecord.attachments.map(x => new Attachment(x))
        }
    }
}