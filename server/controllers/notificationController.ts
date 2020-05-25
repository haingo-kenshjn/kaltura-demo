import { NextFunction, Request, Response } from 'express';
import { NotificationRequestParams } from '../models/notificationRequestParams';
import mediaService from '../services/mediaService';

export const notification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestParams = NotificationRequestParams.createFromRequest(req);
    console.log("Receive notification", requestParams);

    await mediaService.updateMediaByExternalId(requestParams.id, {
       status: requestParams.status
    });

    res.json({});
  } catch (error) {
    next(error);
  }
}
