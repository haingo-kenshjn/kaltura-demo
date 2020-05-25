import envProfile from '../commons/envProfile';
import { EventNotificationTemplateType, KalturaHttpNotificationTemplate } from 'kaltura-client';

const kaltura = require('kaltura-client');
const kalturaConfig = new kaltura.Configuration();
kalturaConfig.serviceUrl = 'https://www.kaltura.com';
const client = new kaltura.Client(kalturaConfig);

let secret = envProfile.getProfile().KALTURA_SECRET;
let userId = envProfile.getProfile().KALTURA_USER_ID;
let type = kaltura.enums.SessionType.ADMIN;
let partnerId = envProfile.getProfile().KALTURA_PARTNER_ID;
let expiry = envProfile.getProfile().KALTURA_EXPIRY;
let privileges = "";

const createMediaEntry = async (name: string, description: string): Promise<any> => {
    let entry = new kaltura.objects.MediaEntry();
    entry.mediaType = kaltura.enums.MediaType.VIDEO;
    entry.name = name;
    entry.description = description;

    return kaltura.services.media.add(entry)
        .execute(client)
        .then(result => {
            return result;
        });
};

const uploadMedia = async (uploadTokenId: string, fileData: any, resume: boolean, finalChunk: boolean, resumeAt: number): Promise<any> => {
    return kaltura.services.uploadToken.upload(uploadTokenId, fileData, resume, finalChunk, resumeAt)
        .execute(client)
        .then(result => {
            return result;
        });
};

const addUploadedFileToEntry = async (entryId: string, tokenId: string): Promise<any> => {
    let resource = new kaltura.objects.UploadedFileTokenResource();
    resource.token = tokenId;

    return kaltura.services.media.addContent(entryId, resource)
        .execute(client)
        .then(result => {
            console.log("addUploadedFileToEntry", result);
            return result;
        });
};

const listNotificationTemplate = async (): Promise<any> => {
    let filter = new kaltura.objects.HttpNotificationTemplateFilter();
    let pager = new kaltura.objects.FilterPager();


    return kaltura.services.eventNotificationTemplate.listAction(filter, pager)
        .execute(client)
        .then(result => {
            return updateNotificationTemplateEnpoint(result.objects)
                .then(result => {
                    return result;
                })
        });
};

const updateNotificationTemplateEnpoint = async (listTemplate: KalturaHttpNotificationTemplate[]): Promise<any> => {
    listTemplate
        .filter(template => template.systemName === 'HTTP_ENTRY_STATUS_CHANGED')
        .forEach(template => {
            let eventNotificationTemplate = new kaltura.objects.HttpNotificationTemplate();
            eventNotificationTemplate.method = kaltura.enums.HttpNotificationMethod.POST;
            eventNotificationTemplate.url = envProfile.getProfile().CALLBACK_URL + envProfile.getProfile().NOTIFICATION_ROUTE;
            eventNotificationTemplate.username = envProfile.getProfile().USER;
            eventNotificationTemplate.password = envProfile.getProfile().PASSWORD;
            eventNotificationTemplate.authenticationMethod = kaltura.enums.HttpNotificationAuthenticationMethod.BASIC;
            eventNotificationTemplate.data = new kaltura.objects.HttpNotificationDataFields();

            kaltura.services.eventNotificationTemplate.update(template.id, eventNotificationTemplate)
                .execute(client)
                .then(result => { });
        })
};

export default {
    startKalturalSession: async (): Promise<any> => {
        return kaltura.services.session.start(secret, userId, type, partnerId, expiry, privileges)
            .completion((success, ks) => {
                if (!success) throw new Error(ks.message);
                client.setKs(ks);

                listNotificationTemplate().then(result => { return result; });
            })
            .execute(client);
    },

    getMediaById: async (id: string, version: number = -1): Promise<any> => {
        return kaltura.services.media.get(id, version)
            .execute(client)
            .then(result => {
                return result;
            });
    },

    uploadMedia: async (fileData: any, name: string, description: string, resume: boolean, finalChunk: boolean, resumeAt: number): Promise<any> => {
        let uploadTokenId = await kaltura.services.uploadToken.add(new kaltura.objects.UploadToken())
            .execute(client)
            .then((result: { id: any; }) => {
                return result.id;
            });

        console.log("uploadTokenId", uploadTokenId);
        let uploadResult = await uploadMedia(uploadTokenId, fileData, resume, finalChunk, resumeAt);
        if (uploadResult) {
            let entry = await createMediaEntry(name, description);
            return addUploadedFileToEntry(entry.id, uploadTokenId);
        }
    }
};
