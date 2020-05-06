import { useState } from "react";

import { uploadFile } from '../api/recordsApi';
import {Attachment} from "../classes/Attachment";

export default function useUploader () {
    const [ uploads, setUploads ] = useState<Attachment[]>([]);


    const uploadAttachment = async (attachment: Attachment) => {
        if (!attachment.uploadUrl || !attachment.uploadFile) {
            return;
        }
        setUploads(uploads.concat(attachment));
        await uploadFile(attachment.uploadUrl, attachment.uploadFile)
        setUploads(uploads.filter(x => x.attachmentId !== attachment.attachmentId));
    }


    return {
        uploads,
        uploadAttachment,
    }
}