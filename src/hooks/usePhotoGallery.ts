import { useState } from "react";
import { useCamera } from '@ionic/react-hooks/camera';
import { useFilesystem, base64FromPath } from '@ionic/react-hooks/filesystem';
// import { useStorage } from '@ionic/react-hooks/storage';
import { isPlatform } from '@ionic/react';
import {CameraResultType, CameraPhoto, Capacitor, FilesystemDirectory, CameraSource} from "@capacitor/core";
import {Attachment} from "../classes/Attachment";

// const PHOTO_STORAGE = "photos";

export default function usePhotoGallery() {

    const [photos, setPhotos] = useState<Photo[]>([]);
    const { getPhoto } = useCamera();
    const { deleteFile, getUri, readFile, writeFile } = useFilesystem();
    // const { get, set } = useStorage();

    // useEffect(() => {
    //     const loadSaved = async () => {
    //         const photosString = await get(PHOTO_STORAGE);
    //         const photosInStorage = (photosString ? JSON.parse(photosString) : []) as Photo[];
    //         // If running on the web...
    //         if (!isPlatform('hybrid')) {
    //             for (let photo of photosInStorage) {
    //                 const file = await readFile({
    //                     path: photo.filepath,
    //                     directory: FilesystemDirectory.Data
    //                 });
    //                 // Web platform only: Save the photo into the base64 field
    //                 photo.base64 = `data:image/jpeg;base64,${file.data}`;
    //             }
    //         }
    //         setPhotos(photosInStorage);
    //     };
    //     loadSaved().then();
    // }, [get, readFile]);

    const takePhoto = async (uploadFiles?: (attachments: Attachment[]) => void) => {
        const cameraPhoto = await getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100
        });
        const fileName = new Date().getTime() + '.jpeg';
        const savedFileImage = await savePicture(cameraPhoto, fileName);
        const newPhotos = [savedFileImage, ...photos];
        setPhotos(newPhotos);

        if (typeof uploadFiles === 'function') {
            const file = await fetch(savedFileImage.webviewPath!).then(r => r.blob());
            const attachment = new Attachment({
                attachmentId: "",
                lastModifiedDate: new Date().toISOString(),
                name: savedFileImage.filename,
                size: file.size,
                type: file.type,
                url: savedFileImage.webviewPath!,
            });
            attachment.uploadFile = file;
            uploadFiles([
                attachment
            ]);
        }
        // await set(PHOTO_STORAGE,
        //     isPlatform('hybrid')
        //         ? JSON.stringify(newPhotos)
        //         : JSON.stringify(newPhotos.map(p => {
        //             // Don't save the base64 representation of the photo data,
        //             // since it's already saved on the Filesystem
        //             const photoCopy = { ...p };
        //             delete photoCopy.base64;
        //             return photoCopy;
        //         })));

    };

    const savePicture = async (photo: CameraPhoto, fileName: string) => {
        let base64Data: string;
        // "hybrid" will detect Cordova or Capacitor;
        if (isPlatform('hybrid')) {
            const file = await readFile({
                path: photo.path!
            });
            base64Data = file.data;
        } else {
            base64Data = await base64FromPath(photo.webPath!);
        }
        await writeFile({
            path: fileName,
            data: base64Data,
            directory: FilesystemDirectory.Data
        });
        return getPhotoFile(photo, fileName);
    };


    const getPhotoFile = async (cameraPhoto: CameraPhoto, filename: string): Promise<Photo> => {
        if (isPlatform('hybrid')) {
            // Get the new, complete filepath of the photo saved on filesystem
            const fileUri = await getUri({
                directory: FilesystemDirectory.Data,
                path: filename
            });

            // Display the new image by rewriting the 'file://' path to HTTP
            // Details: https://ionicframework.com/docs/building/webview#file-protocol
            return {
                filename,
                filepath: fileUri.uri,
                webviewPath: Capacitor.convertFileSrc(fileUri.uri),
            };
        }
        else {
            // Use webPath to display the new image instead of base64 since it's
            // already loaded into memory
            return {
                filename,
                filepath: filename,
                webviewPath: cameraPhoto.webPath
            };
        }
    };

    const deletePhoto = async (photo: Photo) => {
        // Remove this photo from the Photos reference data array
        const newPhotos = photos.filter(p => p.filepath !== photo.filepath);

        // Update photos array cache by overwriting the existing photo array
        // await set(PHOTO_STORAGE, JSON.stringify(newPhotos));

        // delete photo file from filesystem
        const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
        await deleteFile({
            path: filename,
            directory: FilesystemDirectory.Data
        });
        setPhotos(newPhotos);
    };

    return {
        deletePhoto,
        photos,
        takePhoto
    };
}

export interface Photo {
    filename: string;
    filepath: string;
    webviewPath?: string;
    base64?: string;
}

