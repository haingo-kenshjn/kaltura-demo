import * as _ from 'lodash';
import kalturaInstance from '../helpers/kalturaInstance';
import mongodbInstance from '../helpers/mongodbInstance';


export default {
    getMediabyId: async(id: string): Promise<any> => {
        return await mongodbInstance.getMediaById(id);
    },

    getMedias: async(): Promise<any> => {
        return await mongodbInstance.getMedias();
    },

    getMediabyExternalId: async(id: string): Promise<any> => {
        return await mongodbInstance.getMediaByExternalId(id);
    },

    updateMediaByExternalId: async(id: string, newData): Promise<any> => {
        return await mongodbInstance.findByExternalAndUpdate(id, newData);
    },

    getMediabyIdFromKaltura: async(id: string, version: number = -1): Promise<any> => {
        return await kalturaInstance.getMediaById(id, version);
    },
    
    uploadMedia: async(fileData: any, name: string, description: string): Promise<any> => {
        let resume = false;
        let finalChunk = true;
        let resumeAt = -1;

        let mediaModel = await mongodbInstance.saveMedia({
            name: name,
            status: "7"
        });

        kalturaInstance.uploadMedia(fileData, name, description, resume, finalChunk, resumeAt)
            .then(kalturaEntry => {
                mongodbInstance.findByIdAndUpdate(mediaModel._id, {
                    externalId: kalturaEntry.id,
                    thumbnailUrl: kalturaEntry.thumbnailUrl,
                    cdnUrl: kalturaEntry.dataUrl,
                    status: kalturaEntry.status
                });
            })
        
        return mediaModel;
    },
}
