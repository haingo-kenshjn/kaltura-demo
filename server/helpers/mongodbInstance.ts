import envProfile from '../commons/envProfile';
import models from '../models/models'

let mongoose = require('mongoose');

export default {
    connect: async(): Promise<any> => {
        return mongoose.connect(envProfile.getProfile().MONGO_URL, {useNewUrlParser: true});
    },

    getMediaById: async(id: string): Promise<any> => {
        return models.Media.findById(id);
    },

    getMedias: async(): Promise<any> => {
        return models.Media.findAll();
    },

    getMediaByExternalId: async(id: string): Promise<any> => {
        return models.Media.findByExternalId(id);
    },

    findByExternalAndUpdate: async(id: string, newMediaData): Promise<any> => {
        return models.Media.findByExternalAndUpdate(id, newMediaData);
    },

    findByIdAndUpdate: async(id: string, newMediaData): Promise<any> => {
        return models.Media.findByIdAndUpdate(id, newMediaData);
    },

    saveMedia: async(newMedia: any): Promise<any> => {
        const media1 = new models.Media(newMedia);
        return await media1.save();
    }
}