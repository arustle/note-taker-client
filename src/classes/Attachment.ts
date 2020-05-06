import {AttachmentDto} from "../api/dtos/AttachmentDto";

export class Attachment {
    attachmentId: string;
    name: string;
    lastModifiedDate: string;
    size: number;
    type: string;
    url: string;

    uploadUrl?: string;
    uploadFile?: any;
    // uploadFile?: File | Blob;



    constructor (dto: AttachmentDto) {
        this.attachmentId = dto.attachmentId;
        this.url = dto.url;
        this.name = dto.name;
        this.lastModifiedDate = dto.lastModifiedDate;
        this.size = dto.size;
        this.type = dto.type;
    }


}