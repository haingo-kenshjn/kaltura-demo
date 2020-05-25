import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as busboy from 'connect-busboy';
import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import * as path from 'path';
import * as requestContext from 'request-context';
import routes from './routes';
import { CommonError } from './commons/commonError';


import GenericResponseException from './models/response/genericResponsException';
import { ResponseCode } from './commons/const';
import envProfile from './commons/envProfile';

import * as uuid from 'uuid';

export class Server {
  public app: express.Application;

  constructor() {
    const self = this;
    /***************************
     * Express Initialize
     ***************************/
    this.app = express();
    this.app.set('etag', false);

    // l7 health check
    let healthy = true;
    this.app
      .get('/monitor/l7check', (req, res, next) => {
        res.status(healthy ? 200 : 503);
        res.end();
      })
      .head('/monitor/l7check', (req, res, next) => {
        res.status(healthy ? 200 : 503);
        res.end();
      })
      .post('/monitor/l7check/on', (req, res, next) => {
        healthy = true;
        res.status(200);
        res.end();
      })
      .post('/monitor/l7check/off', (req, res, next) => {
        healthy = false;
        res.status(200);
        res.end();
      });

    this.app.use(busboy());
    this.app.use(bodyParser.json({ limit: '2mb' }));
    this.app.use(bodyParser.urlencoded({ limit: '2mb', extended: false }));
    this.app.use(
      bodyParser.raw({
        inflate: true,
        limit: '100kb',
        type: 'application/octet-stream',
      }),
    );
    this.app.use(cookieParser());
    this.app.use(requestContext.middleware('request'));

    this.app.use(async (req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');

     res.setHeader('Pragma', 'no-cache');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        res.setHeader('Content-Disposition', 'inline; filename="files.json"');

      const startTime = Date.now();

      const userSessionId = req.header('X-AUTH-SESSION');
      const guestSessionId = req.header('X-GUESS-SESSION');

      let requestId = req.header('X-REQUEST-ID');
      if (!requestId) {
        requestId = uuid.v4();
        req.headers['X-REQUEST-ID'] = requestId;
      }
      requestContext.set('request:requestId', requestId);
      if (userSessionId) {
        // const sessionInfo = await authService.fetchSessionInfo(userSessionId);
        // requestContext.set('request:sessionInfo', sessionInfo);
      }
      if (guestSessionId) {
        requestContext.set('request:guestSessionId', guestSessionId);
      }
      
      next();
    });

    this.app.use('/', routes);

    this.app.use((err: CommonError, req: Request, res: Response, next: NextFunction) => {
      if (err.httpCode) {
        res.status(err.httpCode).json(new GenericResponseException(err).makeResponse());
      } else {
        res.status(parseInt(ResponseCode.BadRequest, 10)).json(new GenericResponseException(err).makeResponse());
      }
    });

    const options = {
      swaggerOptions: {
        docExpansion: 'none',
      },
      explorer: true,
    };
  }
}
