
import Axios from 'axios';
import { apiEndpoint } from '../auth/auth.config';
import {Record} from "../classes/Record";
import {GetRecordDto} from "./dtos/GetRecordDto";


import {GetUploadInfoDto} from "./dtos/GetUploadInfoDto";
import {CreateRecordDto} from "./dtos/CreateRecordDto";
import {UpdateRecordDto} from "./dtos/UpdateRecordDto";

const data: GetRecordDto[] = [
    {
        recordId: 'r-1',
        entryDate: '2020-04-12T09:15:00',
        recordType: 'ANIMALS',
        notes: 'We’ve learned that useEffect lets us express different kinds of side effects after a component renders.',
    },
    {
        recordId: 'r-2',
        entryDate: '2020-04-11T14:23:00',
        recordType: 'CARS',
        notes: 'One of the problems we outlined in the Motivation for Hooks is that class lifecycle methods often contain unrelated logic, but related logic gets broken up into several methods. Here is a component that combines the counter and the friend status indicator logic from the previous examples',
        attachments: [
            {
                attachmentId: 'i-1',
                name: 'snowy owl',
                url: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.EyaI8-wvRXNeMvKD4B6MYAHaE5%26pid%3DApi&f=1',
                lastModifiedDate: '',
                type: '',
                size: 0,
            },
        ],
    },
    {
        recordId: 'new',
        entryDate: '',
        recordType: '',
        notes: '',
    }
];


export async function getRecordsCCC (): Promise<Record[]> {
    return data.map((x: GetRecordDto) => (new Record(x)));
}
export async function getRecord (idToken: string, recordId: string): Promise<Record> {
    const response = await Axios.get(`${apiEndpoint}/records/${recordId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
    })

    return new Record(response.data.item);
}
export async function getRecords (idToken: string): Promise<Record[]> {
    const response = await Axios.get(`${apiEndpoint}/records`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
    })
    return response.data.items.map((x: GetRecordDto) => (new Record(x)))
}

export async function createRecord(
    idToken: string,
    newRecord: CreateRecordDto
): Promise<Record> {
    const response = await Axios.post(`${apiEndpoint}/records`,  newRecord, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }
    })
    return response.data.item
}

export async function updateRecord(
    idToken: string,
    recordId: string,
    newRecord: UpdateRecordDto
): Promise<void> {
    await Axios.post(`${apiEndpoint}/records/${recordId}`,  newRecord, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }
    })
    return;
}

export async function deleteRecord(
    idToken: string,
    recordId: string
): Promise<void> {
    await Axios.delete(`${apiEndpoint}/records/${recordId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }
    })
    return;
}
export async function getUploadInfo(
    idToken: string
): Promise<GetUploadInfoDto> {

    // return 'upload url';
    const response = await Axios.post(`${apiEndpoint}/attachments/upload-info`, '', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }
    })
    return response.data
}

export async function uploadFile(uploadUrl: string, file: Buffer | Blob | File): Promise<void> {
    await Axios.put(uploadUrl, file)
}